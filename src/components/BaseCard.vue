<template>
  <div class="card" :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rounded?: boolean
  shadow?: boolean
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rounded: false,
  shadow: false,
  border: false
})

const classes = computed(() => {
  return {
    rounded: props.rounded,
    shadow: props.shadow,
    border: props.border
  }
})
</script>

<style scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 0.8rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  gap: 1rem;

  .card {
    background-color: var(--color-surface-2);
  }
}

.rounded {
  border-radius: 1rem;
}

.shadow {
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
}

.border {
  border: 1px solid var(--color-overlay-1);
}
</style>
