<script setup>
import { ref, computed } from 'vue'
import { createUser, BIO_MAX_LENGTH } from '../data/store.js'
import { t } from '../i18n/index.js'

const name = ref('')
const preferredName = ref('')
const bio = ref('')
const errorKeys = ref([])

const bioLength = computed(() => bio.value.length)
const bioOver = computed(() => bioLength.value > BIO_MAX_LENGTH)

function submit() {
  const result = createUser({
    name: name.value,
    preferredName: preferredName.value,
    bio: bio.value,
  })
  errorKeys.value = result.errors
  if (result.user) {
    name.value = ''
    preferredName.value = ''
    bio.value = ''
  }
}
</script>

<template>
  <form class="create-user-form" @submit.prevent="submit">
    <h3>{{ t('user.addTitle') }}</h3>
    <ul v-if="errorKeys.length" class="error-list">
      <li v-for="(key, i) in errorKeys" :key="i">{{ t(key, { max: BIO_MAX_LENGTH }) }}</li>
    </ul>
    <label>
      {{ t('user.displayName') }}
      <input v-model="name" type="text" :placeholder="t('user.displayNamePlaceholder')" />
    </label>
    <label>
      {{ t('user.preferredName') }}
      <input v-model="preferredName" type="text" :placeholder="t('user.preferredNamePlaceholder')" />
    </label>
    <label>
      {{ t('user.bio') }}
      <textarea v-model="bio" rows="2" :placeholder="t('user.bioPlaceholder')" :class="{ over: bioOver }" />
      <span class="char-counter" :class="{ over: bioOver }">
        {{ bioLength }} / {{ BIO_MAX_LENGTH }}
      </span>
    </label>
    <button type="submit">{{ t('user.createButton') }}</button>
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

.create-user-form textarea.over {
  border-color: #c44;
}

.char-counter {
  display: block;
  text-align: right;
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.2rem;
}

.char-counter.over {
  color: #c44;
  font-weight: 600;
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
