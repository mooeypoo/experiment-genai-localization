<template>
  <footer class="footer">
    <div class="footer-inner">
      <a href="https://moriel.tech" target="_blank" rel="noopener" class="footer-link">
        Made by Moriel Schottlender
      </a>
      <template v-if="config?.repoUrl">
        <span class="footer-sep" aria-hidden="true"> · </span>
        <a :href="config.repoUrl" target="_blank" rel="noopener" class="footer-link">
          see on github
        </a>
      </template>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '@/lib/state'

const config = computed(() => state.viewerConfig)
</script>

<style scoped>
.footer {
  margin-top: auto;
  padding: 0.75rem 1.25rem;
  background: var(--viewer-border);
  color: var(--viewer-muted);
  font-size: 0.875rem;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.footer-link {
  color: var(--viewer-text);
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-sep {
  color: var(--viewer-muted);
  user-select: none;
}
</style>
