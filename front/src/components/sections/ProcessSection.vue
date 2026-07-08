<script setup>
import { computed } from 'vue'
import { t } from '../../i18n'

const steps = computed(() =>
  t('process.steps').map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') })),
)
</script>

<template>
  <section id="process" class="section process">
    <div class="container">
      <header class="process__head">
        <p class="eyebrow eyebrow--light" v-reveal>{{ t('process.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('process.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('process.lead') }}
        </p>
      </header>

      <div class="process__grid">
        <article
          v-for="(s, i) in steps"
          :key="s.n"
          class="step"
          v-reveal
          :class="`reveal-delay-${i + 1}`"
        >
          <span class="step__num">{{ s.n }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <span class="step__line" aria-hidden="true" v-if="i < steps.length - 1"></span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process {
  position: relative;
  overflow: hidden;
  color: var(--text-on-dark);
  background:
    radial-gradient(70% 80% at 85% 0%, rgba(63, 123, 196, 0.35), transparent 60%),
    linear-gradient(160deg, #0f1f3a, #16294a 60%, #1d3457);
}
.process__head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;
}
.eyebrow--light {
  color: var(--accent-2);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}
.eyebrow--light::before {
  background: var(--accent-2);
}
.section-title {
  margin-top: 16px;
  color: #fff;
}
.section-lead {
  margin: 18px auto 0;
  color: var(--text-on-dark);
  opacity: 0.86;
}

.process__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.step {
  position: relative;
  padding: 30px 26px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: transform 0.45s var(--ease), background 0.45s var(--ease);
}
.step:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.09);
}
.step__num {
  display: inline-grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--navy-900);
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  box-shadow: 0 12px 28px rgba(94, 234, 212, 0.35);
}
.step h3 {
  margin-top: 20px;
  font-size: 1.16rem;
  color: #fff;
}
.step p {
  margin-top: 10px;
  font-size: 0.95rem;
  color: var(--text-on-dark-muted);
}
.step__line {
  position: absolute;
  top: 58px;
  right: -16px;
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-2), transparent);
  z-index: 2;
}

@media (max-width: 1000px) {
  .process__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .step__line {
    display: none;
  }
}
@media (max-width: 560px) {
  .process__grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
