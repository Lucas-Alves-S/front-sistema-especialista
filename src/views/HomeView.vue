<template>
  <div class="home">
    <div class="hero">
      <span class="material-symbols-outlined hero-icon">psychology</span>
      <h1>Sistema Especialista</h1>
      <p class="subtitle">Descreva o problema ou sintoma que está enfrentando e nosso sistema irá guiá-lo até a solução.</p>
    </div>

    <div class="input-area">
      <BaseCard :shadow="true" :border="true" class="symptom-card">
        <h3>Qual é o sintoma ou problema?</h3>
        <div class="textarea-wrapper">
          <textarea
            v-model="symptom"
            placeholder="Descreva o sintoma inicial em detalhes..."
            :disabled="loading"
            rows="4"
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <div class="card-footer">
          <button
            class="button primary"
            :disabled="!symptom.trim() || loading"
            @click="submit"
          >
            <span v-if="loading" class="material-symbols-outlined spin">refresh</span>
            <span v-else class="material-symbols-outlined">send</span>
            {{ loading ? 'Analisando...' : 'Iniciar Diagnóstico' }}
          </button>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const router = useRouter()
const symptom = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!symptom.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${API_BASE}/api/symptom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptom: symptom.value.trim() })
    })
    if (!response.ok) throw new Error(`Erro ${response.status}`)
    const data = await response.json()
    router.push({ name: 'expert', state: { questionData: JSON.stringify(data) } })
  } catch (err: any) {
    error.value = err.message ?? 'Erro ao conectar com o servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem 1rem;
  gap: 2rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 3rem 1rem 1rem;
}

.hero-icon {
  font-size: 4rem;
  color: var(--color-primary);
}

.subtitle {
  color: var(--color-subtext);
  max-width: 480px;
  line-height: 1.6;
}

.input-area {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-bottom: 2rem;
}

.symptom-card {
  width: min(600px, 100%);
}

.textarea-wrapper textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;
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

.textarea-wrapper textarea:focus {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: -1px;
}

.textarea-wrapper textarea::placeholder {
  color: var(--color-subtext);
}

.textarea-wrapper textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.error-msg {
  color: var(--color-danger);
  font-size: var(--font-size-small);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>
