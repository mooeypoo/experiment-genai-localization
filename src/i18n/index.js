import { ref, computed, watchEffect } from 'vue'
import en from './locales/en.js'
import fr from './locales/fr.js'
import es from './locales/es.js'
import he from './locales/he.js'
import ar from './locales/ar.js'
import fa from './locales/fa.js'

const messages = { en, fr, es, he, ar, fa }

export const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'he', 'ar', 'fa']

const RTL_LOCALES = new Set(['he', 'ar', 'fa'])

export const locale = ref('en')

export const dir = computed(() => (RTL_LOCALES.has(locale.value) ? 'rtl' : 'ltr'))

export const localeMessages = computed(() => messages[locale.value] || messages.en)

watchEffect(() => {
  document.documentElement.lang = locale.value
  document.documentElement.dir = dir.value
})

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
