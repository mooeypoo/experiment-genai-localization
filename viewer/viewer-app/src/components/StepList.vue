<template>
  <div class="step-list">
    <ProgressSpinner v-if="loading" style="width: 40px; height: 40px" />
    <Message v-else-if="error" severity="error" :closable="false">
      {{ error }}
    </Message>
    <div v-else class="step-grid">
      <router-link
        v-for="step in steps"
        :key="step.id"
        :to="`/view/${step.id}`"
        class="step-card"
      >
        <span class="step-card-label">{{ step.label }}</span>
        <i class="pi pi-chevron-right step-card-arrow" aria-hidden="true"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { computed } from 'vue'
import { state } from '@/lib/state'

const steps = computed(() => state.steps)
const loading = computed(() => state.stepsLoading)
const error = computed(() => state.stepsError?.message || null)
</script>

<style scoped>
.step-list {
  padding: 1.5rem 1.25rem;
  max-width: 800px;
  margin: 0 auto;
}

.step-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid var(--viewer-border);
  border-radius: 8px;
  color: var(--viewer-text);
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}

.step-card:hover {
  background: var(--viewer-bg);
  border-color: var(--p-primary-color, #3b82f6);
}

.step-card-label {
  font-weight: 500;
}

.step-card-arrow {
  font-size: 0.875rem;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .step-list {
    padding: 1rem;
  }
}
</style>
