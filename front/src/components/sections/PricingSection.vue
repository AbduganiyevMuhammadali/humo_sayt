<script setup>
import { computed } from 'vue'
import { t } from '../../i18n'

// Цены — ориентировочные плейсхолдеры, легко заменить.
const prices = ['150 000', '450 000', '700 000']
const featured = [false, true, false]

const plans = computed(() =>
  t('pricing.items').map((p, i) => ({ ...p, price: prices[i], featured: featured[i] })),
)

function go() {
  document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="pricing" class="section pricing">
    <div class="container">
      <header class="pricing__head">
        <p class="eyebrow" v-reveal>{{ t('pricing.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('pricing.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('pricing.lead') }}
        </p>
      </header>

      <div class="pricing__grid">
        <article
          v-for="(p, i) in plans"
          :key="p.name"
          class="plan"
          :class="{ featured: p.featured }"
          v-reveal
        >
          <span v-if="p.featured" class="plan__badge">{{ t('pricing.popular') }}</span>
          <h3 class="plan__name">{{ p.name }}</h3>
          <p class="plan__desc">{{ p.desc }}</p>
          <div class="plan__price">
            <strong>{{ p.price }}</strong><span>{{ t('pricing.currency') }}</span>
          </div>
          <ul class="plan__features">
            <li v-for="f in p.features" :key="f">{{ f }}</li>
          </ul>
          <button
            class="btn plan__btn"
            :class="p.featured ? 'btn-primary' : 'btn-outline'"
            @click="go"
          >
            {{ t('pricing.book') }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  background: var(--bg);
}
.pricing__head {
  text-align: center;
  max-width: 660px;
  margin: 0 auto 52px;
}
.section-title {
  margin-top: 16px;
}
.section-lead {
  margin: 18px auto 0;
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: center;
}

.plan {
  position: relative;
  padding: 36px 30px;
  border-radius: var(--radius-lg);
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.08);
  box-shadow: var(--shadow-sm);
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}
.plan:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow);
}
.plan.featured {
  background: linear-gradient(165deg, var(--navy-800), var(--blue-500));
  color: #fff;
  box-shadow: var(--shadow-lg);
  transform: scale(1.04);
  border: none;
}
.plan.featured:hover {
  transform: scale(1.04) translateY(-8px);
}

.plan__badge {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--navy-900);
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
}
.plan__name {
  font-size: 1.3rem;
  color: var(--navy-900);
}
.plan.featured .plan__name {
  color: #fff;
}
.plan__desc {
  margin-top: 10px;
  font-size: 0.94rem;
  color: var(--text-muted);
  min-height: 48px;
}
.plan.featured .plan__desc {
  color: var(--text-on-dark-muted);
}
.plan__price {
  margin-top: 18px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(36, 65, 108, 0.1);
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.plan.featured .plan__price {
  border-color: rgba(255, 255, 255, 0.18);
}
.plan__price strong {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--navy-900);
}
.plan.featured .plan__price strong {
  color: #fff;
}
.plan__price span {
  font-weight: 600;
  color: var(--text-muted);
}
.plan.featured .plan__price span {
  color: var(--text-on-dark-muted);
}

.plan__features {
  margin: 24px 0 30px;
  display: grid;
  gap: 13px;
}
.plan__features li {
  position: relative;
  padding-left: 28px;
  font-size: 0.96rem;
  color: var(--navy-800);
}
.plan.featured .plan__features li {
  color: var(--text-on-dark);
}
.plan__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  font-size: 0.68rem;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--blue-400));
}

.plan__btn {
  width: 100%;
}
.plan.featured .plan__btn {
  background: #fff;
  color: var(--navy-800);
}
.plan.featured .plan__btn:hover {
  background: var(--accent-2);
}

@media (max-width: 980px) {
  .pricing__grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
  .plan.featured {
    transform: none;
  }
  .plan.featured:hover {
    transform: translateY(-8px);
  }
}
</style>
