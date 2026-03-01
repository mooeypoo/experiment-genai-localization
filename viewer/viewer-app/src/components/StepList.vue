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
  border: 2px solid #64748b;
  border-radius: 8px;
  color: #1e293b;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.step-card:hover {
  background: #f1f5f9;
  border-color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.step-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-color: #2563eb;
}

.step-card-label {
  font-weight: 600;
  color: #0f172a;
}

.step-card-arrow {
  font-size: 0.875rem;
  color: #475569;
}

@media (max-width: 600px) {
  .step-list {
    padding: 1rem;
  }
}
</style>
