<script setup>
import { ref, onMounted } from 'vue'
import { t } from '../../i18n'
import { fetchDoctors } from '../../lib/doctorsService'

// Shifokorlar Supabase'dan olinadi (admin paneldan boshqariladi).
// Supabase ulanmagan bo'lsa — standart ro'yxat ko'rsatiladi.
const doctors = ref([])

function initialsOf(name) {
  return (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

onMounted(async () => {
  const list = await fetchDoctors()
  doctors.value = list.map((d, i) => ({
    ...d,
    key: d.id ?? i,
    // photo_url (bazadan) yoki lokal /images/doctor-N.jpg
    photo: d.photo_url || `/images/doctor-${i + 1}.jpg`,
    initials: initialsOf(d.name),
    noPhoto: false,
  }))
})
</script>

<template>
  <section id="doctors" class="section doctors">
    <div class="container">
      <header class="doctors__head">
        <p class="eyebrow" v-reveal>{{ t('doctors.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('doctors.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('doctors.lead') }}
        </p>
      </header>

      <div class="doctors__grid">
        <article
          v-for="(d, i) in doctors"
          :key="d.key"
          class="doc"
          v-reveal
          :class="`reveal-delay-${(i % 3) + 1}`"
        >
          <div class="doc__photo" :class="{ 'has-img': !d.noPhoto }">
            <img
              v-if="!d.noPhoto"
              :src="d.photo"
              :alt="d.name"
              class="doc__img"
              @error="d.noPhoto = true"
            />
            <span v-else class="doc__avatar">{{ d.initials }}</span>
            <span class="doc__badge">{{ d.specialty }}</span>
          </div>
          <div class="doc__info">
            <h3 class="doc__spec">{{ d.specialty }}</h3>
            <p class="doc__name">{{ d.name }}</p>
            <ul class="doc__meta">
              <li v-if="d.experience">{{ d.experience }}</li>
              <li v-if="d.patients">{{ d.patients }}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.doctors {
  background:
    radial-gradient(70% 60% at 0% 100%, rgba(94, 234, 212, 0.1), transparent 60%),
    #eef4fb;
}

.doctors__head {
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

.doctors__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.doc {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(36, 65, 108, 0.06);
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}
.doc:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.doc__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  display: grid;
  place-items: center;
  background:
    radial-gradient(120% 100% at 50% 0%, rgba(110, 167, 224, 0.4), transparent 60%),
    linear-gradient(160deg, #cfe2f6, #9cc1ea);
  background-size: cover;
  background-position: center top;
  transition: transform 0.6s var(--ease);
}
.doc:hover .doc__photo {
  transform: scale(1.04);
}
.doc__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
.doc__photo.has-img::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, transparent 55%, rgba(15, 31, 58, 0.25));
}
.doc__avatar {
  width: 116px;
  height: 116px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 2.3rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  box-shadow: 0 18px 40px rgba(15, 31, 58, 0.3);
}
.doc__badge {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  background: rgba(15, 31, 58, 0.55);
  backdrop-filter: blur(6px);
}

.doc__info {
  margin: -34px 16px 0;
  position: relative;
  padding: 22px 22px 24px;
  border-radius: var(--radius);
  background: var(--navy-800);
  color: #fff;
  box-shadow: var(--shadow);
}
.doc__spec {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-2);
}
.doc__name {
  margin-top: 4px;
  font-size: 1.16rem;
  font-weight: 700;
}
.doc__meta {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.doc__meta li {
  position: relative;
  padding-left: 18px;
  font-size: 0.92rem;
  color: var(--text-on-dark-muted);
}
.doc__meta li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}

@media (max-width: 900px) {
  .doctors__grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
}
</style>
