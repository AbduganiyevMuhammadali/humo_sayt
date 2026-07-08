<script setup>
import { computed } from 'vue'
import { useImageExists } from '../../composables/useImageExists'
import { t } from '../../i18n'

const aboutImg = useImageExists('/images/about.jpg')

const icons = [
  'M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z',
  'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4Z',
  'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z',
]
const pillars = computed(() => [
  { icon: icons[0], title: t('about.pillar1Title'), text: t('about.pillar1Text') },
  { icon: icons[1], title: t('about.pillar2Title'), text: t('about.pillar2Text') },
  { icon: icons[2], title: t('about.pillar3Title'), text: t('about.pillar3Text') },
])

const services = computed(() => t('about.tags'))
</script>

<template>
  <section id="about" class="section about">
    <div class="container about__grid">
      <div class="about__intro">
        <p class="eyebrow" v-reveal>{{ t('about.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>
          {{ t('about.title') }} <span class="grad">Humo Medline</span>
        </h2>
        <p class="section-lead" v-reveal>
          {{ t('about.lead') }}
        </p>
        <p class="about__note" v-reveal>
          {{ t('about.note') }}
        </p>

        <ul class="about__tags" v-reveal>
          <li v-for="s in services" :key="s">{{ s }}</li>
        </ul>
      </div>

      <div class="about__side">
        <div
          class="about__media"
          :class="{ 'has-img': aboutImg }"
          :style="aboutImg ? { backgroundImage: `url(/images/about.jpg)` } : {}"
          v-reveal
        >
          <span class="about__media-glow" aria-hidden="true"></span>
          <div class="about__floatcard">
            <span class="about__floatcard-icon">＋</span>
            <div>
              <strong>{{ t('about.cardTitle') }}</strong>
              <small>{{ t('about.cardText') }}</small>
            </div>
          </div>
        </div>

        <div class="about__pillars">
          <article
            v-for="(p, i) in pillars"
            :key="p.title"
            class="pillar"
            v-reveal
            :class="`reveal-delay-${i + 1}`"
          >
            <span class="pillar__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26"><path :d="p.icon" /></svg>
            </span>
            <div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background:
    radial-gradient(80% 60% at 100% 0%, rgba(110, 167, 224, 0.12), transparent 60%),
    var(--bg);
}

.about__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 56px;
  align-items: center;
}

.grad {
  background: linear-gradient(120deg, var(--blue-400), var(--navy-700));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-title {
  margin-top: 18px;
}
.section-lead {
  margin-top: 22px;
}
.about__note {
  margin-top: 18px;
  color: var(--text-muted);
}

.about__tags {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.about__tags li {
  padding: 9px 18px;
  border-radius: var(--radius-pill);
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.12);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--navy-700);
  box-shadow: var(--shadow-sm);
}

.about__side {
  display: grid;
  gap: 18px;
}

.about__media {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background:
    radial-gradient(120% 100% at 50% 0%, rgba(110, 167, 224, 0.5), transparent 60%),
    linear-gradient(160deg, #2f5d97, #1d3457);
  background-size: cover;
  background-position: center;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.about__media.has-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(15, 31, 58, 0.35));
}
.about__media-glow {
  position: absolute;
  inset: auto -30% -40% -30%;
  height: 70%;
  background: radial-gradient(circle, rgba(94, 234, 212, 0.4), transparent 70%);
  filter: blur(20px);
  animation: pulseGlow 6s ease-in-out infinite;
}
@keyframes pulseGlow {
  50% {
    opacity: 0.5;
    transform: translateY(-10px);
  }
}
.about__floatcard {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow);
  animation: floatY 5s ease-in-out infinite;
}
@keyframes floatY {
  50% {
    transform: translateY(-9px);
  }
}
.about__floatcard-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--blue-400));
}
.about__floatcard strong {
  display: block;
  font-size: 1rem;
  color: var(--navy-900);
}
.about__floatcard small {
  color: var(--text-muted);
  font-size: 0.84rem;
}

.about__pillars {
  display: grid;
  gap: 14px;
}
.pillar {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: 24px;
  border-radius: var(--radius);
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.08);
  box-shadow: var(--shadow-sm);
  transition: transform 0.4s var(--ease-spring), box-shadow 0.4s var(--ease),
    border-color 0.4s var(--ease);
}
.pillar:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
  border-color: rgba(63, 123, 196, 0.3);
}
.pillar__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  color: #fff;
  box-shadow: 0 10px 22px rgba(36, 65, 108, 0.25);
  transition: transform 0.5s var(--ease-spring);
}
.pillar:hover .pillar__icon {
  transform: rotate(-8deg) scale(1.08);
}
.pillar h3 {
  font-size: 1.12rem;
  color: var(--navy-900);
}
.pillar p {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 0.96rem;
}

@media (max-width: 920px) {
  .about__grid {
    grid-template-columns: 1fr;
    gap: 38px;
  }
}
</style>
