<script setup>
import { getUsers } from '../data/store.js'
import UserCard from '../components/UserCard.vue'
import CreateUserForm from '../components/CreateUserForm.vue'

const users = getUsers()
</script>

<template>
  <section class="users-view">
    <h1>Users</h1>
    <div class="user-grid">
      <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>

    <hr />
    <CreateUserForm />
  </section>
</template>

<style scoped>
.users-view {
  max-width: 680px;
  margin: 0 auto;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
</style>
