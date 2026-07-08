<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findService, listServices } from '../data/servicesContent'
import { currentLocale, t } from '../i18n'

const route = useRoute()
const router = useRouter()

// Joriy til o'zgарганда — kontent ham yangilanadi.
const service = computed(() => findService(route.params.slug, currentLocale.value))

// boshqa xizmatlar (shu sahifadan tashqari)
const others = computed(() =>
  listServices(currentLocale.value).filter((s) => s.slug !== route.params.slug).slice(0, 6),
)

watchEffect(() => {
  if (service.value) {
    document.title = `${service.value.title} — Humo Medline`
  }
})

function goContacts() {
  router.push({ path: '/', hash: '#contacts' })
}
function openService(slug) {
  router.push(`/services/${slug}`)
}
</script>

<template>
  <main class="sv" v-if="service">
    <!-- HERO -->
    <header class="sv__hero">
      <div class="sv__hero-bg" aria-hidden="true"></div>
      <div class="container sv__hero-inner">
        <RouterLink to="/" class="sv__back">{{ t('sv.back') }}</RouterLink>
        <div class="sv__hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="34" height="34">
            <path :d="service.icon" fill="none" stroke="currentColor" stroke-width="1.7"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h1 class="sv__title">{{ service.title }}</h1>
        <p class="sv__subtitle">{{ service.subtitle }}</p>
      </div>
    </header>

    <!-- KONTENT -->
    <div class="container sv__body">
      <article class="sv__content">
        <template v-for="(b, i) in service.blocks" :key="i">
          <p v-if="b.type === 'p'" class="sv__p">{{ b.text }}</p>
          <h2 v-else-if="b.type === 'h'" class="sv__h">{{ b.text }}</h2>
          <ul v-else-if="b.type === 'list'" class="sv__list">
            <li v-for="(it, j) in b.items" :key="j">{{ it }}</li>
          </ul>
          <button v-else-if="b.type === 'cta'" class="btn btn-primary sv__cta" @click="goContacts">
            {{ b.text }}
          </button>
          <div v-else-if="b.type === 'gallery'" class="sv__gallery">
            <figure
              v-for="(img, j) in b.images"
              :key="j"
              class="sv__gallery-item"
            >
              <img :src="img.src" :alt="img.alt || service.title" loading="lazy" />
              <figcaption v-if="img.alt">{{ img.alt }}</figcaption>
            </figure>
          </div>
        </template>
      </article>

      <!-- yon panel: boshqa xizmatlar -->
      <aside class="sv__aside">
        <div class="sv__aside-card">
          <h3>{{ t('sv.others') }}</h3>
          <ul>
            <li v-for="o in others" :key="o.slug">
              <button @click="openService(o.slug)">
                <span class="sv__aside-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path :d="o.icon" fill="none" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                {{ o.title }}
              </button>
            </li>
          </ul>
        </div>

        <div class="sv__aside-cta">
          <strong>{{ t('sv.askTitle') }}</strong>
          <p>{{ t('sv.askText') }}</p>
          <button class="btn btn-primary" @click="goContacts">{{ t('sv.askBtn') }}</button>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.sv {
  background: var(--bg);
  min-height: 100vh;
}

/* HERO */
.sv__hero {
  position: relative;
  padding: calc(var(--header-h) + 50px) 0 60px;
  color: #fff;
  overflow: hidden;
}
.sv__hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(70% 90% at 85% 0%, rgba(94, 234, 212, 0.3), transparent 60%),
    linear-gradient(150deg, #0f1f3a, #1d3457 60%, #2f5d97);
}
.sv__hero-inner {
  position: relative;
  z-index: 1;
}
.sv__back {
  display: inline-block;
  color: var(--text-on-dark-muted);
  font-weight: 600;
  margin-bottom: 26px;
  transition: color 0.3s var(--ease);
}
.sv__back:hover {
  color: #fff;
}
.sv__hero-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 22px;
}
.sv__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.sv__subtitle {
  margin-top: 14px;
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  color: var(--accent-2);
  font-weight: 600;
}

/* BODY */
.sv__body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
  padding-block: 56px 90px;
  align-items: start;
}
.sv__content {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: clamp(28px, 4vw, 50px);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(36, 65, 108, 0.06);
}
.sv__p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 18px;
}
.sv__h {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--navy-900);
  margin: 34px 0 16px;
  padding-left: 16px;
  border-left: 4px solid var(--blue-400);
}
.sv__list {
  display: grid;
  gap: 12px;
  margin-bottom: 22px;
}
.sv__list li {
  position: relative;
  padding-left: 32px;
  color: var(--navy-800);
  font-size: 1.02rem;
  line-height: 1.6;
}
.sv__list li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.6em;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-2), var(--blue-400));
}
.sv__cta {
  margin-top: 14px;
}

/* GALLERY */
.sv__gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin: 22px 0 28px;
}
.sv__gallery-item {
  position: relative;
  margin: 0;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(36, 65, 108, 0.06);
  background: #eef4fb;
}
.sv__gallery-item img {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s var(--ease);
}
.sv__gallery-item:hover img {
  transform: scale(1.06);
}
.sv__gallery-item figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 12px 10px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(180deg, transparent, rgba(15, 31, 58, 0.78));
}

/* ASIDE */
.sv__aside {
  position: sticky;
  top: calc(var(--header-h) + 16px);
  display: grid;
  gap: 18px;
}
.sv__aside-card,
.sv__aside-cta {
  background: #fff;
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(36, 65, 108, 0.06);
}
.sv__aside-card h3 {
  font-size: 1.1rem;
  color: var(--navy-900);
  margin-bottom: 14px;
}
.sv__aside-card ul {
  display: grid;
  gap: 4px;
}
.sv__aside-card button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  padding: 11px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--navy-800);
  transition: background 0.25s var(--ease), color 0.25s var(--ease);
}
.sv__aside-card button:hover {
  background: rgba(63, 123, 196, 0.08);
  color: var(--blue-500);
}
.sv__aside-ico {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex: none;
  color: var(--blue-500);
  background: rgba(63, 123, 196, 0.1);
}
.sv__aside-cta {
  background: linear-gradient(160deg, var(--navy-800), var(--blue-500));
  color: #fff;
  text-align: center;
}
.sv__aside-cta strong {
  font-size: 1.1rem;
}
.sv__aside-cta p {
  margin: 8px 0 16px;
  color: var(--text-on-dark-muted);
  font-size: 0.92rem;
}
.sv__aside-cta .btn {
  width: 100%;
  background: #fff;
  color: var(--navy-800);
}

@media (max-width: 920px) {
  .sv__body {
    grid-template-columns: 1fr;
  }
  .sv__aside {
    position: static;
  }
}
</style>
