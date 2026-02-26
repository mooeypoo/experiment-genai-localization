<script setup>
import NavBar from './NavBar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { getUsers, currentUser, setCurrentUser, getDisplayName } from '../data/store.js'
import { t } from '../i18n/index.js'

const users = getUsers()

function onUserChange(event) {
  setCurrentUser(event.target.value)
}
</script>

<template>
  <header class="app-header">
    <span class="brand">{{ t('header.brand') }}</span>
    <NavBar />
    <div class="header-controls">
      <div class="viewing-as">
        <label>
          {{ t('header.viewingAs') }}
          <select :value="currentUser?.id" @change="onUserChange">
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ getDisplayName(user.id) }}
            </option>
          </select>
        </label>
      </div>
      <LanguageSwitcher />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e8e8e8;
}

.brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #222;
}

.header-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.viewing-as label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.viewing-as select {
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}
</style>
