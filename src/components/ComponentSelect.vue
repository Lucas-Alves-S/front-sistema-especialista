<template>
  <!-- todo: add option to type value -->
  <div class="select-root" ref="root" :style="width">
    <label v-if="label" :for="`input-${id}`">{{ label }}
      <span v-if="required && label" style="color: var(--color-danger)">*</span>
      <p v-if="description" class="description">{{ description }}</p>
      <div v-if="tooltip" class="tooltip-trigger" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
        <span class="material-symbols-outlined">help</span>

        <div v-if="showTooltip" class="tooltip-text">
          {{ tooltip }}
        </div>
      </div>
    </label>

    <div class="select-wrapper">
      <div v-if="iconLeft" class="left-section" :class="{ disabled }" style="cursor: pointer">
        <span class="material-symbols-outlined">{{ iconLeft }}</span>
      </div>

      <!-- todo: implement required -->
      <!-- todo: implement size atribute -->
      <button :id="`input-${id}`" :disabled="disabled" class="input" @click="isOpen = !isOpen">
        <span v-if="
          model == null ||
          options == null ||
          (Array.isArray(model) && model.length == 0)
        " class="placeholder">{{ placeholder }}</span>
        <template v-else>
          {{ selectedLabel }}
        </template>
      </button>

      <div class="right-section" :class="{ disabled }" @click="
        isClearable ? (model = null) : '';
      $emit('clear');
      " :style="{
        cursor: !disabled ? 'pointer' : 'default',
        pointerEvents: isClearable ? 'auto' : 'none',
      }">
        <span class="material-symbols-outlined">{{
          isClearable ? "close" : iconRight ?? "unfold_more"
        }}</span>
      </div>

      <transition>
        <div class="options-wrapper" v-show="isOpen">
          <template v-if="options == null">
            <p style="text-align: center; padding: 0.2rem">
              Nenhuma Opção Encontrada
            </p>
          </template>
          <template v-else>
            <template v-for="(option, index) in options" :key="index">
              <div class="option" :class="{ selected: isSelected(option[optionValue]) }"
                @click="setValue(option[optionValue])">
                <div v-if="!$slots.option">
                  {{ optionLabel ? option[optionLabel] : option }}
                </div>
                <slot v-else name="option" v-bind="option"></slot>
              </div>
            </template>
          </template>
        </div>
      </transition>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  getCurrentInstance,
} from "vue";

interface Props {
  multiple?: boolean;
  label?: string;
  description?: string;
  tooltip?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  clearable?: boolean;
  iconLeft?: string;
  iconRight?: string;
  size?: number;
  options?: any[] | null;
  optionLabel: string;
  optionValue: string;
}

const model = defineModel<unknown>();
const props = defineProps<Props>();
const id = ref<number>();
const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const showTooltip = ref(false);

const emits = defineEmits(["clear"]);

const padding = computed(() => {
  return {
    left: props.iconLeft ? "2rem" : "0.8rem",
    right: props.iconRight ? "2rem" : "0.8rem",
  };
});
const isClearable = computed(
  () => props.clearable && !props.disabled && model.value
);
const width = computed(() => {
  const size = props.size ?? 20;
  let padding = 1.6;

  if (props.iconLeft) {
    padding += 1.4;
  }

  if (props.iconRight) {
    padding += 1.4;
  }

  return { width: `calc(${size}ch + ${padding}rem)` };
});
const selectedLabel = computed(() => {
  if (model.value instanceof Array) {
    const temp = model.value;
    const values = props.options?.filter((option) =>
      temp.includes(option[props.optionValue])
    );
    if (values && values.length > 1) {
      return "Multiplas Seleções";
    }
    return values![0][props.optionLabel];
  }

  return props.options?.find(
    (option) => option[props.optionValue] === model.value
  )[props.optionLabel];
});

function setValue(value: unknown) {
  if (props.disabled) {
    return;
  }

  if (!props.multiple) {
    if (model.value === value) {
      model.value = null;
    } else {
      model.value = value;
    }
    isOpen.value = false;
    return;
  }

  if (!(model.value instanceof Array)) {
    model.value = [value];
    return;
  }

  // Create new array to not mess up reactivity
  let newArray: unknown[] | null = model.value.slice();

  const index = newArray.indexOf(value);
  if (index >= 0) {
    newArray.splice(index, 1);
  } else {
    newArray.push(value);
  }

  if (newArray.length === 0) {
    newArray = null;
  }

  model.value = newArray;
}

function isSelected(value: unknown) {
  if (model.value instanceof Array) {
    return model.value.includes(value);
  }
  return model.value === value;
}

function handleClickOutside(event: MouseEvent) {
  const clickedElement = event.target as HTMLElement;
  if (root.value && !root.value.contains(clickedElement)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  id.value = getCurrentInstance()?.uid;
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.select-root {
  width: calc(20ch + 1.6rem);
}

.description {
  color: var(--color-subtext);
  font-size: var(--font-size-small);
}

.tooltip-trigger {
  position: relative;
  display: inline-flex;
  color: var(--color-subtext);
}

.tooltip-text {
  position: absolute;
  width: max-content;
  max-width: 250px;
  background-color: var(--color-surface);
  color: var(--color-text);
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: var(--font-size-small);
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  transition: opacity 0.1s ease-in-out;
  border: 1px solid var(--color-overlay);
}

.error {
  color: var(--color-danger);
  font-size: var(--font-size-small);
}

.select-wrapper {
  position: relative;
}

.input {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  text-align: start;
  width: 100%;
  min-height: 1.8rem;

  padding-inline-start: v-bind("padding.left");
  padding-inline-end: 2rem;
}

.left-section,
.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.4rem;
  bottom: 0.4rem;

  &.disabled {
    cursor: default;
    color: color-mix(in hsl, var(--color-text), black 50%);
  }
}

.left-section {
  inset-inline-start: 0.4rem;
  pointer-events: none;
}

.right-section {
  inset-inline-end: 0.4rem;
}

.material-symbols-outlined {
  font-size: 1.2rem;
  translate: no;
  user-select: none;
}

.options-wrapper {
  position: absolute;
  width: 100%;
  margin-top: 0.3rem;
  border-radius: 4px;
  background-color: var(--color-surface);
  z-index: 1;
  padding: 0.3rem;

  border: 1px solid var(--color-overlay);
}

.option {
  position: relative;
  cursor: pointer;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  border-radius: 4px;

  &:hover {
    background-color: #00000028;
  }
}

.selected {
  padding-left: 1.8rem;

  &::before {
    position: absolute;
    top: 0.4rem;
    bottom: 0.4rem;
    content: "check";
    font-family: "Material Symbols Outlined";
    font-weight: bold;
    inset-inline-start: 0.4rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .option {
    padding-inline-start: calc(v-bind("padding.left") + 1.4rem);
  }

  .left-section {
    inset-inline-start: 1.8rem;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
