import { ref, computed, watchEffect } from 'vue'
import en from './locales/en.js'
import fr from './locales/fr.js'
import es from './locales/es.js'
import he from './locales/he.js'
import ar from './locales/ar.js'
import fa from './locales/fa.js'
import zh from './locales/zh.js'

const messages = { en, fr, es, he, ar, fa, zh }

export const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'he', 'ar', 'fa', 'zh']

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

export function formatNumber(value) {
  if (value == null) return ''
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return String(value)
  return new Intl.NumberFormat(locale.value).format(numeric)
}

export function formatDateTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function setLocale(code) {
  if (SUPPORTED_LOCALES.includes(code)) {
    locale.value = code
  }
}
