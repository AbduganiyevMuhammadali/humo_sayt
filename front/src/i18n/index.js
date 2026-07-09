import { reactive, computed } from 'vue'
import { messages } from './messages'

export const LOCALES = [
  { code: 'ru', label: 'Рус', full: 'Русский' },
  { code: 'uz', label: 'Uzb', full: "O'zbekcha" },
  { code: 'tg', label: 'Тоҷ', full: 'Тоҷикӣ' },
]

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null
const state = reactive({
  locale: LOCALES.some((l) => l.code === saved) ? saved : 'uz',
})

// Достаёт значение по ключу вида "hero.title" из словаря текущего языка,
// с откатом на русский, если перевод отсутствует.
function resolve(dict, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict)
}

export function t(key) {
  const val = resolve(messages[state.locale], key)
  if (val !== undefined) return val
  return resolve(messages.ru, key) ?? key
}

export function setLocale(code) {
  if (!LOCALES.some((l) => l.code === code)) return
  state.locale = code
  if (typeof localStorage !== 'undefined') localStorage.setItem('locale', code)
  if (typeof document !== 'undefined') document.documentElement.lang = code
}

export const currentLocale = computed(() => state.locale)

// Плагин: даёт глобальный $t в шаблонах.
export const i18n = {
  install(app) {
    app.config.globalProperties.$t = t
    if (typeof document !== 'undefined') document.documentElement.lang = state.locale
  },
}

// Хелпер для <script setup>: useI18n().t(...)
export function useI18n() {
  return { t, locale: currentLocale, setLocale, LOCALES }
}
