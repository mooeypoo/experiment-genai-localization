<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  user: { type: Object, required: true },
})
</script>

<template>
  <RouterLink :to="{ name: 'user-profile', params: { id: user.id } }" class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <strong>{{ user.name }}</strong>
    <span class="username">@{{ user.username }}</span>
  </RouterLink>
</template>

<style scoped>
.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.user-card:hover {
  border-color: #4a90d9;
  box-shadow: 0 2px 8px rgba(74, 144, 217, 0.12);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #eee;
}

.username {
  color: #888;
  font-size: 0.85rem;
}
</style>
