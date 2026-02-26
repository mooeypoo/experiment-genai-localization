<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div id="shell">
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  color: #222;
  background: #fff;
  line-height: 1.5;
}

#shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 2rem 1.5rem;
}

hr {
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 1.5rem 0;
}
</style>
