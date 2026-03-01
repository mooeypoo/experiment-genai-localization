<template>
  <div class="about-page">
    <div v-if="loading" class="about-loading">
      <ProgressSpinner style="width: 40px; height: 40px" />
    </div>
    <div v-else-if="config" class="about-content viewer-prose">
      <h1>{{ config.siteTitle || 'About' }}</h1>
      <p v-if="config.assistantName"><strong>Assistant:</strong> {{ config.assistantName }}</p>
      <p v-if="config.repoUrl">
        <a :href="config.repoUrl" target="_blank" rel="noopener">Repository</a>
      </p>
      <p v-if="config.otherExperimentUrl">
        <a :href="config.otherExperimentUrl" target="_blank" rel="noopener">Other experiment</a>
      </p>
      <p v-if="config.description">{{ config.description }}</p>
    </div>
    <div v-else class="about-content">
      <h1>About</h1>
      <p>Viewer configuration not available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { fetchViewerConfig } from '@/lib/api'
import { setViewerConfig } from '@/lib/state'

const loading = ref(true)
const config = ref(null)

onMounted(async () => {
  try {
    config.value = await fetchViewerConfig()
    setViewerConfig(config.value)
  } catch {
    config.value = {}
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.about-page {
  flex: 1;
  padding: 1.5rem 1.25rem 2rem;
  max-width: 720px;
  margin: 0 auto;
}

.about-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.about-content h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.about-content a {
  color: var(--p-primary-color);
  text-decoration: none;
}

.about-content a:hover {
  text-decoration: underline;
}
</style>
