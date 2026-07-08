<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { t } from '../../i18n'
import { defaultDoctors } from '../../lib/doctorsService'

// Если public/images/hero.jpg существует — используем его, иначе градиент.
const heroImg = ref(false)
const parallax = ref(0)

// === Bosh shifokorlar (hero o'ng tomonida) ===
// Rasmi mavjud shifokorlar. Matn slideri bilan BIRGA almashadi.
const heroDocs = ref([]) // [{ name, specialty, experience, patients, src }]

const hasHeroDocs = computed(() => heroDocs.value.length > 0)
// Umumiy qadam hisoblagich — har bir almashinishda oshadi.
// Matn 3 ta, shifokor 7 ta bo'lsa ham, ikkalasi mustaqil aylanaveradi.
const step = ref(0)
const docIndex = computed(() =>
  heroDocs.value.length ? step.value % heroDocs.value.length : 0,
)
const currentDoc = computed(() => heroDocs.value[docIndex.value] || null)

// === Слайдер hero (matn + shifokor birga almashadi) ===
const slides = computed(() => t('hero.slides'))
const active = computed(() => (slides.value.length ? step.value % slides.value.length : 0))
const dir = ref(1) // направление анимации
let timer = null
const DURATION = 5000

function go(targetActive) {
  // Matn slide indeksiga (targetActive) ko'ra step ni shunday sozlaymizki,
  // active === targetActive bo'lsin (yo'nalishni saqlagan holda).
  const len = slides.value.length
  const cur = active.value
  dir.value =
    targetActive > cur || (cur === len - 1 && targetActive === 0) ? 1 : -1
  const delta = (targetActive - cur + len) % len || len
  step.value += dir.value > 0 ? delta : -((len - delta) % len || len)
  restart()
}
function next() {
  dir.value = 1
  step.value++
  restart()
}
function prev() {
  dir.value = -1
  step.value--
  restart()
}
function restart() {
  if (timer) clearInterval(timer)
  timer = setInterval(next, DURATION)
}

function check(src) {
  return new Promise((res) => {
    const img = new Image()
    img.onload = () => res(true)
    img.onerror = () => res(false)
    img.src = src
  })
}

function onScroll() {
  parallax.value = Math.min(window.scrollY * 0.35, 240)
}

onMounted(async () => {
  heroImg.value = await check('/images/hero.jpg')

  // Rasmi bor shifokorlarni yig'amiz (doctor-1.jpg ... doctor-N.jpg).
  const found = []
  for (let i = 0; i < defaultDoctors.length; i++) {
    const src = `/images/doctor-${i + 1}.jpg`
    if (await check(src)) {
      found.push({ ...defaultDoctors[i], src })
    }
  }
  heroDocs.value = found

  window.addEventListener('scroll', onScroll, { passive: true })
  restart()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (timer) clearInterval(timer)
})

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="hero" class="hero" :class="{ 'hero--light': !heroImg }">
    <div class="hero__bg" aria-hidden="true">
      <div
        class="hero__photo"
        :class="{ 'has-img': heroImg }"
        :style="heroImg ? { backgroundImage: `url(/images/hero.jpg)`, transform: `scale(1.08) translateY(${parallax * 0.4}px)` } : {}"
      ></div>
      <div class="hero__overlay"></div>
      <div class="hero__grid"></div>
      <span class="orb orb--1"></span>
      <span class="orb orb--2"></span>
      <span class="orb orb--3"></span>
      <span class="particle" v-for="n in 14" :key="n" :style="`--i:${n}`"></span>
    </div>

    <div class="container hero__inner" :style="{ transform: `translateY(${parallax * 0.15}px)` }">
      <Transition :name="dir > 0 ? 'slide-next' : 'slide-prev'" mode="out-in">
        <div class="hero__slide" :key="active">
          <p class="hero__eyebrow">
            <span class="dot"></span> {{ slides[active].badge }}
          </p>

          <h1 class="hero__title serif">
            {{ slides[active].title1 }}<br />
            <span class="hero__accent">{{ slides[active].title2 }}</span>
          </h1>

          <p class="hero__lead">
            {{ slides[active].lead }}
          </p>
        </div>
      </Transition>

      <div class="hero__actions">
        <button class="btn btn-primary" @click="scrollTo('contacts')">
          {{ t('hero.cta1') }}
        </button>
        <button class="btn btn-ghost" @click="scrollTo('doctors')">
          {{ t('hero.cta2') }}
        </button>
      </div>

      <!-- управление слайдером -->
      <div class="hero__slider-ctrl">
        <button class="hero__arrow" aria-label="prev" @click="prev">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="hero__dots">
          <button
            v-for="(s, i) in slides"
            :key="i"
            class="hero__dot"
            :class="{ active: active === i }"
            :aria-label="`slide ${i + 1}`"
            @click="go(i)"
          ><span class="hero__dot-fill"></span></button>
        </div>
        <button class="hero__arrow" aria-label="next" @click="next">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <div class="hero__stats">
        <div class="stat">
          <strong>15+</strong><span>{{ t('hero.stat1') }}</span>
        </div>
        <div class="stat">
          <strong>5000+</strong><span>{{ t('hero.stat2') }}</span>
        </div>
        <div class="stat">
          <strong>20+</strong><span>{{ t('hero.stat3') }}</span>
        </div>
      </div>
    </div>

    <!-- Bosh shifokorlar slideri (hero o'ng tomonida) -->
    <div v-if="hasHeroDocs" class="hero__doc" :style="{ transform: `translateY(${parallax * 0.06}px)` }">
      <div class="hero__doc-card">
        <Transition name="docfade" mode="out-in">
          <div class="hero__doc-stage" :key="docIndex">
            <div
              class="hero__doc-photo"
              :style="{ backgroundImage: `url(${currentDoc.src})` }"
            ></div>
            <div class="hero__doc-info">
              <span class="hero__doc-online"><i></i> {{ t('hero.online') }}</span>
              <strong>{{ currentDoc.name }}</strong>
              <small>{{ currentDoc.specialty }}</small>
              <div class="hero__doc-meta">
                <span>{{ currentDoc.experience }}</span>
                <span>{{ currentDoc.patients }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <a class="hero__scroll" @click.prevent="scrollTo('about')" href="#about" aria-label="↓">
      <span></span>
    </a>

    <a class="hero__url" href="https://www.humomedline.uz" target="_blank" rel="noopener">
      WWW.HUMOMEDLINE.UZ
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #fff;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__photo {
  position: absolute;
  inset: -5%;
  /* Светлый воздушный медицинский фон (fallback, пока нет hero.jpg) */
  background:
    radial-gradient(60% 55% at 78% 18%, rgba(94, 234, 212, 0.55), transparent 60%),
    radial-gradient(70% 65% at 12% 88%, rgba(63, 123, 196, 0.45), transparent 62%),
    linear-gradient(150deg, #eef6ff 0%, #d8ecff 38%, #c2e6f2 70%, #d6f3ec 100%);
  background-size: cover;
  background-position: center;
  animation: heroPan 22s ease-in-out infinite alternate;
}
.hero__photo.has-img {
  /* фон-фото подставляется инлайн через :style; здесь только база */
  background-color: #1d3457;
  background-size: cover;
  background-position: center;
  animation: heroZoom 26s ease-in-out infinite alternate;
}

@keyframes heroPan {
  from {
    transform: scale(1.06) translateY(0);
  }
  to {
    transform: scale(1.14) translateY(-2%);
  }
}
@keyframes heroZoom {
  from {
    filter: saturate(1.05) brightness(1);
  }
  to {
    filter: saturate(1.15) brightness(1.04);
  }
}

.hero__overlay {
  position: absolute;
  inset: 0;
  /* двойной градиент: слева тёмная зона под текст + общая дымка снизу */
  background:
    linear-gradient(
      105deg,
      rgba(9, 19, 38, 0.9) 0%,
      rgba(13, 26, 49, 0.62) 42%,
      rgba(13, 26, 49, 0.25) 75%,
      rgba(13, 26, 49, 0.15) 100%
    ),
    linear-gradient(to top, rgba(9, 19, 38, 0.55), transparent 40%);
}
/* при светлом фоне затемнение почти убираем, лишь лёгкая дымка для читаемости */
.hero--light .hero__overlay {
  background: linear-gradient(
    105deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.2) 45%,
    rgba(255, 255, 255, 0) 100%
  );
}

/* subtle tech grid */
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask: radial-gradient(120% 90% at 30% 50%, #000 0%, transparent 70%);
  animation: gridDrift 30s linear infinite;
}
@keyframes gridDrift {
  to {
    background-position: 60px 60px;
  }
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(55px);
  opacity: 0.6;
  animation: float 14s ease-in-out infinite;
}
.orb--1 {
  width: 380px;
  height: 380px;
  top: -90px;
  right: 8%;
  background: radial-gradient(circle, rgba(94, 234, 212, 0.6), transparent 70%);
}
.orb--2 {
  width: 440px;
  height: 440px;
  bottom: -130px;
  right: 22%;
  background: radial-gradient(circle, rgba(63, 123, 196, 0.65), transparent 70%);
  animation-delay: -4s;
}
.orb--3 {
  width: 280px;
  height: 280px;
  top: 28%;
  left: -70px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.5), transparent 70%);
  animation-delay: -8s;
}
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(24px, -32px);
  }
}

/* floating particles */
.particle {
  position: absolute;
  left: calc((var(--i) * 6.7%) + 2%);
  bottom: -20px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(170, 220, 255, 0.7);
  box-shadow: 0 0 10px rgba(94, 234, 212, 0.6);
  opacity: 0;
  animation: rise calc(9s + (var(--i) * 0.6s)) linear infinite;
  animation-delay: calc(var(--i) * -0.8s);
}
@keyframes rise {
  0% {
    transform: translateY(0) scale(0.6);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  85% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-92vh) scale(1.1);
    opacity: 0;
  }
}

.hero__inner {
  position: relative;
  z-index: 2;
  max-width: 770px;
  padding-block: calc(var(--header-h) + 30px) 60px;
  transition: transform 0.1s linear;
}

/* ===== Bosh shifokor (hero o'ng tomonida) ===== */
/* ===== Bosh shifokorlar slideri — zamonaviy karta ===== */
.hero__doc {
  position: absolute;
  z-index: 2;
  right: max(24px, calc((100% - var(--maxw)) / 2 + 24px));
  top: 50%;
  transform: translateY(-50%);
  width: clamp(280px, 26vw, 340px);
  opacity: 0;
  animation: docIn 1s var(--ease) 0.5s forwards;
}
@keyframes docIn {
  from { opacity: 0; transform: translateY(-44%); }
  to { opacity: 1; transform: translateY(-50%); }
}

/* oq karta — har qanday fon (qora/oq) yashiriladi */
.hero__doc-card {
  position: relative;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 34px 80px rgba(15, 31, 58, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  padding-bottom: 26px;
}
.hero__doc-card::before {
  /* yuqori dekorativ gradient lenta + nozik naqsh */
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 100px;
  background:
    radial-gradient(120% 140% at 80% 0%, rgba(94, 234, 212, 0.35), transparent 60%),
    linear-gradient(135deg, var(--blue-400), var(--navy-700));
  z-index: 0;
}
.hero__doc-card::after {
  /* nuqtali naqsh lentada */
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 100px;
  background-image: radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 14px 14px;
  z-index: 0;
  opacity: 0.6;
}

.hero__doc-stage {
  position: relative;
  z-index: 1;
}

/* rasm — doira ichida to'liq (cover), yuz markazда */
.hero__doc-photo {
  width: 190px;
  height: 190px;
  margin: 24px auto 0;
  border-radius: 50%;
  /* cover — har qандай оқ/қора фон доира четида қолади */
  background-size: cover;
  background-position: center 22%;
  background-repeat: no-repeat;
  background-color: #fff;
  border: 5px solid #fff;
  box-shadow: 0 14px 34px rgba(15, 31, 58, 0.28);
}

.hero__doc-info {
  text-align: center;
  padding: 14px 22px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.hero__doc-info strong {
  font-size: 1.05rem;
  color: var(--navy-900);
  line-height: 1.25;
}
.hero__doc-info small {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--blue-500);
}
.hero__doc-online {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #14a37f;
  margin-bottom: 4px;
}
.hero__doc-online i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #19c37d;
  box-shadow: 0 0 0 0 rgba(25, 195, 125, 0.5);
  animation: dotPulse 2s ease-in-out infinite;
}
.hero__doc-meta {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.hero__doc-meta span {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--navy-700);
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(63, 123, 196, 0.1);
}

/* cross-fade almashinuv */
.docfade-enter-active,
.docfade-leave-active {
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}
.docfade-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.docfade-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* nuqta indikatorlar */
.hero__doc-dots {
  position: absolute;
  z-index: 3;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7px;
}
.hero__doc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(36, 65, 108, 0.2);
  cursor: pointer;
  transition: all 0.3s var(--ease);
}
.hero__doc-dot.active {
  width: 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--blue-400));
}

@keyframes dotPulse {
  50% { box-shadow: 0 0 0 6px rgba(25, 195, 125, 0); }
}

/* katta ekranlarda matn ozgina toraytiriladi, shifokor uchun joy */
@media (min-width: 1080px) {
  .hero__inner {
    max-width: 620px;
  }
}
/* o'rta/kichik ekranlarda shifokorni yashiramiz (matn to'liq ko'rinsin) */
@media (max-width: 1080px) {
  .hero__doc {
    display: none;
  }
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-2);
  padding: 9px 18px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
}
.hero__eyebrow .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-2);
  box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.25);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    box-shadow: 0 0 0 8px rgba(94, 234, 212, 0);
  }
}

.hero__title {
  margin-top: 22px;
  font-size: clamp(2.3rem, 6vw, 4.3rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.35);
}
.hero__accent {
  background: linear-gradient(110deg, #fff 10%, var(--accent-2) 55%, var(--accent) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% auto;
  animation: shine 6s linear infinite;
}
@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.hero__lead {
  margin-top: 22px;
  max-width: 56ch;
  font-size: clamp(1rem, 1.7vw, 1.22rem);
  color: var(--text-on-dark);
  opacity: 0.92;
}

/* ===== Светлая тема Hero (когда нет фото) — тёмный читаемый текст ===== */
.hero--light {
  color: var(--navy-900);
}
.hero--light .hero__eyebrow {
  color: var(--blue-500);
  background: rgba(63, 123, 196, 0.12);
  border-color: rgba(63, 123, 196, 0.2);
}
.hero--light .hero__title {
  color: var(--navy-900);
  text-shadow: none;
}
.hero--light .hero__accent {
  background: linear-gradient(110deg, var(--blue-500) 10%, #1d9c8a 55%, var(--blue-400) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% auto;
}
.hero--light .hero__lead {
  color: var(--text-muted);
  opacity: 1;
}
.hero--light .stat strong {
  background: linear-gradient(120deg, var(--navy-800), var(--blue-500));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero--light .stat span {
  color: var(--text-muted);
}
.hero--light .btn-ghost {
  background: rgba(255, 255, 255, 0.7);
  color: var(--navy-800);
  border-color: rgba(36, 65, 108, 0.18);
}
.hero--light .btn-ghost:hover {
  background: #fff;
}
.hero--light .hero__scroll {
  border-color: rgba(36, 65, 108, 0.4);
}
.hero--light .hero__scroll span {
  background: var(--navy-700);
}
.hero--light .hero__url {
  color: var(--navy-800);
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(36, 65, 108, 0.16);
}
.hero--light .particle {
  background: rgba(63, 123, 196, 0.55);
  box-shadow: 0 0 10px rgba(94, 234, 212, 0.7);
}
.hero--light .hero__grid {
  background-image:
    linear-gradient(rgba(36, 65, 108, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(36, 65, 108, 0.06) 1px, transparent 1px);
}

/* slide content keeps a min-height so layout doesn't jump between slides */
.hero__slide {
  min-height: 260px;
}

/* slide transitions */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
}
.slide-next-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.hero__actions {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

/* slider controls */
.hero__slider-ctrl {
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.hero__arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(6px);
  transition: transform 0.3s var(--ease-spring), background 0.3s var(--ease);
}
.hero__arrow:hover {
  transform: scale(1.08);
  background: rgba(255, 255, 255, 0.22);
}
.hero__dots {
  display: flex;
  gap: 9px;
}
.hero__dot {
  position: relative;
  width: 30px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  overflow: hidden;
  transition: width 0.4s var(--ease);
}
.hero__dot.active {
  width: 56px;
  background: rgba(255, 255, 255, 0.25);
}
.hero__dot-fill {
  position: absolute;
  inset: 0;
  width: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
}
.hero__dot.active .hero__dot-fill {
  animation: dotFill 5.5s linear forwards;
}
@keyframes dotFill {
  from { width: 0; }
  to { width: 100%; }
}

/* светлая тема: тёмные контролы */
.hero--light .hero__arrow {
  color: var(--navy-800);
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(36, 65, 108, 0.16);
}
.hero--light .hero__arrow:hover {
  background: #fff;
}
.hero--light .hero__dot {
  background: rgba(36, 65, 108, 0.18);
}
.hero--light .hero__dot.active {
  background: rgba(36, 65, 108, 0.14);
}

.hero__stats {
  margin-top: 50px;
  display: flex;
  gap: 14px 44px;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
}
.stat strong {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 800;
  background: linear-gradient(120deg, #fff, var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat span {
  font-size: 0.86rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-on-dark-muted);
}

.hero__scroll {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  width: 26px;
  height: 44px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  display: grid;
  place-items: start center;
  padding-top: 7px;
}
.hero__scroll span {
  width: 4px;
  height: 9px;
  border-radius: 4px;
  background: #fff;
  animation: scrolldot 1.8s ease-in-out infinite;
}
@keyframes scrolldot {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  60% {
    transform: translateY(12px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.hero__url {
  position: absolute;
  right: 24px;
  bottom: 30px;
  z-index: 3;
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.16em;
  color: #fff;
  padding: 12px 22px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  transition: background 0.3s var(--ease);
}
.hero__url:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* entrance fade-up for the persistent parts */
.hero__actions,
.hero__slider-ctrl,
.hero__stats {
  opacity: 0;
  transform: translateY(24px);
  animation: revealUp 0.8s var(--ease) forwards;
}
.hero__actions { animation-delay: 0.25s; }
.hero__slider-ctrl { animation-delay: 0.38s; }
.hero__stats { animation-delay: 0.5s; }
@keyframes revealUp {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 760px) {
  .hero__slide {
    min-height: 300px;
  }
}
@media (max-width: 600px) {
  .hero__url {
    display: none;
  }
  .hero__stats {
    gap: 18px 30px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero__actions,
  .hero__slider-ctrl,
  .hero__stats {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .hero__dot.active .hero__dot-fill {
    animation: none;
    width: 100%;
  }
  .particle,
  .hero__grid,
  .hero__accent {
    animation: none;
  }
}
</style>
