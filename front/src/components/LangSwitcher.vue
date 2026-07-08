<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../i18n'

const { locale, setLocale, LOCALES } = useI18n()
const open = ref(false)
const root = ref(null)

function pick(code) {
  setLocale(code)
  open.value = false
}
function onDocClick(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

const currentLabel = () => LOCALES.find((l) => l.code === locale.value)?.label || 'Рус'
</script>

<template>
  <div class="lang" ref="root">
    <button class="lang__btn" @click="open = !open" :class="{ open }" aria-label="Язык">
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
        <path
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.3 0 2.9 2.2 3.5 6H8.5C9.1 8.2 10.7 6 12 6Zm-6.9 6H8c.1 1.4.3 2.8.7 4H6.3A8 8 0 0 1 5.1 12Zm0-2A8 8 0 0 1 6.3 6h2.4c-.4 1.2-.6 2.6-.7 4H5.1Zm2.5 8h2.4c.3 1 .7 1.9 1.2 2.7A8 8 0 0 1 7.6 16Zm4.4 2.7c-.6-.7-1-1.6-1.3-2.7h2.6c-.3 1.1-.7 2-1.3 2.7Zm-1.6-4.7c-.4-1.2-.6-2.6-.7-4h5.6c-.1 1.4-.3 2.8-.7 4H10.4Zm3.6 4.7c.5-.8.9-1.7 1.2-2.7h2.4a8 8 0 0 1-3.6 2.7ZM16 14c.4-1.2.6-2.6.7-4h2.9a8 8 0 0 1-1.2 4H16Zm.7-6c-.1-1.4-.3-2.8-.7-4a8 8 0 0 1 3.6 4h-2.9Z"
          fill="currentColor"
        />
      </svg>
      <span>{{ currentLabel() }}</span>
      <svg class="lang__chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" fill="currentColor" />
      </svg>
    </button>

    <Transition name="drop">
      <ul v-if="open" class="lang__menu">
        <li v-for="l in LOCALES" :key="l.code">
          <button
            class="lang__item"
            :class="{ active: locale.value === l.code }"
            @click="pick(l.code)"
          >
            {{ l.full }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}
.lang__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--navy-800);
  font-weight: 700;
  font-size: 0.86rem;
  white-space: nowrap;
  padding: 9px 12px;
  border-radius: var(--radius-pill);
  background: rgba(36, 65, 108, 0.06);
  border: 1px solid rgba(36, 65, 108, 0.14);
  transition: background 0.3s var(--ease);
}
.lang__btn > span {
  min-width: 30px;
  text-align: left;
}
.lang__btn:hover {
  background: rgba(36, 65, 108, 0.12);
}
.lang__chev {
  transition: transform 0.3s var(--ease);
}
.lang__btn.open .lang__chev {
  transform: rotate(180deg);
}

.lang__menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 150px;
  padding: 8px;
  border-radius: var(--radius);
  background: rgba(15, 31, 58, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
  z-index: 20;
}
.lang__item {
  width: 100%;
  text-align: left;
  padding: 11px 14px;
  border-radius: 10px;
  color: var(--text-on-dark-muted);
  font-weight: 600;
  font-size: 0.92rem;
  transition: background 0.25s var(--ease), color 0.25s var(--ease);
}
.lang__item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
.lang__item.active {
  color: #fff;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
