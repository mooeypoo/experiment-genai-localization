<script setup>
defineProps({
  user: { type: Object, required: true },
})
</script>

<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <strong>{{ user.name }}</strong>
    <span class="username">@{{ user.username }}</span>
  </div>
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
