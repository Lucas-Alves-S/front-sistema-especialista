<template>
  <div class="add-question">
    <div class="page-header">
      <button class="button outlined small" @click="router.push({ name: 'home' })">
        <span class="material-symbols-outlined">arrow_back</span>
        Voltar
      </button>
      <h2>Adicionar Pergunta</h2>
    </div>

    <div class="form-area">
      <BaseCard :shadow="true" :border="true" class="form-card">

        <div class="field">
          <label>Pergunta <span class="required">*</span></label>
          <textarea v-model="question" placeholder="Digite o texto da pergunta..." :disabled="loading" rows="3" />
        </div>

        <div class="field">
          <label>Opções de resposta</label>
          <p class="field-description">Cada opção carrega um parâmetro que o back-end usa para avançar na árvore de
            decisão</p>
          <div class="answers-list">
            <div v-for="(answer, index) in answers" :key="index" class="answer-row">
              <span class="answer-index">{{ index + 1 }}</span>
              <div class="answer-inputs">
                <input v-model="answer.answer" :placeholder="`Texto da resposta ${index + 1}`" type="text"
                  :disabled="loading" />
                <input v-model="answer.param" placeholder="parâmetro" type="text" :disabled="loading"
                  class="param-input" />
              </div>
              <button :style="{ visibility: index === 0 ? 'hidden' : 'visible' }" class="button danger small round"
                @click="removeAnswer(index)" :disabled="answers.length <= 1 || loading" title="Remover opção">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          <button class="button outlined small" @click="addAnswer" :disabled="loading">
            <span class="material-symbols-outlined">add</span>
            Adicionar opção
          </button>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <div class="card-footer">
          <div class="checkbox-row" @click="createAnother = !createAnother">
            <div class="checkbox-wrapper" :class="{ checked: createAnother }">
              <span class="material-symbols-outlined checkmark" v-if="createAnother">check_small</span>
            </div>
            <span class="checkbox-label">Criar outra pergunta</span>
          </div>
          <button class="button primary" :disabled="!isFormValid || loading" @click="save">
            <span v-if="loading" class="material-symbols-outlined spin">refresh</span>
            <span v-else class="material-symbols-outlined">save</span>
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>

      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const router = useRouter()

const question = ref('')
const answers = ref([{ answer: '', param: '' }])
const createAnother = ref(false)
const loading = ref(false)
const error = ref('')

const isFormValid = computed(() =>
  question.value.trim() !== '' &&
  answers.value.every(a => a.answer.trim() !== '' && a.param.trim() !== '') &&
  answers.value.length >= 2
)

function addAnswer() {
  answers.value.push({ answer: '', param: '' })
}

function removeAnswer(index: number) {
  if (answers.value.length > 1) {
    answers.value.splice(index, 1)
  }
}

function resetForm() {
  question.value = ''
  answers.value = [{ answer: '', param: '' }]
  error.value = ''
}

async function save() {
  if (!isFormValid.value) return
  loading.value = true
  error.value = ''

  const body = {
    question: question.value.trim(),
    answers: answers.value.map(a => ({
      answer: a.answer.trim(),
      param: a.param.trim()
    }))
  }

  try {
    const response = await fetch(`${API_BASE}/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!response.ok) throw new Error(`Erro ${response.status}`)

    if (createAnother.value) {
      resetForm()
    } else {
      router.push({ name: 'home' })
    }
  } catch (err: any) {
    error.value = err.message ?? 'Erro ao conectar com o servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-question {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem 1rem;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
}

.page-header h2 {
  margin: 0;
}

.form-area {
  display: flex;
  justify-content: center;
}

.form-card {
  width: min(680px, 100%);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-weight: 500;
  color: var(--color-text);
}

.field-description {
  color: var(--color-subtext);
  font-size: var(--font-size-small);
  margin: 0;
}

.required {
  color: var(--color-danger);
}

.field textarea,
.field input[type='text'] {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.8rem;
  background-color: var(--color-base);
  color: var(--color-text);
  border: 1px solid var(--color-overlay-1);
  border-radius: 4px;
  font-family: var(--font-family);
  font-size: var(--font-size);
  outline: none;
  transition: border-color 0.15s ease;
}

.field textarea {
  resize: vertical;
  min-height: 80px;
}

.field textarea:focus,
.field input[type='text']:focus {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: -1px;
}

.field textarea::placeholder,
.field input[type='text']::placeholder {
  color: var(--color-subtext);
}

.field textarea:disabled,
.field input[type='text']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.answer-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.answer-index {
  font-size: var(--font-size-small);
  color: var(--color-subtext);
  min-width: 1rem;
  text-align: center;
}

.answer-inputs {
  display: flex;
  flex: 1;
  gap: 0.5rem;
  min-width: 0;
}

.answer-inputs input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.7rem;
  background-color: var(--color-base);
  color: var(--color-text);
  border: 1px solid var(--color-overlay-1);
  border-radius: 4px;
  font-family: var(--font-family);
  font-size: var(--font-size);
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.answer-inputs input:focus {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: -1px;
}

.answer-inputs input::placeholder {
  color: var(--color-subtext);
}

.answer-inputs input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.button.round {
  padding: 0.3rem;
  aspect-ratio: 1;
  justify-content: center;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper {
  width: 1rem;
  height: 1rem;
  min-width: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border-1);
  border-radius: 4px;
  background-color: transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.checkbox-wrapper.checked {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}

.checkmark {
  font-size: 1.2rem;
  color: var(--color-white);
}

.checkbox-label {
  font-size: var(--font-size);
  color: var(--color-text);
}

.error-msg {
  color: var(--color-danger);
  font-size: var(--font-size-small);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>
