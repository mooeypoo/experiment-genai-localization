<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPost, getComments, getUser } from '../data/store.js'
import { t, locale } from '../i18n/index.js'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'

const route = useRoute()
const postId = computed(() => route.params.id)
const post = computed(() => getPost(postId.value))
const author = computed(() => (post.value ? getUser(post.value.authorId) : null))
const comments = computed(() => getComments(postId.value))
</script>

<template>
  <section v-if="post" class="post-view">
    <article class="post">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <img
          v-if="author"
          :src="author.avatar"
          :alt="author.name"
          class="avatar"
        />
        <span v-if="author" class="author-name">{{ author.name }}</span>
        <time :datetime="post.createdAt">{{
          new Date(post.createdAt).toLocaleDateString(locale)
        }}</time>
      </div>
      <p class="post-body">{{ post.body }}</p>
    </article>

    <hr />

    <h2>{{ t('post.commentsCount', { count: comments.length }) }}</h2>
    <CommentList :comments="comments" />
    <CommentForm :post-id="postId" />
  </section>
  <p v-else class="not-found">{{ t('post.notFound') }}</p>
</template>

<style scoped>
.post-view {
  max-width: 680px;
  margin: 0 auto;
}

.post h1 {
  margin-bottom: 0.25rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eee;
}

.post-body {
  line-height: 1.6;
}

.not-found {
  text-align: center;
  color: #999;
}
</style>
