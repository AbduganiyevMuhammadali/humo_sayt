<script setup>
import { computed } from 'vue'
import { t } from '../../i18n'

const cards = computed(() => [
  {
    icon: 'M12 2 3 7v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V7l-9-5Zm-1 14-3.5-3.5L9 11l2 2 4-4 1.5 1.5L11 16Z',
    title: t('quick.c1Title'),
    text: t('quick.c1Text'),
    action: t('quick.c1Action'),
    href: 'tel:+998900000000',
    accent: 'red',
  },
  {
    icon: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z',
    title: t('quick.c2Title'),
    text: t('quick.c2Text'),
    action: t('quick.c2Action'),
    href: '#doctors',
    accent: 'blue',
  },
  {
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 11h-2V6h2v5h4v2h-4Z',
    title: t('quick.c3Title'),
    text: t('quick.c3Text'),
    action: t('quick.c3Action'),
    href: '#contacts',
    accent: 'teal',
  },
])

function go(href) {
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.href = href
  }
}
</script>

<template>
  <section class="quick">
    <div class="container quick__grid">
      <article
        v-for="(c, i) in cards"
        :key="c.title"
        class="qcard"
        :class="[`qcard--${c.accent}`, `reveal-delay-${i + 1}`]"
        v-reveal
      >
        <span class="qcard__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28"><path :d="c.icon" /></svg>
        </span>
        <div class="qcard__body">
          <h3>{{ c.title }}</h3>
          <p>{{ c.text }}</p>
          <button class="qcard__action" @click="go(c.href)">{{ c.action }} →</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.quick {
  position: relative;
  z-index: 5;
  margin-top: -70px;
}
.quick__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.qcard {
  position: relative;
  display: flex;
  gap: 18px;
  padding: 28px 26px;
  border-radius: var(--radius-lg);
  background: #fff;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}
.qcard::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
}
.qcard:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.qcard--red::before {
  background: linear-gradient(180deg, #ff7a7a, #e23b3b);
}
.qcard--blue::before {
  background: linear-gradient(180deg, var(--blue-300), var(--blue-500));
}
.qcard--teal::before {
  background: linear-gradient(180deg, var(--accent-2), #14b8a6);
}

.qcard__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  color: #fff;
  transition: transform 0.45s var(--ease);
}
.qcard--red .qcard__icon {
  background: linear-gradient(135deg, #ff8a8a, #e23b3b);
}
.qcard--blue .qcard__icon {
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
}
.qcard--teal .qcard__icon {
  background: linear-gradient(135deg, var(--accent-2), #14b8a6);
}
.qcard:hover .qcard__icon {
  transform: rotate(-6deg) scale(1.06);
}

.qcard__body h3 {
  font-size: 1.18rem;
  color: var(--navy-900);
}
.qcard__body p {
  margin-top: 8px;
  font-size: 0.94rem;
  color: var(--text-muted);
}
.qcard__action {
  margin-top: 14px;
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--blue-500);
  transition: transform 0.3s var(--ease), color 0.3s var(--ease);
}
.qcard__action:hover {
  transform: translateX(4px);
  color: var(--navy-800);
}

@media (max-width: 980px) {
  .quick__grid {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
  }
  .quick {
    margin-top: -50px;
  }
}
</style>
