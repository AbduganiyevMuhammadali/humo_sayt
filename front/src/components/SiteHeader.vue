<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import LangSwitcher from './LangSwitcher.vue'
import { t } from '../i18n'

const router = useRouter()
const route = useRoute()

const links = [
  { id: 'hero', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'services', key: 'nav.services' },
  { id: 'departments', key: 'nav.departments' },
  { id: 'doctors', key: 'nav.doctors' },
  { id: 'pricing', key: 'nav.pricing' },
  { id: 'blog', key: 'nav.blog' },
]

const scrolled = ref(false)
const active = ref('hero')
const menuOpen = ref(false)

let sectionObserver
function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const ids = [...links.map((l) => l.id), 'contacts']
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) active.value = e.target.id
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el) sectionObserver.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  sectionObserver?.disconnect()
})

function go(id) {
  menuOpen.value = false
  // Boshqa sahifada bo'lsak — avval bosh sahifaga, keyin bo'limga.
  if (route.name !== 'home') {
    router.push({ path: '/', hash: '#' + id })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="header__bar container">
      <BrandLogo />

      <nav class="nav" :class="{ open: menuOpen }">
        <button
          v-for="l in links"
          :key="l.id"
          class="nav__link"
          :class="{ active: active === l.id }"
          @click="go(l.id)"
        >
          {{ t(l.key) }}
        </button>
      </nav>

      <div class="header__right">
        <LangSwitcher />
        <button class="nav-cta" @click="go('contacts')">{{ t('nav.contacts') }}</button>
      </div>

      <button
        class="burger"
        :class="{ open: menuOpen }"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  padding-top: 16px;
  transition: padding 0.4s var(--ease);
}

.header__bar {
  max-width: var(--maxw);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 22px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(36, 65, 108, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 8px 30px rgba(15, 31, 58, 0.08);
  transition: background 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.header.scrolled {
  padding-top: 10px;
}
.header.scrolled .header__bar {
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 40px rgba(15, 31, 58, 0.14);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  margin-right: 10px;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav__link {
  position: relative;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.86rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 9px 13px;
  border-radius: var(--radius-pill);
  transition: color 0.3s var(--ease), background 0.3s var(--ease);
}

.nav__link:hover {
  color: var(--navy-900);
  background: rgba(36, 65, 108, 0.06);
}

.nav__link.active {
  color: #fff;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
}

.nav-cta {
  color: #fff;
  font-weight: 700;
  font-size: 0.86rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 11px 20px;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  box-shadow: 0 10px 26px rgba(36, 65, 108, 0.28);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(36, 65, 108, 0.4);
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  margin-left: auto;
}
.burger span {
  width: 26px;
  height: 2.5px;
  background: var(--navy-800);
  border-radius: 2px;
  transition: transform 0.35s var(--ease), opacity 0.3s var(--ease);
}
.burger.open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}
.burger.open span:nth-child(2) {
  opacity: 0;
}
.burger.open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* На средних экранах слегка ужимаем, чтобы длинные узб/тадж слова влезали */
@media (max-width: 1140px) and (min-width: 1041px) {
  .nav__link {
    font-size: 0.8rem;
    padding: 8px 10px;
  }
  .nav-cta {
    padding: 10px 16px;
    font-size: 0.8rem;
  }
}

@media (max-width: 1040px) {
  .nav-cta {
    display: none;
  }
  .header__right {
    margin-left: auto;
  }
  .burger {
    display: flex;
    margin-left: 4px;
  }
  .nav {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 14px;
    margin: 0;
    border-radius: var(--radius);
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(36, 65, 108, 0.1);
    box-shadow: 0 20px 50px rgba(15, 31, 58, 0.18);
    backdrop-filter: blur(16px);
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
  }
  .nav.open {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .nav__link {
    text-align: left;
    padding: 14px 18px;
    font-size: 0.95rem;
    white-space: normal;
  }
}
</style>
