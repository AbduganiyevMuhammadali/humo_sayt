<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const faqs = computed(() => t('faq.items'))

const open = ref(0)
function toggle(i) {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <section id="faq" class="section faq">
    <div class="container faq__grid">
      <div class="faq__intro">
        <p class="eyebrow" v-reveal>{{ t('faq.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('faq.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('faq.lead') }}
        </p>
        <a href="#contacts" class="btn btn-primary faq__cta" v-reveal>{{ t('faq.cta') }}</a>
      </div>

      <ul class="faq__list" v-reveal>
        <li
          v-for="(f, i) in faqs"
          :key="i"
          class="faq__item"
          :class="{ open: open === i }"
        >
          <button class="faq__q" @click="toggle(i)" :aria-expanded="open === i">
            <span>{{ f.q }}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </button>
          <div class="faq__a-wrap">
            <p class="faq__a">{{ f.a }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq {
  background: var(--bg);
}
.faq__grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 56px;
  align-items: start;
}
.section-title {
  margin-top: 16px;
}
.section-lead {
  margin-top: 18px;
}
.faq__cta {
  margin-top: 28px;
}

.faq__list {
  display: grid;
  gap: 14px;
}
.faq__item {
  background: #fff;
  border: 1px solid rgba(36, 65, 108, 0.08);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.faq__item.open {
  border-color: rgba(63, 123, 196, 0.4);
  box-shadow: var(--shadow);
}
.faq__q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px;
  text-align: left;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--navy-900);
}
.faq__icon {
  position: relative;
  flex: none;
  width: 24px;
  height: 24px;
}
.faq__icon::before,
.faq__icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 2.5px;
  border-radius: 2px;
  background: var(--blue-500);
  transform: translate(-50%, -50%);
  transition: transform 0.35s var(--ease);
}
.faq__icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.faq__item.open .faq__icon::after {
  transform: translate(-50%, -50%) rotate(0deg);
}
.faq__a-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s var(--ease);
}
.faq__item.open .faq__a-wrap {
  grid-template-rows: 1fr;
}
.faq__a {
  overflow: hidden;
  padding: 0 24px;
  color: var(--text-muted);
  line-height: 1.7;
}
.faq__item.open .faq__a {
  padding-bottom: 24px;
}

@media (max-width: 900px) {
  .faq__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}
</style>
