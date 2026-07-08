<script setup>
import { onMounted, ref, computed } from 'vue'
import { t } from '../../i18n'

const targets = [
  { target: 15, suffix: '+' },
  { target: 5000, suffix: '+' },
  { target: 20, suffix: '+' },
  { target: 98, suffix: '%' },
]
const stats = computed(() =>
  t('testimonials.stats').map((s, i) => ({ ...targets[i], label: s.label })),
)
const display = ref(targets.map(() => 0))
const statsEl = ref(null)
let animated = false

function animateCounters() {
  if (animated) return
  animated = true
  targets.forEach((s, i) => {
    const dur = 1400
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      display.value[i] = Math.round(s.target * eased)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

onMounted(() => {
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters()
        obs.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  if (statsEl.value) obs.observe(statsEl.value)
})

const avatars = ['ДА', 'ШМ', 'БР']
const reviews = computed(() =>
  t('testimonials.reviews').map((r, i) => ({ ...r, initials: avatars[i] })),
)
</script>

<template>
  <section class="section testimonials">
    <div class="container">
      <div ref="statsEl" class="stats">
        <div v-for="(s, i) in stats" :key="s.label" class="stats__item" v-reveal :class="`reveal-delay-${i + 1}`">
          <strong>{{ display[i].toLocaleString('ru-RU') }}{{ s.suffix }}</strong>
          <span>{{ s.label }}</span>
        </div>
      </div>

      <header class="testimonials__head">
        <p class="eyebrow" v-reveal>{{ t('testimonials.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('testimonials.title') }}</h2>
      </header>

      <div class="reviews">
        <article
          v-for="(r, i) in reviews"
          :key="r.name"
          class="review"
          v-reveal
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="review__stars" aria-label="5 из 5">★★★★★</div>
          <p class="review__text">«{{ r.text }}»</p>
          <div class="review__author">
            <span class="review__avatar">{{ r.initials }}</span>
            <div>
              <strong>{{ r.name }}</strong>
              <small>{{ r.role }}</small>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  background:
    radial-gradient(60% 50% at 0% 0%, rgba(94, 234, 212, 0.1), transparent 60%),
    #eef4fb;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 36px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--navy-800), var(--blue-500));
  box-shadow: var(--shadow);
  margin-bottom: clamp(56px, 8vw, 90px);
}
.stats__item {
  text-align: center;
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.14);
}
.stats__item:last-child {
  border-right: none;
}
.stats__item strong {
  display: block;
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 800;
  background: linear-gradient(120deg, #fff, var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stats__item span {
  display: block;
  margin-top: 6px;
  font-size: 0.88rem;
  letter-spacing: 0.04em;
  color: var(--text-on-dark-muted);
}

.testimonials__head {
  text-align: center;
  margin-bottom: 44px;
}
.section-title {
  margin-top: 16px;
}

.reviews {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.review {
  padding: 30px 28px;
  border-radius: var(--radius-lg);
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.07);
  box-shadow: var(--shadow-sm);
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}
.review:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow);
}
.review__stars {
  color: #f4b400;
  letter-spacing: 3px;
  font-size: 1.05rem;
}
.review__text {
  margin-top: 16px;
  color: var(--text);
  font-size: 1rem;
  line-height: 1.7;
}
.review__author {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.review__avatar {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
}
.review__author strong {
  display: block;
  color: var(--navy-900);
}
.review__author small {
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px 20px;
  }
  .stats__item:nth-child(2) {
    border-right: none;
  }
  .reviews {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }
}
@media (max-width: 480px) {
  .stats {
    grid-template-columns: 1fr;
  }
  .stats__item {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
    padding-bottom: 18px;
  }
  .stats__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}
</style>
