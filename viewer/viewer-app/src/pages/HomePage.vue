<template>
  <div class="home-page">
    <h1 class="page-title">Steps</h1>
    <StepList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import StepList from '@/components/StepList.vue'
import { fetchSteps, fetchViewerConfig } from '@/lib/api'
import { setSteps, setStepsError, setViewerConfig, setViewerConfigError } from '@/lib/state'

onMounted(async () => {
  try {
    const data = await fetchSteps()
    setSteps(Array.isArray(data) ? data : (data.steps || []))
  } catch (e) {
    setStepsError(e)
  }
  try {
    const config = await fetchViewerConfig()
    setViewerConfig(config)
  } catch {
    setViewerConfig({})
  }
})
</script>

<style scoped>
.home-page {
  flex: 1;
  padding-bottom: 1rem;
}

.page-title {
  margin: 0;
  padding: 1.5rem 1.25rem 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
}

@media (max-width: 600px) {
  .page-title {
    padding: 1rem 1rem 0.5rem;
    font-size: 1.25rem;
  }
}
</style>
