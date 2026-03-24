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

        <!-- Pergunta atual -->
        <BaseCard v-if="viewState === 'question' && current" :key="current.questionId" :shadow="true" :border="true"
          class="main-card">
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

        <!-- Solução encontrada -->
        <BaseCard v-else-if="viewState === 'solution'" key="solution" :shadow="true" :border="true" class="main-card">
          <div class="solution-header">
            <span class="material-symbols-outlined solution-icon">check_circle</span>
            <h2>Solução Encontrada</h2>
          </div>
          <p class="solution-description">{{ solution?.description }}</p>

          <div class="history-section">
            <h3>Respostas fornecidas</h3>
            <div class="history-list">
              <div v-for="(item, i) in answerHistory" :key="i" class="history-item">
                <span class="history-question">{{ item.question }}</span>
                <span class="history-answer">
                  <span class="material-symbols-outlined">arrow_forward</span>
                  {{ item.answer }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button class="button primary" @click="goHome">
              <span class="material-symbols-outlined">home</span>
              Novo Diagnóstico
            </button>
          </div>
        </BaseCard>

        <!-- Erro -->
        <div v-else-if="viewState === 'error'" key="error" class="error-state">
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

interface QuestionState {
  questionId: number
  question: string
  answers: string[]
}

interface SolutionState {
  id: number
  description: string
}

interface HistoryItem {
  question: string
  answer: string
}

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const router = useRouter()
const viewState = ref<'question' | 'solution' | 'error'>('question')
const current = ref<QuestionState | null>(null)
const solution = ref<SolutionState | null>(null)
const answerHistory = ref<HistoryItem[]>([])
const collectedParams = ref<string[]>([])
const askedQuestionIds = ref<number[]>([])
const loading = ref(false)
const error = ref('')

onMounted(() => {
  const raw = history.state?.initialData
  if (!raw) {
    router.replace({ name: 'home' })
    return
  }
  try {
    const data = JSON.parse(raw)
    current.value = { questionId: data.questionId, question: data.question, answers: data.answers }
    askedQuestionIds.value = [data.questionId]
  } catch {
    router.replace({ name: 'home' })
  }
})

async function selectAnswer(index: number) {
  if (!current.value) return
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${API_BASE}/api/analyze/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: current.value.questionId,
        selectedAnswerIndex: index,
        collectedParams: collectedParams.value,
        askedQuestionIds: askedQuestionIds.value,
        history: answerHistory.value
      })
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body?.message ?? `Erro ${response.status}`)
    }

    const data = await response.json()

    if (data.type === 'solution') {
      solution.value = data.solution
      answerHistory.value = data.history
      viewState.value = 'solution'
    } else {
      // Atualiza estado com a nova pergunta
      if (data.newParam) {
        collectedParams.value = [...collectedParams.value, data.newParam]
      }
      askedQuestionIds.value = [...askedQuestionIds.value, data.questionId]
      current.value = { questionId: data.questionId, question: data.question, answers: data.answers }
    }
  } catch (err: any) {
    error.value = err.message ?? 'Erro ao conectar com o servidor.'
    viewState.value = 'error'
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

.main-card {
  width: min(640px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Pergunta */
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

/* Solução */
.solution-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.solution-icon {
  font-size: 2rem;
  color: var(--color-success, #4caf50);
  flex-shrink: 0;
}

.solution-description {
  font-size: 1.05rem;
  line-height: 1.6;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface-2);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
}

.history-section h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-subtext);
  margin-bottom: 0.75rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem 0.75rem;
  background-color: var(--color-surface-2);
  border-radius: 4px;
  border: 1px solid var(--color-overlay-1);
}

.history-question {
  font-size: 0.85rem;
  color: var(--color-subtext);
}

.history-answer {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
}

.history-answer .material-symbols-outlined {
  font-size: 1rem;
  color: var(--color-primary);
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

/* Erro */
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

/* Transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
