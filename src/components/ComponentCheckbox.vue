<template>
  <div class="input-root">
    <label v-if="label" :for="`input-${id}`">{{ label }}<span v-if="required && label"
        style="color: var(--color-danger)">*</span>
    </label>
    <div class="chekbox-container">
      <div class="checkbox-wrapper" :class="{ checked: modelValue, disabled: disabled }" @click="toggleCheckbox">
        <span class="material-symbols-outlined checkmark" v-if="modelValue">check_small</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, computed, ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String || null,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: '',
  },
})
const id = ref<number>()

const emit = defineEmits(['update:modelValue'])

function toggleCheckbox() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
}

onMounted(() => {
  id.value = getCurrentInstance()?.uid
})
</script>

<style scoped>
.input-root {
  display: flex;
  flex-direction: column;
  min-height: 3rem;
}

.chekbox-container {
  display: flex;
  align-items: center;
  min-height: 2.1rem;
  justify-content: center;
}

.checkbox-wrapper {
  width: 1rem;
  height: 1rem;
  min-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border-1);
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.checkbox-wrapper.checked {
  background-color: var(--color-accent);
}

.checkbox-wrapper.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkmark {
  font-size: 1.2rem;
  color: var(--color-white);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.checkbox-wrapper:focus-within {
  outline: none;
}
</style>
