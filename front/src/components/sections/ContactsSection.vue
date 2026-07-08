<script setup>
import { reactive, ref, computed } from 'vue'
import BrandLogo from '../BrandLogo.vue'
import { t } from '../../i18n'

const form = reactive({ name: '', phone: '', message: '' })
const sent = ref(false)

function submit() {
  // 1-й этап — всё на фронте: показываем подтверждение.
  // Позже сюда подключается реальный backend / телеграм-бот.
  sent.value = true
  setTimeout(() => {
    sent.value = false
    form.name = ''
    form.phone = ''
    form.message = ''
  }, 4000)
}

const contacts = computed(() => [
  {
    icon: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z',
    label: t('contacts.addrLabel'),
    value: t('contacts.addrValue'),
  },
  {
    icon: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2Z',
    label: t('contacts.phoneLabel'),
    value: '+998 (90) 000-00-00',
    href: 'tel:+998900000000',
  },
  {
    icon: 'M12 8v5l3 2 .9-1.5-2.4-1.4V8H12Zm0-6a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z',
    label: t('contacts.hoursLabel'),
    value: t('contacts.hoursValue'),
  },
  {
    icon: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z',
    label: t('contacts.siteLabel'),
    value: 'www.humomedline.uz',
    href: 'https://www.humomedline.uz',
  },
])

const messengers = computed(() => [
  { label: t('contacts.msgTelegram'), href: 'https://t.me/', cls: 'tg' },
  { label: t('contacts.msgWhatsapp'), href: 'https://wa.me/998900000000', cls: 'wa' },
  { label: t('contacts.msgCall'), href: 'tel:+998900000000', cls: 'call' },
])
</script>

<template>
  <section id="contacts" class="section contacts">
    <div class="container contacts__grid">
      <div class="contacts__info">
        <p class="eyebrow" v-reveal>{{ t('contacts.eyebrow') }}</p>
        <h2 class="section-title" v-reveal>{{ t('contacts.title') }}</h2>
        <p class="section-lead" v-reveal>
          {{ t('contacts.lead') }}
        </p>

        <ul class="contacts__list" v-reveal>
          <li v-for="c in contacts" :key="c.label">
            <span class="contacts__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22"><path :d="c.icon" /></svg>
            </span>
            <div>
              <small>{{ c.label }}</small>
              <a v-if="c.href" :href="c.href" target="_blank" rel="noopener">{{ c.value }}</a>
              <p v-else>{{ c.value }}</p>
            </div>
          </li>
        </ul>

        <div class="contacts__messengers" v-reveal>
          <a
            v-for="m in messengers"
            :key="m.label"
            :href="m.href"
            target="_blank"
            rel="noopener"
            class="msg"
            :class="m.cls"
          >
            {{ m.label }}
          </a>
        </div>

        <div class="contacts__map" v-reveal :aria-label="t('contacts.mapPin')">
          <div class="contacts__map-pin">{{ t('contacts.mapPin') }}</div>
          <span class="contacts__map-hint">{{ t('contacts.mapHint') }}</span>
        </div>
      </div>

      <form class="contacts__form" @submit.prevent="submit" v-reveal>
        <h3>{{ t('contacts.formTitle') }}</h3>
        <label>
          <span>{{ t('contacts.nameLabel') }}</span>
          <input v-model="form.name" type="text" required :placeholder="t('contacts.namePh')" />
        </label>
        <label>
          <span>{{ t('contacts.phoneLabel') }}</span>
          <input v-model="form.phone" type="tel" required :placeholder="t('contacts.phonePh')" />
        </label>
        <label>
          <span>{{ t('contacts.msgLabel') }}</span>
          <textarea v-model="form.message" rows="3" :placeholder="t('contacts.msgPh')"></textarea>
        </label>
        <button class="btn btn-primary form__btn" type="submit">
          {{ sent ? t('contacts.sent') : t('contacts.submit') }}
        </button>
        <p class="form__hint">{{ t('contacts.hint') }}</p>
      </form>
    </div>

    <footer class="footer">
      <div class="container footer__inner">
        <BrandLogo />
        <p class="footer__copy">
          © {{ new Date().getFullYear() }} Humo Medline · {{ t('contacts.footerCopy') }}
        </p>
        <nav class="footer__nav">
          <a href="#about">{{ t('contacts.footerAbout') }}</a>
          <a href="#doctors">{{ t('contacts.footerDoctors') }}</a>
          <a href="#services">{{ t('contacts.footerServices') }}</a>
          <a href="#contacts">{{ t('contacts.footerContacts') }}</a>
        </nav>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.contacts {
  padding-bottom: 0;
  background:
    radial-gradient(70% 60% at 100% 0%, rgba(110, 167, 224, 0.14), transparent 60%),
    var(--bg);
}

.contacts__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: start;
}

.section-title {
  margin-top: 16px;
}
.section-lead {
  margin-top: 18px;
}

.contacts__list {
  margin-top: 34px;
  display: grid;
  gap: 16px;
}
.contacts__list li {
  display: flex;
  gap: 16px;
  align-items: center;
}
.contacts__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: #fff;
  color: var(--blue-500);
  box-shadow: var(--shadow-sm);
}
.contacts__list small {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.contacts__list a,
.contacts__list p {
  font-weight: 700;
  color: var(--navy-900);
}
.contacts__list a:hover {
  color: var(--blue-400);
}

.contacts__messengers {
  margin-top: 26px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.msg {
  padding: 11px 22px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.92rem;
  color: #fff;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.msg:hover {
  transform: translateY(-3px);
}
.msg.tg {
  background: linear-gradient(135deg, #2aabee, #229ed9);
  box-shadow: 0 10px 24px rgba(34, 158, 217, 0.35);
}
.msg.wa {
  background: linear-gradient(135deg, #25d366, #1da851);
  box-shadow: 0 10px 24px rgba(37, 211, 102, 0.32);
}
.msg.call {
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  box-shadow: 0 10px 24px rgba(36, 65, 108, 0.32);
}

.contacts__map {
  margin-top: 22px;
  position: relative;
  height: 180px;
  border-radius: var(--radius);
  overflow: hidden;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
  background:
    radial-gradient(60% 80% at 30% 20%, rgba(94, 234, 212, 0.25), transparent 60%),
    linear-gradient(160deg, #dcebfb, #c2dcf2);
  border: 1px solid rgba(36, 65, 108, 0.1);
}
.contacts__map::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(36, 65, 108, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(36, 65, 108, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
}
.contacts__map-pin {
  position: relative;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--navy-900);
  animation: floatY 4s ease-in-out infinite;
}
@keyframes floatY {
  50% {
    transform: translateY(-6px);
  }
}
.contacts__map-hint {
  position: relative;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.contacts__form {
  padding: 34px;
  border-radius: var(--radius-lg);
  background: #fff;
  box-shadow: var(--shadow);
  border: 1px solid rgba(36, 65, 108, 0.06);
}
.contacts__form h3 {
  font-size: 1.3rem;
  color: var(--navy-900);
}
.contacts__form label {
  display: block;
  margin-top: 18px;
}
.contacts__form span {
  display: block;
  margin-bottom: 7px;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text-muted);
}
.contacts__form input,
.contacts__form textarea {
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border: 1.5px solid rgba(36, 65, 108, 0.14);
  background: var(--bg);
  font-family: inherit;
  font-size: 1rem;
  color: var(--text);
  transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
  resize: vertical;
}
.contacts__form input:focus,
.contacts__form textarea:focus {
  outline: none;
  border-color: var(--blue-400);
  box-shadow: 0 0 0 4px rgba(63, 123, 196, 0.14);
}
.form__btn {
  width: 100%;
  margin-top: 24px;
}
.form__hint {
  margin-top: 12px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.footer {
  margin-top: clamp(64px, 9vw, 110px);
  background: var(--navy-900);
  color: var(--text-on-dark);
}
.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding-block: 28px;
}
.footer__copy {
  font-size: 0.9rem;
  color: var(--text-on-dark-muted);
}
.footer__nav {
  display: flex;
  gap: 22px;
}
.footer__nav a {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-on-dark-muted);
  transition: color 0.3s var(--ease);
}
.footer__nav a:hover {
  color: #fff;
}

@media (max-width: 920px) {
  .contacts__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
@media (max-width: 620px) {
  .footer__inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
