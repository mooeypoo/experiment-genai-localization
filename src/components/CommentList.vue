<script setup>
import { getUser } from '../data/store.js'
import { t, formatDateTime } from '../i18n/index.js'

defineProps({
  comments: { type: Array, required: true },
})
</script>

<template>
  <ul class="comment-list">
    <li v-for="comment in comments" :key="comment.id" class="comment">
      <div class="comment-header">
        <img
          :src="getUser(comment.authorId)?.avatar"
          :alt="getUser(comment.authorId)?.name"
          class="avatar"
        />
        <strong>{{ getUser(comment.authorId)?.name ?? t('comment.unknownAuthor') }}</strong>
        <time :datetime="comment.createdAt">{{ formatDateTime(comment.createdAt) }}</time>
      </div>
      <p>{{ comment.body }}</p>
    </li>
  </ul>
</template>

<style scoped>
.comment-list {
  list-style: none;
  padding: 0;
}

.comment {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.comment-header time {
  color: #999;
  margin-inline-start: auto;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #eee;
}
</style>
