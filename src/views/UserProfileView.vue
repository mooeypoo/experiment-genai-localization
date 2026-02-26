<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '../data/store.js'

const route = useRoute()
const user = computed(() => getUser(route.params.id))
</script>

<template>
  <section v-if="user" class="profile">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <h1>{{ user.name }}</h1>
    <span class="username">@{{ user.username }}</span>
    <p v-if="user.bio" class="bio">{{ user.bio }}</p>
    <p v-else class="bio empty">No bio yet.</p>
  </section>
  <p v-else class="not-found">User not found.</p>
</template>

<style scoped>
.profile {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #eee;
}

.profile h1 {
  margin-top: 0.25rem;
}

.username {
  color: #888;
  font-size: 0.95rem;
}

.bio {
  margin-top: 0.75rem;
  text-align: center;
  line-height: 1.6;
  color: #444;
}

.bio.empty {
  color: #aaa;
  font-style: italic;
}

.not-found {
  text-align: center;
  color: #999;
}
</style>
