<template>
    <div class="input-root" :style="width">
        <label v-if="label" :for="`input-${id}`">{{ label
            }}<span v-if="required && label" style="color: var(--color-danger)">*</span>
            <p v-if="description" class="description">{{ description }}</p>
            <div v-if="tooltip" class="tooltip-trigger" @mouseover="showTooltip = true"
                @mouseleave="showTooltip = false">
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

            <input :id="`input-${id}`" v-model="modelValue" v-bind="inputAtributes"
                @keyup.enter="$emit('pressEnter')" />

            <div class="right-section select-button" :class="{ disabled }" @click.stop="toggleSelect">
                <span class="material-symbols-outlined select-icon">{{
                    selectedTypeIcon
                    }}</span>

                <transition>
                    <div class="options-wrapper" v-show="isOpen" ref="optionsWrapper">
                        <template v-if="!typeOptions || typeOptions.length === 0">
                            <p style="text-align: center; padding: 0.2rem">
                                Nenhuma Opção Encontrada
                            </p>
                        </template>
                        <template v-else>
                            <div v-for="(option, index) in typeOptions" :key="index" class="option"
                                :class="{ selected: option.value === modelType }" @click.stop="selectType(option)">
                                <span class="material-symbols-outlined option-icon">{{
                                    option.icon
                                    }}</span>
                                {{ option.text }}
                            </div>
                        </template>
                    </div>
                </transition>
            </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    getCurrentInstance,
    onMounted,
    onBeforeUnmount,
    ref,
} from "vue";

interface TypeOption {
    value: unknown;
    text: string;
    icon: string;
}

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
    size?: number;
    readonly?: boolean;
    typeOptions: TypeOption[];
}

defineEmits(["pressEnter"]);

const modelValue = defineModel<unknown>();
const modelType = defineModel<unknown>("type");

const props = defineProps<Props>();
const id = ref<number>();
const showTooltip = ref(false);
const isOpen = ref(false);
const optionsWrapper = ref<HTMLElement | null>(null);

const selectedTypeIcon = computed(() => {
    if (modelType.value == null) {
        return "unfold_more";
    }
    const selected = props.typeOptions.find(
        (option) => option.value === modelType.value
    );
    return selected ? selected.icon : "error";
});

function toggleSelect() {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;
}

function selectType(option: TypeOption) {
    modelType.value = option.value;
    isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (
        optionsWrapper.value &&
        !optionsWrapper.value.parentElement?.parentElement?.contains(clickedElement)
    ) {
        isOpen.value = false;
    }
}

onMounted(() => {
    id.value = getCurrentInstance()?.uid;
    document.addEventListener("click", handleClickOutside);
    if (modelType.value === undefined && props.typeOptions.length > 0) {
        modelType.value = props.typeOptions[0].value;
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});


const padding = computed(() => {
    return {
        left: props.iconLeft ? "2rem" : "0.8rem",
        right: "3rem",
    };
});

const width = computed(() => {
    const size = props.size ?? 20;
    let padding = 1.6;

    if (props.iconLeft) {
        padding += 1.4;
    }

    padding += 1.4;

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
    z-index: 2;
}

.left-section {
    inset-inline-start: 0.4rem;
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

.right-section {
    inset-inline-end: 0.4rem;
    pointer-events: none;
}

.select-button {
    pointer-events: auto !important;
    cursor: pointer;
    width: 2.2rem;
    border-left: 1px solid var(--color-overlay);
    padding: 0 0.4rem;
}

.select-icon {
    transition: transform 0.2s ease;
}

.options-wrapper {
    position: absolute;
    top: 1.8rem;
    width: v-bind("width.width");
    inset-inline-end: -0.4rem;
    margin-top: 0.3rem;
    border-radius: 4px;
    background-color: var(--color-surface);
    z-index: 3;
    padding: 0.3rem;
    border: 1px solid var(--color-overlay);
    box-sizing: border-box;
}

.option {
    position: relative;
    cursor: pointer;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    &:hover {
        background-color: #00000028;
    }
}

.selected {
    background-color: #00000010;
    font-weight: bold;
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