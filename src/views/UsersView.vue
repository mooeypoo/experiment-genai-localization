<script setup>
import { computed } from 'vue'
import { getUsers } from '../data/store.js'
import { t, locale } from '../i18n/index.js'
import UserCard from '../components/UserCard.vue'
import CreateUserForm from '../components/CreateUserForm.vue'

const users = getUsers()

const sortedUsers = computed(() => {
  const collator = new Intl.Collator(locale.value, { sensitivity: 'base' })
  return [...users].sort((a, b) => collator.compare(a.name, b.name))
})
</script>

<template>
  <section class="users-view">
    <h1>{{ t('users.title') }}</h1>
    <div class="user-grid">
      <UserCard v-for="user in sortedUsers" :key="user.id" :user="user" />
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
