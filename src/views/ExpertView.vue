<template>
  <div class="expert">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-ring" />
    </div>

    <div class="top-bar">
      <button class="button secondary" @click="goHome">
        <span class="material-symbols-outlined">home</span>
        Voltar ao Início
      </button>
    </div>

    <div class="content">
      <Transition name="fade" mode="out-in">
        <BaseCard v-if="current" :key="current.question" :shadow="true" :border="true" class="question-card">
          <div class="question-header">
            <span class="material-symbols-outlined question-icon">help_outline</span>
            <h2>{{ current.question }}</h2>
          </div>

          <div class="answers">
            <button v-for="(answer, index) in current.answers" :key="index" class="answer-btn" :disabled="loading"
              @click="selectAnswer(index)">
              <span class="material-symbols-outlined">chevron_right</span>
              {{ answer }}
            </button>
          </div>
        </BaseCard>

        <div v-else-if="error" class="error-state">
          <span class="material-symbols-outlined error-icon">error</span>
          <p>{{ error }}</p>
          <button class="button danger" @click="goHome">Voltar ao Início</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'

interface Meta {
  question_id: string
}

interface QuestionData {
  question: string
  answers: string[]
  meta: Meta
}

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const router = useRouter()
const current = ref<QuestionData | null>(null)
const loading = ref(false)
const error = ref('')

onMounted(() => {
  const state = history.state?.questionData
  if (!state) {
    router.replace({ name: 'home' })
    return
  }
  try {
    current.value = JSON.parse(state)
  } catch {
    router.replace({ name: 'home' })
  }
})

async function selectAnswer(index: number) {
  if (!current.value) return
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${API_BASE}/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta: current.value.meta, selected: index })
    })
    if (!response.ok) throw new Error(`Erro ${response.status}`)
    const data: QuestionData = await response.json()
    current.value = data
  } catch (err: any) {
    error.value = err.message ?? 'Erro ao conectar com o servidor.'
    current.value = null
  } finally {
    loading.value = false
  }
}

function goHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.expert {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem 1rem;
  gap: 1.5rem;
}

.top-bar {
  display: flex;
  align-items: center;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
}

.question-card {
  width: min(640px, 100%);
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.question-icon {
  font-size: 2rem;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.answer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-overlay-1);
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.answer-btn:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.answer-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 3rem 1rem;
}

.error-icon {
  font-size: 3rem;
  color: var(--color-danger);
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  width: 56px;
  height: 56px;
  border: 5px solid var(--color-surface);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Route transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
