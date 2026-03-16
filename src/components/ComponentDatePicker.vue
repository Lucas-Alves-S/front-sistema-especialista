<template>
  <!-- todo: add option to type date -->
  <div class="date-picker-root" ref="root">
    <BaseInput v-model="displayValue" :placeholder="text_placeholder" :iconLeft="'date_range'" :size="19"
      :readonly="true" :disabled="disabled" :label="label" :tooltip="tooltip" :clearable="props.clearable"
      @click="isOpen = !isOpen" @clear="handleClear">
    </BaseInput>

    <div class="calendar" v-show="isOpen">
      <div class="header">
        <span class="material-symbols-outlined next" @click="cursorDate = addMonths(cursorDate, -1)"
          style="cursor: pointer">keyboard_arrow_left</span>
        {{ monthYear }}
        <span class="material-symbols-outlined back" @click="cursorDate = addMonths(cursorDate, 1)"
          style="cursor: pointer">keyboard_arrow_right</span>
      </div>
      <div class="weekdays">
        <span v-for="(weekDay, index) in ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa']" :key="index" class="day"
          style="cursor: text">
          {{ weekDay }}
        </span>
      </div>
      <div class="days-wrapper">
        <span v-for="(day, index) in days" :key="index" class="day" :class="getDayClass(day)"
          @click="setSelectedDate(day)">{{ day.getDate() }}</span>
      </div>
      <div class="footer">
        <button @click="clickToday()">Hoje</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";

interface Props {
  range?: boolean;
  disabled?: boolean;
  label?: string;
  tooltip?: string;
  text_placeholder?: string;
  clearable?: boolean;
}

const model = defineModel<Date | Array<Date> | null>({
  required: true,
});
const props = defineProps<Props>();

const isOpen = ref<boolean>(false);
const displayValue = ref<string | null>(null);
const root = ref<HTMLElement | null>(null);
const cursorDate = ref<Date>(
  model.value instanceof Array
    ? new Date(model.value[0] ?? new Date())
    : new Date(model.value ?? new Date())
);
const tempDate = ref<Date | null>(null);

const monthYear = computed<string>(() =>
  capitalize(
    cursorDate.value.toLocaleString("pt-BR", { month: "long", year: "numeric" })
  )
);

const days = computed(() => {
  let startDate = new Date(
    cursorDate.value.getFullYear(),
    cursorDate.value.getMonth(),
    1
  );
  const fillerDays = startDate.getDay();
  startDate = addDays(startDate, fillerDays * -1);

  const finishDate = addDays(startDate, 41);

  return eachDay(startDate, finishDate);
});

const placeholder = computed(() => {
  if (model.value instanceof Date)
    return model.value.toLocaleDateString("pt-BR");

  if (tempDate.value != null) {
    return tempDate.value.toLocaleDateString("pt-BR").concat(" - ");
  }

  if (props.range && model.value && model.value.length > 0) {
    return model.value[0]!.toLocaleDateString("pt-BR")
      .concat(" - ")
      .concat(model.value[1].toLocaleDateString("pt-BR"));
  }

  return "";
});

function clickToday() {
  const today = new Date();

  if (isSameDay(cursorDate.value, today)) {
    setSelectedDate(today);
  } else {
    cursorDate.value = today;
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isSameDay(date: Date, compareDate: Date): boolean {
  date.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);
  return date.getTime() === compareDate.getTime();
}

/** Generates a list of dates between startDate and finishDate */
function eachDay(startDate: Date, finishDate: Date): Date[] {
  let difference = finishDate.getTime() - startDate.getTime();
  // convert epoch to days
  difference = Math.ceil(difference / (1000 * 3600 * 24));

  const result = [];
  for (let day = 0; day <= difference; day++) {
    result.push(addDays(startDate, day));
  }
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getDayClass(day: Date) {
  return {
    "other-month": day.getMonth() !== cursorDate.value.getMonth(),
    today: isSameDay(day, new Date()),
    weekend: day.getDay() === 0 || day.getDay() === 6,
    selected: model.value instanceof Date ? isSameDay(day, model.value) : false,
    "range-start":
      tempDate.value != null
        ? isSameDay(day, tempDate.value)
        : model.value instanceof Array
          ? isSameDay(day, model.value[0])
          : false,
    "range-end":
      tempDate.value == null && model.value instanceof Array && model.value[1]
        ? isSameDay(day, model.value[1])
        : false,
    range:
      tempDate.value == null &&
        model.value instanceof Array &&
        model.value[0] &&
        model.value[1]
        ? model.value[0] < day && day < model.value[1]
        : false,
  };
}

function setSelectedDate(newDate: Date) {
  if (!props.range) {
    setDate(newDate);
  } else {
    setDateRange(newDate);
  }
}

function setDate(newDate: Date) {
  if (model.value && isSameDay(model.value as Date, newDate)) {
    model.value = null;
  } else {
    model.value = newDate;
    cursorDate.value = newDate;
  }
}

function setDateRange(newDate: Date) {
  if (tempDate.value == null) {
    tempDate.value = newDate;
    cursorDate.value = newDate;
    return;
  }

  let arr = [];

  if (tempDate.value > newDate) {
    arr = [newDate, tempDate.value];
  } else {
    arr = [tempDate.value, newDate];
  }
  tempDate.value = null;
  model.value = arr;
  isOpen.value = false;
}

function handleClear() {
  cursorDate.value = new Date();
  model.value = null;

  if (isOpen.value) {
    isOpen.value = false;
  }
}

function handleClickOutside(event: MouseEvent) {
  const clickedElement = event.target as HTMLElement;
  if (root.value != clickedElement && !root.value?.contains(clickedElement)) {
    isOpen.value = false;
    if (tempDate.value) {
      tempDate.value = null;
    }
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  placeholder,
  (newVal) => {
    displayValue.value = newVal;
  },
  { immediate: true }
);

watch(displayValue, (newVal) => {
  if (!newVal && model.value !== null) {
    handleClear();
  }
});
</script>

<style scoped>
.date-picker-root {
  position: relative;
  width: fit-content;
}

.calendar {
  position: absolute;
  z-index: 1;
  margin-top: 0.4rem;
  user-select: none;

  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  padding: 0.8rem;
  gap: 0.2rem;
  width: fit-content;
  border-radius: 6px;

  border: 1px solid var(--color-overlay);
}

.header {
  display: flex;
  justify-content: space-between;
}

.next,
.back {
  &:hover {
    color: var(--color-accent);
  }
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 0.6rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* gap: 0.2rem; */
  gap: 2px;
  pointer-events: none;
}

.days-wrapper {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* gap: 0.2rem; */
  gap: 2px;
}

.day {
  display: flex;
  padding: 0.4rem;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  cursor: pointer;
}

.selected {
  border-radius: 4px;
  background-color: var(--color-primary);
}

.other-month {
  color: var(--color-subtext);
}

.range {
  background-color: color-mix(in srgb, var(--color-primary), transparent 45%);
}

.range-start,
.range-end {
  background-color: var(--color-primary);
}

.range-start {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.range-end {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.weekend:not(.other-month):not(.selected):not(.range):not(.range-start):not(.range-end),
.today:not(.other-month):not(.selected):not(.range):not(.range-start):not(.range-end) {
  color: var(--color-accent);
}
</style>
