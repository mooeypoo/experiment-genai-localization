<script setup>
import { ref } from 'vue'
import { createUser } from '../data/store.js'

const name = ref('')
const username = ref('')

function submit() {
  if (!name.value.trim() || !username.value.trim()) return
  createUser({
    name: name.value.trim(),
    username: username.value.trim(),
  })
  name.value = ''
  username.value = ''
}
</script>

<template>
  <form class="create-user-form" @submit.prevent="submit">
    <h3>Add a user</h3>
    <label>
      Name
      <input v-model="name" type="text" placeholder="Full name" />
    </label>
    <label>
      Username
      <input v-model="username" type="text" placeholder="username" />
    </label>
    <button type="submit">Create user</button>
  </form>
</template>

<style scoped>
.create-user-form {
  margin-top: 1.5rem;
}

.create-user-form h3 {
  margin-bottom: 0.75rem;
}

.create-user-form label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #555;
}

.create-user-form input {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.create-user-form button {
  padding: 0.5rem 1.25rem;
  background: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}

.create-user-form button:hover {
  background: #357abd;
}
</style>
