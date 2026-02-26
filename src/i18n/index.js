import { ref, computed } from 'vue'
import en from './locales/en.js'
import fr from './locales/fr.js'
import es from './locales/es.js'

const messages = { en, fr, es }

export const SUPPORTED_LOCALES = ['en', 'fr', 'es']

export const locale = ref('en')

export const localeMessages = computed(() => messages[locale.value] || messages.en)

function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function t(key, params) {
  let str = resolve(localeMessages.value, key) ?? resolve(messages.en, key) ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }
  }
  return str
}

export function setLocale(code) {
  if (SUPPORTED_LOCALES.includes(code)) {
    locale.value = code
  }
}
