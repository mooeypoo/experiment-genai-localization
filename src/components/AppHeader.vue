<script setup>
import NavBar from './NavBar.vue'
</script>

<template>
  <header class="app-header">
    <span class="brand">Social Demo</span>
    <NavBar />
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e8e8e8;
}

.brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #222;
}
</style>
