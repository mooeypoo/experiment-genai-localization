<template>
  <div class="view-step-page">
    <template v-if="!normalizedId">
      <Message severity="error" :closable="false">Invalid step.</Message>
      <router-link to="/">Back to steps</router-link>
    </template>
    <template v-else>
      <div class="view-step-layout">
        <div class="view-step-main">
          <div class="view-step-header">
            <Select
              :model-value="normalizedId"
              :options="stepOptions"
              option-label="label"
              option-value="id"
              placeholder="Select step"
              class="step-select"
              @update:model-value="goToStep"
            />
            <Button label="Back to list" icon="pi pi-list" text @click="router.push('/')" />
          </div>
          <StepFrame :step-id="normalizedId" :step-exists="stepExists" />
        </div>
        <aside class="view-step-docs">
          <DocsPanel
            :step-id="normalizedId"
            notes-fallback="No notes available for this step."
            prompt-fallback="No prompt available for this step."
          />
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Message from 'primevue/message'
import StepFrame from '@/components/StepFrame.vue'
import DocsPanel from '@/components/DocsPanel.vue'
import { normalizeStepId } from '@/lib/stepId'
import { state } from '@/lib/state'
import { fetchSteps } from '@/lib/api'
import { setSteps, setStepsError } from '@/lib/state'

const route = useRoute()
const router = useRouter()

const stepExists = ref(true)

const normalizedId = computed(() => {
  const param = route.params.step
  return normalizeStepId(param)
})

const stepOptions = computed(() =>
  state.steps.map((s) => ({ id: s.id, label: s.label || s.title || s.id }))
)

function goToStep(opt) {
  if (opt?.id) router.replace({ name: 'view-step', params: { step: opt.id } })
}

async function checkStepExists() {
  if (!normalizedId.value) return
  try {
    const res = await fetch(`./${normalizedId.value}/`, { method: 'head' })
    stepExists.value = res.ok
  } catch {
    stepExists.value = false
  }
}

watch(normalizedId, checkStepExists, { immediate: true })

onMounted(async () => {
  if (state.steps.length === 0) {
    try {
      const data = await fetchSteps()
      setSteps(Array.isArray(data) ? data : (data.steps || []))
    } catch (e) {
      setStepsError(e)
    }
  }
})
</script>

<style scoped>
.view-step-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.5rem;
  overflow: hidden;
}

.view-step-layout {
  flex: 1;
  display: flex;
  gap: 1rem;
  min-height: 0;
  overflow: hidden;
}

.view-step-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.view-step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  flex-shrink: 0;
}

.step-select {
  min-width: 200px;
}

.view-step-docs {
  width: 320px;
  min-width: 0;
  flex-shrink: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f1f5f9;
}

@media (max-width: 900px) {
  .view-step-layout {
    flex-direction: column;
  }

  .view-step-docs {
    width: 100%;
    max-height: 50vh;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid var(--viewer-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}
</style>
