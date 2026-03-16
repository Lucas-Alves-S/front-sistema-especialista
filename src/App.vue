<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family);
}
</style>
