<template>
  <header class="topbar">
    <div class="topbar-inner">
      <router-link to="/" class="topbar-brand" aria-label="Home">
        {{ siteTitle }}
      </router-link>
      <nav class="topbar-nav">
        <router-link to="/" class="topbar-link" active-class="active" exact-active-class="active">
          Steps
        </router-link>
        <router-link to="/about" class="topbar-link" active-class="active">
          About
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '@/lib/state'

const siteTitle = computed(() => state.viewerConfig?.siteTitle || 'Step Viewer')
</script>

<style scoped>
.topbar {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;
}

.topbar-brand {
  font-weight: 600;
  font-size: 1.1rem;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.topbar-brand:hover {
  opacity: 0.9;
}

.topbar-nav {
  display: flex;
  gap: 0.25rem;
}

.topbar-link {
  padding: 0.5rem 0.75rem;
  color: inherit;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9375rem;
}

.topbar-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.topbar-link.active {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
  .topbar-inner {
    padding: 0.5rem 1rem;
  }
  .topbar-brand {
    font-size: 1rem;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
