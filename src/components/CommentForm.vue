<script setup>
import { ref } from 'vue'
import { currentUser, getDisplayName, createComment, BIO_MAX_LENGTH } from '../data/store.js'
import { t } from '../i18n/index.js'

const props = defineProps({
  postId: { type: String, required: true },
})

const body = ref('')
const errorKeys = ref([])

function submit() {
  const result = createComment({
    postId: props.postId,
    body: body.value,
  })
  errorKeys.value = result.errors
  if (result.comment) {
    body.value = ''
  }
}
</script>

<template>
  <form class="comment-form" @submit.prevent="submit">
    <h3>{{ t('comment.addTitle') }}</h3>
    <p v-if="currentUser" class="posting-as">
      {{ t('comment.postingAs') }} <strong>{{ getDisplayName(currentUser.id) }}</strong>
    </p>
    <ul v-if="errorKeys.length" class="error-list">
      <li v-for="(key, i) in errorKeys" :key="i">{{ t(key) }}</li>
    </ul>
    <label>
      {{ t('comment.label') }}
      <textarea v-model="body" rows="3" :placeholder="t('comment.placeholder')" />
    </label>
    <button type="submit">{{ t('comment.submit') }}</button>
  </form>
</template>

<style scoped>
.comment-form {
  margin-top: 1.5rem;
}

.comment-form h3 {
  margin-bottom: 0.75rem;
}

.posting-as {
  font-size: 0.9rem;
  color: #555;
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

.comment-form label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #555;
}

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
