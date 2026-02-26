<script setup>
import { locale, setLocale, SUPPORTED_LOCALES, t } from '../i18n/index.js'
</script>

<template>
  <div class="lang-switcher">
    <label>
      {{ t('lang.label') }}
      <select :value="locale" @change="setLocale($event.target.value)">
        <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
          {{ t('lang.' + code) }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.lang-switcher label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.lang-switcher select {
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}
</style>
