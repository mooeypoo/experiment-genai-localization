<template>
  <div class="docs-panel">
    <div class="docs-panel-header">Documentation</div>
    <div class="docs-panel-scroll">
      <TabView>
        <TabPanel header="Notes">
          <div class="viewer-prose" v-html="notesHtml"></div>
          <p v-if="notesLoading" class="viewer-missing">Loading…</p>
          <p v-else-if="notesError && !notesHtml" class="viewer-missing">{{ notesFallback }}</p>
        </TabPanel>
        <TabPanel header="Prompt">
          <div class="viewer-prose" v-html="promptHtml"></div>
          <p v-if="promptLoading" class="viewer-missing">Loading…</p>
          <p v-else-if="promptError && !promptHtml" class="viewer-missing">{{ promptFallback }}</p>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { fetchStepNotes, fetchStepPrompt } from '@/lib/api'

const props = defineProps({
  stepId: { type: String, required: true },
  notesFallback: { type: String, default: 'No notes available for this step.' },
  promptFallback: { type: String, default: 'No prompt available for this step.' },
})

const notesHtml = ref('')
const promptHtml = ref('')
const notesLoading = ref(false)
const promptLoading = ref(false)
const notesError = ref(null)
const promptError = ref(null)

async function loadNotes() {
  notesLoading.value = true
  notesError.value = null
  notesHtml.value = ''
  try {
    notesHtml.value = await fetchStepNotes(props.stepId)
  } catch (e) {
    notesError.value = e
  } finally {
    notesLoading.value = false
  }
}

async function loadPrompt() {
  promptLoading.value = true
  promptError.value = null
  promptHtml.value = ''
  try {
    promptHtml.value = await fetchStepPrompt(props.stepId)
  } catch (e) {
    promptError.value = e
  } finally {
    promptLoading.value = false
  }
}

function load() {
  loadNotes()
  loadPrompt()
}

watch(() => props.stepId, load)
onMounted(load)
</script>

<style scoped>
.docs-panel {
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid var(--viewer-border);
}

.docs-panel-header {
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  background: #f1f5f9;
  color: #1e293b;
  border-bottom: 1px solid var(--viewer-border);
}

.docs-panel-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #f1f5f9;
  color: #1e293b;
}

.docs-panel :deep(.p-tabview) {
  min-width: 0;
  background: #f1f5f9;
  color: #1e293b;
}

.docs-panel :deep(.p-tabview-nav),
.docs-panel :deep([data-pc-section='nav']) {
  flex-shrink: 0;
  background: #f1f5f9;
  color: #1e293b;
  border-bottom: 1px solid var(--viewer-border);
  border-left: none;
  border-right: none;
  border-top: none;
}

.docs-panel :deep(.p-tabview-nav .p-tabview-nav-link),
.docs-panel :deep([data-pc-section='tab'] a) {
  color: #1e293b !important;
}

.docs-panel :deep(.p-tabview-panels) {
  min-width: 0;
  padding: 0;
  background: #f1f5f9;
  color: #1e293b;
}

.docs-panel :deep(.p-tabview-panel) {
  padding: 0;
  min-width: 0;
  background: #f1f5f9;
  color: #1e293b;
}

.docs-panel :deep(.viewer-prose) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
  background: #f1f5f9;
  color: #1e293b !important;
}

.docs-panel :deep(.viewer-prose *),
.docs-panel :deep(.viewer-missing) {
  color: inherit;
}

.docs-panel :deep(.viewer-prose h1),
.docs-panel :deep(.viewer-prose h2),
.docs-panel :deep(.viewer-prose h3),
.docs-panel :deep(.viewer-prose p),
.docs-panel :deep(.viewer-prose li),
.docs-panel :deep(.viewer-prose a) {
  color: #1e293b !important;
}

.docs-panel :deep(.viewer-prose a:hover) {
  color: #0f172a !important;
}
</style>
