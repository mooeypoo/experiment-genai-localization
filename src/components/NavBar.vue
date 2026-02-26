<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="nav-bar">
    <RouterLink to="/post/post-1">Post</RouterLink>
    <RouterLink to="/users">Users</RouterLink>
  </nav>
</template>

<style scoped>
.nav-bar {
  display: flex;
  gap: 1.5rem;
}

.nav-bar a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding-bottom: 2px;
}

.nav-bar a.router-link-active {
  color: #4a90d9;
  border-bottom: 2px solid #4a90d9;
}
</style>
