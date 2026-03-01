<template>
  <Panel header="Documentation" class="docs-panel" :toggleable="true" :collapsed="collapsed">
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
  </Panel>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Panel from 'primevue/panel'
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
const collapsed = ref(false)

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
}

.docs-panel :deep(.p-panel),
.docs-panel :deep([data-pc-section='root']) {
  background: #f1f5f9;
  border-color: var(--viewer-border);
  color: #1e293b;
}

.docs-panel :deep(.p-panel-header),
.docs-panel :deep([data-pc-section='header']) {
  background: #f1f5f9;
  color: #1e293b;
  border-color: var(--viewer-border);
}

.docs-panel :deep(.p-panel-content),
.docs-panel :deep([data-pc-section='content']) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0;
  background: #f1f5f9;
  color: #1e293b;
  border: none !important;
  border-top: none !important;
  box-shadow: none !important;
}

.docs-panel :deep(.p-tabview) {
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f1f5f9;
  color: #1e293b;
}

.docs-panel :deep(.p-tabview-nav),
.docs-panel :deep([data-pc-section='nav']) {
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
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  padding: 0;
  background: #f1f5f9;
  color: #1e293b;
  -webkit-overflow-scrolling: touch;
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
