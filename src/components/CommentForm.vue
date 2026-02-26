<script setup>
import { ref } from 'vue'
import { getUsers, createComment } from '../data/store.js'

const props = defineProps({
  postId: { type: String, required: true },
})

const users = getUsers()
const authorId = ref(users[0]?.id ?? '')
const body = ref('')

function submit() {
  if (!body.value.trim() || !authorId.value) return
  createComment({
    postId: props.postId,
    authorId: authorId.value,
    body: body.value.trim(),
  })
  body.value = ''
}
</script>

<template>
  <form class="comment-form" @submit.prevent="submit">
    <h3>Add a comment</h3>
    <label>
      Author
      <select v-model="authorId">
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </label>
    <label>
      Comment
      <textarea v-model="body" rows="3" placeholder="Write something..." />
    </label>
    <button type="submit">Post comment</button>
  </form>
</template>

<style scoped>
.comment-form {
  margin-top: 1.5rem;
}

.comment-form h3 {
  margin-bottom: 0.75rem;
}

.comment-form label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #555;
}

.comment-form select,
.comment-form textarea {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.comment-form button {
  padding: 0.5rem 1.25rem;
  background: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}

.comment-form button:hover {
  background: #357abd;
}
</style>
