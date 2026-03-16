<template>
    <div class="main">
        <div class="tab-header">
            <div class="label" v-for="(tab, i) in tabs" :key="i" :class="{ active: active === i }" @click="active = i">
                <p>{{ tab.name }}</p>
                <span v-if="tab.icon != null" class="material-symbols-outlined">
                    {{ tab.icon }}
                </span>
            </div>
        </div>

        <div class="tab-content">
            <component :is="tabs[active].component" v-bind="tabs[active].props" :key="active" v-if="tabs[active]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

defineProps<{
    tabs: { name: string; icon?: string; component: any, props?: Record<string, any> }[]
}>()

const active = ref(0)
</script>

<style scoped>
.main {
    margin: 1rem;
    padding: 1rem;
}

.tab-header {
    display: flex;
}

.label {
    border-radius: .6rem;
    border: none;
    cursor: pointer;
    min-width: 5rem;
    width: fit-content;
    padding: .5rem .8rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    text-align: center;
    margin: .5rem 0 .5rem 0;

    span {
        margin-left: .3rem;
        text-align: center;
        font-size: 1.2rem;
    }
}

.label.active {
    background-color: color-mix(in srgb, var(--color-primary), transparent 80%);
}

.tab-content {
    outline: 1px solid var(--color-overlay);
    padding: 1rem;
    border-radius: 1rem;
}
</style>
