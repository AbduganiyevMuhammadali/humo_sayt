<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const icons = [
  'M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9Z',
  'M12 2a5 5 0 0 0-5 5c0 1 .3 1.9.8 2.7A4 4 0 0 0 6 13a4 4 0 0 0 2 3.5V18a2 2 0 0 0 4 0 2 2 0 0 0 4 0v-1.5A4 4 0 0 0 18 13a4 4 0 0 0-1.8-3.3c.5-.8.8-1.7.8-2.7a5 5 0 0 0-5-5Z',
  'M12 4a4 4 0 0 1 4 4c0 2-1.5 3.5-4 6-2.5-2.5-4-4-4-6a4 4 0 0 1 4-4Zm0 14c4 0 7 1 7 3v1H5v-1c0-2 3-3 7-3Z',
  'M3 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M3 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2',
  'M9 3a6 6 0 0 1 6 6c0 3-2 4-2 7a3 3 0 0 1-6 0M9 9h.01',
]

const departments = computed(() =>
  t('departments.items').map((d, i) => ({ ...d, key: String(i), icon: icons[i] })),
)

const active = ref(0)
const current = () => departments.value.find((d) => d.key === String(active.value)) || departments.value[0]

function goContacts() {
  document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="departments" class="section depts">
    <div class="container">
      <header class="depts__head">
        <p class="eyebrow" v-reveal>{{ t('departments.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('departments.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('departments.lead') }}
        </p>
      </header>

      <div class="depts__panel" v-reveal>
        <aside class="depts__tabs">
          <button
            v-for="(d, i) in departments"
            :key="d.key"
            class="dtab"
            :class="{ active: active === i }"
            @click="active = i"
          >
            <span class="dtab__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path :d="d.icon" fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            {{ d.name }}
          </button>
        </aside>

        <Transition name="fade" mode="out-in">
          <div class="depts__content" :key="active">
            <h3>{{ current().title }}</h3>
            <p>{{ current().text }}</p>
            <ul>
              <li v-for="p in current().points" :key="p">{{ p }}</li>
            </ul>
            <a href="#contacts" class="btn btn-primary" @click.prevent="goContacts">
              {{ t('departments.book') }}
            </a>
          </div>
        </Transition>

        <div class="depts__visual" aria-hidden="true">
          <span class="depts__visual-icon">
            <svg viewBox="0 0 24 24" width="120" height="120">
              <path :d="current().icon" fill="none" stroke="currentColor" stroke-width="1.3"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="depts__pulse"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.depts {
  background:
    radial-gradient(60% 60% at 100% 100%, rgba(94, 234, 212, 0.1), transparent 60%),
    #eef4fb;
}
.depts__head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 48px;
}
.section-title {
  margin-top: 16px;
}
.section-lead {
  margin: 18px auto 0;
}

.depts__panel {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 0;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  border: 1px solid rgba(36, 65, 108, 0.07);
}

.depts__tabs {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f7fafe;
  border-right: 1px solid rgba(36, 65, 108, 0.07);
}
.dtab {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius);
  text-align: left;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-muted);
  transition: background 0.3s var(--ease), color 0.3s var(--ease);
}
.dtab__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff;
  color: var(--blue-500);
  border: 1px solid rgba(36, 65, 108, 0.1);
  transition: all 0.3s var(--ease);
}
.dtab:hover {
  color: var(--navy-900);
}
.dtab.active {
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  color: #fff;
}
.dtab.active .dtab__icon {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border-color: transparent;
}

.depts__content {
  padding: 44px 40px;
}
.depts__content h3 {
  font-size: 1.5rem;
  color: var(--navy-900);
}
.depts__content p {
  margin-top: 14px;
  color: var(--text-muted);
  line-height: 1.7;
}
.depts__content ul {
  margin: 22px 0 30px;
  display: grid;
  gap: 12px;
}
.depts__content li {
  position: relative;
  padding-left: 30px;
  font-weight: 600;
  color: var(--navy-800);
}
.depts__content li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: -1px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.7rem;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--blue-400));
}

.depts__visual {
  position: relative;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 40%, rgba(110, 167, 224, 0.18), transparent 70%),
    linear-gradient(160deg, #eaf3fc, #d7e9f8);
  color: var(--blue-500);
}
.depts__visual-icon {
  position: relative;
  z-index: 2;
  opacity: 0.85;
}
.depts__pulse {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 2px solid rgba(63, 123, 196, 0.3);
  animation: pulseRing 2.6s ease-out infinite;
}
@keyframes pulseRing {
  0% {
    transform: scale(0.7);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 1040px) {
  .depts__panel {
    grid-template-columns: 240px 1fr;
  }
  .depts__visual {
    display: none;
  }
}
@media (max-width: 760px) {
  .depts__panel {
    grid-template-columns: 1fr;
  }
  .depts__tabs {
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid rgba(36, 65, 108, 0.07);
  }
  .dtab {
    flex: none;
    white-space: nowrap;
  }
  .dtab__icon {
    display: none;
  }
  .depts__content {
    padding: 30px 24px;
  }
}
</style>
