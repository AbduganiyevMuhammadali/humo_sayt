<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { t } from '../../i18n'
import { useImageExists } from '../../composables/useImageExists'

// Иконки и фирменные градиенты для каждого слайда (по порядку слайдов в i18n).
const meta = [
  {
    icon: 'M19 8h-2V3H7v5H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-9-3h4v3h-4V5Zm4 11h-2v2h-2v-2H8v-2h2v-2h2v2h2v2Z',
    grad: 'linear-gradient(140deg,#3f7bc4,#1d3457)',
  },
  {
    icon: 'M9 2v6.2L4.8 16A3 3 0 0 0 7.4 20.5h9.2A3 3 0 0 0 19.2 16L15 8.2V2H9Zm2 2h2v4.7l1.2 2.3H9.8L11 8.7V4Z',
    grad: 'linear-gradient(140deg,#5eead4,#14b8a6)',
  },
  {
    icon: 'M3 10v10h4v-6h10v6h4V10L12 3 3 10Zm6 4h6v-2H9v2Z',
    grad: 'linear-gradient(140deg,#6ea7e0,#2f5d97)',
  },
  {
    icon: 'M5 4h14v3H5V4Zm0 5h14v11H5V9Zm3 3v5h2v-5H8Zm4 0v5h2v-5h-2Z',
    grad: 'linear-gradient(140deg,#38bdf8,#3f7bc4)',
  },
  {
    icon: 'M3 13c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2 2.5 2 4.5 2M3 18c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2 2.5 2 4.5 2M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    grad: 'linear-gradient(140deg,#2aa9b8,#1b3a5e)',
  },
  {
    icon: 'M12 2 3 7v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V7l-9-5Zm-1 14-3.5-3.5L9 11l2 2 4-4 1.5 1.5L11 16Z',
    grad: 'linear-gradient(140deg,#ff8a8a,#e23b3b)',
  },
]

const slides = computed(() =>
  t('highlights.slides').map((s, i) => ({
    ...s,
    icon: meta[i]?.icon,
    grad: meta[i]?.grad,
    img: `/images/highlight-${i + 1}.jpg`,
  })),
)

// проверяем наличие реальных фото (необязательно)
const imgExists = meta.map((_, i) => useImageExists(`/images/highlight-${i + 1}.jpg`))

// Сколько карточек видно — зависит от ширины; логика прокрутки по «странице».
const perView = ref(3)
function updatePerView() {
  const w = window.innerWidth
  perView.value = w <= 640 ? 1 : w <= 1000 ? 2 : 3
}

const index = ref(0)
const maxIndex = computed(() => Math.max(0, slides.value.length - perView.value))

function clamp() {
  if (index.value > maxIndex.value) index.value = maxIndex.value
}
function next() {
  index.value = index.value >= maxIndex.value ? 0 : index.value + 1
}
function prev() {
  index.value = index.value <= 0 ? maxIndex.value : index.value - 1
}
function goTo(i) {
  index.value = Math.min(i, maxIndex.value)
}

// Сдвиг на одну карточку = ширина карточки + gap.
// Ширина карточки = (100% - gap*(perView-1)) / perView.
const GAP = 22
const trackStyle = computed(() => {
  const pv = perView.value
  const step = `((100% - ${GAP * (pv - 1)}px) / ${pv} + ${GAP}px)`
  return { transform: `translateX(calc(-${index.value} * ${step}))` }
})

// автопрокрутка с паузой при наведении
let timer = null
const paused = ref(false)
function start() {
  stop()
  timer = setInterval(() => {
    if (!paused.value) next()
  }, 3500)
}
function stop() {
  if (timer) clearInterval(timer)
}

function onResize() {
  updatePerView()
  clamp()
}

onMounted(() => {
  updatePerView()
  start()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  stop()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section id="highlights" class="hl section">
    <div class="container">
      <header class="hl__head">
        <div>
          <p class="eyebrow" v-reveal>{{ t('highlights.eyebrow') }}</p>
          <h2 class="section-title" v-reveal>{{ t('highlights.title') }}</h2>
          <p class="section-lead" v-reveal>{{ t('highlights.lead') }}</p>
        </div>
        <div class="hl__nav" v-reveal>
          <button class="hl__arrow" aria-label="prev" @click="prev">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="hl__arrow" aria-label="next" @click="next">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </header>

      <div
        class="hl__viewport"
        v-reveal
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <div class="hl__track" :style="trackStyle">
          <article v-for="(s, i) in slides" :key="i" class="hcard">
            <div
              class="hcard__media"
              :class="{ 'has-img': imgExists[i].value }"
              :style="imgExists[i].value ? { backgroundImage: `url(${s.img})` } : { background: s.grad }"
            >
              <span v-if="!imgExists[i].value" class="hcard__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="40" height="40"><path :d="s.icon" fill="currentColor"/></svg>
              </span>
              <span class="hcard__num">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div class="hcard__body">
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </div>
          </article>
        </div>
      </div>

      <div class="hl__dots">
        <button
          v-for="n in (maxIndex + 1)"
          :key="n"
          class="hl__dot"
          :class="{ active: index === n - 1 }"
          :aria-label="`slide ${n}`"
          @click="goTo(n - 1)"
        ></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hl {
  background:
    radial-gradient(60% 50% at 0% 0%, rgba(94, 234, 212, 0.1), transparent 60%),
    var(--bg);
  overflow: hidden;
}
.hl__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 44px;
}
.section-title {
  margin-top: 16px;
}
.section-lead {
  margin-top: 16px;
  max-width: 52ch;
}

.hl__nav {
  display: flex;
  gap: 12px;
}
.hl__arrow {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--navy-800);
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.12);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s var(--ease-spring), background 0.3s var(--ease), color 0.3s var(--ease);
}
.hl__arrow:hover {
  transform: translateY(-3px) scale(1.05);
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  color: #fff;
}

.hl__viewport {
  overflow: hidden;
  padding: 6px;
  margin: -6px;
}
.hl__track {
  display: flex;
  gap: 22px;
  transition: transform 0.7s var(--ease);
}
.hcard {
  flex: 0 0 calc((100% - 44px) / 3);
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(36, 65, 108, 0.07);
  box-shadow: var(--shadow-sm);
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}
.hcard:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.hcard__media {
  position: relative;
  aspect-ratio: 16 / 10;
  display: grid;
  place-items: center;
  background-size: cover;
  background-position: center;
  color: #fff;
}
.hcard__media.has-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(15, 31, 58, 0.45));
}
.hcard__icon {
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  animation: floaty 5s ease-in-out infinite;
}
@keyframes floaty {
  50% {
    transform: translateY(-8px);
  }
}
.hcard__num {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 2;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hcard__body {
  padding: 22px 24px 26px;
}
.hcard__body h3 {
  font-size: 1.2rem;
  color: var(--navy-900);
}
.hcard__body p {
  margin-top: 10px;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.hl__dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
}
.hl__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(36, 65, 108, 0.2);
  transition: all 0.35s var(--ease);
}
.hl__dot.active {
  width: 30px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--blue-400));
}

@media (max-width: 1000px) {
  .hcard {
    flex: 0 0 calc((100% - 22px) / 2);
  }
}
@media (max-width: 640px) {
  .hcard {
    flex: 0 0 100%;
  }
  .hl__head {
    align-items: flex-start;
  }
}
</style>
