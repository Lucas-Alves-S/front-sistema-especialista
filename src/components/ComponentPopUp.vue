<template>
    <div class="background" v-if="model == true">
        <div class="main">
            <h2>{{ props.label }}</h2>
            <label for="file-upload" class="inputFile" :class="{ withFile: selectedFile }"><span
                    class="material-symbols-outlined icon">
                    upload_file
                </span>
                <p v-if="selectedFile == null">
                    Clique para adicionar arquivo
                </p>
                <p v-if="selectedFile != null">{{ selectedFile.name }}</p>
            </label>
            <input id="file-upload" type="file" :accept="props.fileExtension?.join(',') || ''" @change="selectFile" />
            <div class="buttons">
                <button @click="closePopUp()">Cancelar</button>
                <button :disabled="!selectedFile" @click="handleFile">Enviar</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const selectedFile = ref<File | null>(null)
const props = defineProps<{
    label: string;
    fileExtension?: string[];
    method: Function;
}>();

const emit = defineEmits(['processing']);
const model = defineModel<unknown>()

function closePopUp() {
    selectedFile.value = null
    model.value = false
}

function selectFile(event: Event) {
    selectedFile.value = null
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    selectedFile.value = file;
}

async function handleFile() {
    emit('processing', true);
    await new Promise(resolve => setTimeout(resolve, 50));
    try {
        const file = selectedFile.value

        if (file == null) return
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (!arrayBuffer) return;

            let binary = '';
            const bytes = new Uint8Array(arrayBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64String = btoa(binary);

            await props.method(base64String);
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error(error);
    } finally {
        closePopUp()
    }
}

onMounted(() => {
    selectedFile.value = null
});
</script>
<style scoped>
.background {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.389);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main {
    height: 70%;
    width: 70%;
    padding: 2rem;
    background-color: var(--color-background);
    z-index: 11;
    border-radius: 1.5rem;
    outline: 1px solid var(--color-primary);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.inputFile {
    height: 75%;
    width: 95%;
    border-radius: 1rem;
    outline: 3px dashed var(--color-primary);
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
}

.withFile {
    background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

#file-upload {
    display: none;
}

.icon {
    font-size: 5rem;
}

.buttons {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 1rem;

}
</style>