<template>
  <div class="input-root" :style="width">
    <label v-if="label" :for="`input-${id}`"
      >{{ label
      }}<span v-if="required && label" style="color: var(--color-danger)"
        >*</span
      >
      <p v-if="description" class="description">{{ description }}</p>
      <div
        v-if="tooltip"
        class="tooltip-trigger"
        @mouseover="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <span class="material-symbols-outlined">help</span>

        <div v-if="showTooltip" class="tooltip-text">
          {{ tooltip }}
        </div>
      </div>
    </label>

    <div class="input-wrapper">
      <div v-if="iconLeft" class="left-section" :class="{ disabled }">
        <span class="material-symbols-outlined">{{ iconLeft }}</span>
      </div>

      <input
        :id="`input-${id}`"
        v-model="model"
        v-bind="inputAtributes"
        @keyup.enter="$emit('pressEnter')"
      />

      <div
        v-if="iconRight || clearable"
        class="right-section"
        :class="{ disabled }"
        @click.stop="clearable && model ? (model = null) && $emit('clear') : ''"
        :style="{
          pointerEvents: clearable && model && !disabled ? 'auto' : 'none',
          cursor: 'pointer',
        }"
      >
        <span class="material-symbols-outlined">{{
          clearable && model ? "close" : iconRight
        }}</span>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, watch, ref } from "vue";

interface Props {
  label?: string;
  description?: string;
  tooltip?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rounded?: boolean;
  type?: string;
  iconLeft?: string;
  iconRight?: string;
  clearable?: boolean;
  size?: number;
  readonly?: boolean;
}

defineEmits(["pressEnter", "clear"]);
const model = defineModel<unknown>();
const props = defineProps<Props>();
const id = ref<number>();
const showTooltip = ref(false);

const padding = computed(() => {
  return {
    left: props.iconLeft ? "2rem" : "0.8rem",
    right: props.iconRight ? "2rem" : "0.8rem",
  };
});
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

const inputAtributes = computed(() => {
  return {
    type: props.type,
    placeholder: props.placeholder,
    disabled: props.disabled,
    required: props.required,
    readonly: props.readonly,
    class: { rounded: props.rounded },
  };
});

onMounted(() => {
  id.value = getCurrentInstance()?.uid;
});

function formatCurrency(value: string | number): string {
  const numeric =
    typeof value === "string" ? value.replace(/\D/g, "") : String(value);

  if (!numeric) return "";

  // Limita a 14 dígitos: 12 inteiros + 2 decimais
  const clean = numeric.slice(0, 14);

  // Divide parte inteira e decimal
  let intPart = clean.slice(0, Math.max(clean.length - 2, 0)) || "0";
  const decimalPart = clean.slice(-2).padStart(2, "0");

  // Remove zeros à esquerda
  intPart = intPart.replace(/^0+/, "") || "0";

  return `${intPart},${decimalPart}`;
}

watch(
  () => model.value,
  (val) => {
    if (props.type === "money") {
      if (typeof val === "string" || typeof val === "number") {
        model.value = formatCurrency(val);
      }
    }
  }
);
</script>

<style scoped>
.input-root {
  display: flex;
  flex-direction: column;
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

.input-wrapper {
  position: relative;
}

.left-section,
.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.4rem;
  bottom: 0.4rem;
  pointer-events: none;
}

.left-section {
  inset-inline-start: 0.4rem;
}

.right-section {
  inset-inline-end: 0.4rem;
}

input {
  width: 100%;
  padding-inline-start: v-bind("padding.left");
  padding-inline-end: v-bind("padding.right");
}

.material-symbols-outlined {
  font-size: 1.2rem;
}

.rounded {
  border-radius: 32px;
}
</style>
