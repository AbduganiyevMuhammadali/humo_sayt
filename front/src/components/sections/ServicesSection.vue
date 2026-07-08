<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../../i18n'
import { servicesContent } from '../../data/servicesContent'

const router = useRouter()

// i18n tartibi servicesContent tartibi bilan mos — slug shu yerdan olinadi.
const slugs = servicesContent.map((s) => s.slug)

// Иконки услуг (по порядку списка из i18n).
const icons = [
  // 1. Стационар — кровать
  'M3 7v10M3 12h13a4 4 0 0 1 4 4v1M3 17h18M7 11a2 2 0 1 0 0-.001',
  // 2. Физиотерапия — рука/импульс
  'M5 13c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2M5 17c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2M12 3v6',
  // 3. УЗИ/Рентген/ЭХО — монитор с пульсом
  'M3 5h18v11H3zM7 21h10M3 11h4l1.5 3 2-6 1.5 3H21',
  // 4. Лаборатория — пробирка
  'M9 3v6.5L5.2 17a3 3 0 0 0 2.6 4.5h8.4A3 3 0 0 0 18.8 17L15 9.5V3M9 3h6M8 13h8',
  // 5. Хиджама/пиявки — капля
  'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  // 6. Операции — скальпель/крест
  'M12 4v16M4 12h16',
  // 7. Бассейн и сауна — волны
  'M2 16c2 0 2-1.5 4-1.5S8 16 10 16s2-1.5 4-1.5S16 16 18 16s2-1.5 4-1.5M2 20c2 0 2-1.5 4-1.5S8 20 10 20s2-1.5 4-1.5S16 20 18 20s2-1.5 4-1.5M7 12V5a2 2 0 0 1 4 0M14 12V5a2 2 0 0 1 4 0',
  // 8. Солевая комната — кристаллы/снежинка
  'M12 2v20M4 6l16 12M20 6L4 18M2 12h20',
  // 9. Гинекология — женский символ
  'M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 13v8M9 18h6',
  // 10. Фитобочка — лист
  'M5 21c0-8 6-14 14-14 0 8-6 14-14 14ZM5 21c2-4 5-7 9-9',
]

const services = computed(() =>
  t('services.items').map((s, i) => ({
    ...s,
    icon: icons[i] || icons[0],
    slug: slugs[i],
  })),
)

function openService(slug) {
  if (slug) router.push(`/services/${slug}`)
}
</script>

<template>
  <section id="services" class="section services">
    <div class="container">
      <header class="services__head">
        <p class="eyebrow" v-reveal>{{ t('services.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('services.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('services.lead') }}
        </p>
      </header>

      <div class="services__grid">
        <article
          v-for="(s, i) in services"
          :key="s.title"
          class="service"
          :class="[`reveal-delay-${(i % 3) + 1}`, { 'is-link': s.slug }]"
          v-reveal
          @click="openService(s.slug)"
        >
          <span class="service__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path :d="s.icon" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <div class="service__foot">
            <span class="service__btn">{{ t('services.more') }} →</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  background: var(--bg);
}
.services__head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 52px;
}
.section-title {
  margin-top: 16px;
}
.section-lead {
  margin: 18px auto 0;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.service {
  position: relative;
  padding: 30px 28px;
  border-radius: var(--radius-lg);
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.07);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}
.service.is-link {
  cursor: pointer;
}
.service::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-2), var(--blue-400));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--ease);
}
.service:hover {
  transform: translateY(-7px);
  box-shadow: var(--shadow);
}
.service:hover::before {
  transform: scaleX(1);
}

.service__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  box-shadow: 0 12px 26px rgba(36, 65, 108, 0.3);
  transition: transform 0.5s var(--ease-spring), box-shadow 0.5s var(--ease);
}
.service__icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 22px;
  border: 1.5px solid var(--accent-2);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.45s var(--ease), transform 0.45s var(--ease-spring);
}
.service:hover .service__icon {
  transform: rotate(-8deg) scale(1.1);
  box-shadow: 0 18px 36px rgba(36, 65, 108, 0.4);
}
.service:hover .service__icon::after {
  opacity: 0.6;
  transform: scale(1);
}
.service h3 {
  margin-top: 20px;
  font-size: 1.2rem;
  color: var(--navy-900);
}
.service p {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 0.96rem;
}
.service__foot {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(36, 65, 108, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
}
.service__btn {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--blue-500);
  transition: color 0.3s var(--ease), transform 0.3s var(--ease);
}
.service__btn:hover {
  color: var(--navy-800);
  transform: translateX(3px);
}

@media (max-width: 900px) {
  .services__grid {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
  }
}
@media (min-width: 901px) and (max-width: 1100px) {
  .services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
