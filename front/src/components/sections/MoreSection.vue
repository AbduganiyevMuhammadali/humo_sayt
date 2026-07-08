<script setup>
import { computed } from 'vue'
import { useImageExists } from '../../composables/useImageExists'
import { t } from '../../i18n'

const poolImg = useImageExists('/images/pool.jpg')
const poolImg2 = useImageExists('/images/pool-2.jpg')

const benefits = computed(() => t('more.benefits'))
const cases = computed(() => t('more.cases'))
</script>

<template>
  <section id="more" class="section more">
    <span class="more__glow" aria-hidden="true"></span>

    <div class="container more__grid">
      <div class="more__media" v-reveal>
        <div
          class="more__photo"
          :class="{ 'has-img': poolImg }"
          :style="poolImg ? { backgroundImage: `url(/images/pool.jpg)` } : {}"
        >
          <template v-if="!poolImg">
            <span class="wave" aria-hidden="true"></span>
            <span class="wave wave--2" aria-hidden="true"></span>
          </template>
          <span class="more__shimmer" aria-hidden="true"></span>
        </div>

        <!-- второе фото бассейна (джакузи) — плавающая вставка -->
        <div
          v-if="poolImg2"
          class="more__inset"
          :style="{ backgroundImage: `url(/images/pool-2.jpg)` }"
        ></div>

        <div class="more__chip more__chip--a">{{ t('more.chip1') }}</div>
        <div class="more__chip more__chip--b">{{ t('more.chip2') }}</div>
      </div>

      <div class="more__content">
        <p class="eyebrow eyebrow--light" v-reveal>{{ t('more.eyebrow') }}</p>
        <h2 class="more__title serif" v-reveal>{{ t('more.title') }}</h2>
        <p class="more__lead" v-reveal>
          {{ t('more.lead') }}
        </p>

        <div class="more__cards">
          <div class="more__card" v-reveal>
            <h3>{{ t('more.benefitsTitle') }}</h3>
            <ul>
              <li v-for="b in benefits" :key="b">{{ b }}</li>
            </ul>
          </div>
          <div class="more__card" v-reveal>
            <h3>{{ t('more.casesTitle') }}</h3>
            <ul>
              <li v-for="c in cases" :key="c">{{ c }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.more {
  position: relative;
  overflow: hidden;
  color: var(--text-on-dark);
  background:
    radial-gradient(90% 90% at 80% 10%, rgba(63, 123, 196, 0.4), transparent 60%),
    linear-gradient(160deg, #0f1f3a 0%, #16294a 55%, #1d3457 100%);
}

.more__glow {
  position: absolute;
  width: 520px;
  height: 520px;
  left: -160px;
  bottom: -200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(94, 234, 212, 0.28), transparent 70%);
  filter: blur(20px);
}

.more__grid {
  position: relative;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 56px;
  align-items: center;
}

.more__media {
  position: relative;
}
.more__photo {
  position: relative;
  aspect-ratio: 4 / 4.4;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background:
    linear-gradient(160deg, #1b3a5e, #2f6f8f 55%, #2aa9b8);
  background-size: cover;
  background-position: center;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.more__photo.has-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 31, 58, 0.15), rgba(15, 31, 58, 0.4));
}

/* плавающая вставка со вторым фото бассейна */
.more__inset {
  position: absolute;
  right: -22px;
  bottom: -22px;
  width: 46%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  background-size: cover;
  background-position: center;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4);
  border: 4px solid #fff;
  animation: floatY 6s ease-in-out infinite;
  z-index: 3;
}
/* light sweep across the photo */
.more__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(255, 255, 255, 0.18) 48%,
    transparent 62%
  );
  transform: translateX(-100%);
  animation: sweep 5.5s ease-in-out infinite;
  z-index: 1;
}
@keyframes sweep {
  0%,
  60% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.wave {
  position: absolute;
  left: -20%;
  right: -20%;
  bottom: 0;
  height: 46%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 45%;
  animation: waveMove 7s ease-in-out infinite;
}
.wave--2 {
  bottom: -6%;
  height: 52%;
  background: rgba(94, 234, 212, 0.16);
  animation-duration: 9s;
  animation-direction: reverse;
}
@keyframes waveMove {
  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(6%) rotate(3deg);
  }
}

.more__chip {
  position: absolute;
  padding: 12px 20px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.95);
  color: var(--navy-800);
  font-weight: 700;
  font-size: 0.92rem;
  box-shadow: var(--shadow);
  animation: floatY 5s ease-in-out infinite;
}
.more__chip--a {
  top: 22px;
  right: -14px;
}
.more__chip--b {
  bottom: 30px;
  left: -16px;
  animation-delay: -2.5s;
}
@keyframes floatY {
  50% {
    transform: translateY(-12px);
  }
}

.eyebrow--light {
  color: var(--accent-2);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}
.eyebrow--light::before {
  background: var(--accent-2);
}
.more__title {
  margin-top: 18px;
  font-size: clamp(2rem, 4.4vw, 3.2rem);
  color: #fff;
}
.more__lead {
  margin-top: 20px;
  max-width: 58ch;
  color: var(--text-on-dark);
  opacity: 0.9;
}

.more__cards {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.more__card {
  padding: 24px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  transition: transform 0.4s var(--ease), background 0.4s var(--ease);
}
.more__card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}
.more__card h3 {
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-2);
}
.more__card ul {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.more__card li {
  position: relative;
  padding-left: 24px;
  font-size: 0.95rem;
  color: var(--text-on-dark);
}
.more__card li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

@media (max-width: 920px) {
  .more__grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .more__media {
    max-width: 420px;
  }
}
@media (max-width: 540px) {
  .more__cards {
    grid-template-columns: 1fr;
  }
}
</style>
