<script setup>
import { ref } from 'vue'
import { createUser } from '../data/store.js'

const name = ref('')
const preferredName = ref('')
const bio = ref('')
const errors = ref([])

function submit() {
  const result = createUser({
    name: name.value,
    preferredName: preferredName.value,
    bio: bio.value,
  })
  errors.value = result.errors
  if (result.user) {
    name.value = ''
    preferredName.value = ''
    bio.value = ''
  }
}
</script>

<template>
  <form class="create-user-form" @submit.prevent="submit">
    <h3>Add a user</h3>
    <ul v-if="errors.length" class="error-list">
      <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
    </ul>
    <label>
      Display name
      <input v-model="name" type="text" placeholder="Full name" />
    </label>
    <label>
      Preferred name
      <input v-model="preferredName" type="text" placeholder="How should we refer to you? (optional)" />
    </label>
    <label>
      Bio
      <textarea v-model="bio" rows="2" placeholder="A short bio (optional)" />
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

.error-list {
  list-style: none;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
  background: #fff0f0;
  border: 1px solid #e8c0c0;
  border-radius: 4px;
  color: #b33;
  font-size: 0.9rem;
}

.create-user-form label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #555;
}

.create-user-form input,
.create-user-form textarea {
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
