<template>
  <button class="toggle" :class="{ active: model }" @click="model = !model">
    <span class="slider" :class="{ active: model, theme: props.themeToggler }"
      @click.stop="props.themeToggler ? toggleTheme() : ''"></span>
  </button>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

interface Props {
  themeToggler?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  themeToggler: false
})

function toggleTheme() {
  var element = document.getElementsByTagName("html")[0]
  if (element.classList.contains("theme-dark")) {
    element.classList.replace("theme-dark", "theme-light")
  } else {
    element.classList.replace("theme-light", "theme-dark")
  }
}

</script>

<style scoped>
.toggle {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 3rem;
  height: 1.8rem;
  background-color: transparent;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 34px;

  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.24);
  background-color: var(--color-text);

  transition: 0.5s ease;
}

.slider::before {
  position: absolute;
  content: '';
  border-radius: 100%;

  width: 1.4rem;
  height: 1.4rem;

  left: 0.2rem;
  top: 0.2rem;

  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.24);

  transition: 0.5s ease;
}

.slider.theme::before {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Material Symbols Outlined";
  font-variation-settings: 'FILL' 2;
  content: "dark_mode";
  font-size: 1.4rem;
  color: var(--color-background);
  box-shadow: none;
}

.slider.active {
  background-color: var(--color-accent);
}

.slider.slider.active::before {
  left: calc(100% - 1.4rem - 0.2rem);
  font-variation-settings: 'FILL' 2;
  color: var(--color-background);
  content: "light_mode";
  box-shadow: none;
}
</style>