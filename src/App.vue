<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="shell">
    <header>
      <nav>
        <RouterLink to="/post/post-1">Post</RouterLink>
        <RouterLink to="/users">Users</RouterLink>
      </nav>
    </header>
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

header {
  border-bottom: 1px solid #e8e8e8;
  padding: 0.75rem 1.5rem;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding-bottom: 2px;
}

nav a.router-link-active {
  color: #4a90d9;
  border-bottom: 2px solid #4a90d9;
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
