<script setup>
import { computed } from 'vue'
import { t } from '../../i18n'

const emojis = ['❤️', '🧸', '🏊']
const posts = computed(() => t('blog.items').map((p, i) => ({ ...p, emoji: emojis[i] })))
</script>

<template>
  <section id="blog" class="section blog">
    <div class="container">
      <header class="blog__head">
        <div>
          <p class="eyebrow" v-reveal>{{ t('blog.eyebrow') }}</p>
          <h2 class="section-title" v-reveal>{{ t('blog.title') }}</h2>
        </div>
        <p class="section-lead" v-reveal>
          {{ t('blog.lead') }}
        </p>
      </header>

      <div class="blog__grid">
        <article
          v-for="(p, i) in posts"
          :key="p.title"
          class="post"
          v-reveal
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="post__cover">
            <span class="post__emoji">{{ p.emoji }}</span>
            <span class="post__tag">{{ p.tag }}</span>
          </div>
          <div class="post__body">
            <span class="post__date">{{ p.date }}</span>
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
            <span class="post__more">{{ t('blog.more') }} →</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog {
  background:
    radial-gradient(60% 50% at 100% 0%, rgba(110, 167, 224, 0.12), transparent 60%),
    #eef4fb;
}
.blog__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}
.section-title {
  margin-top: 16px;
}
.section-lead {
  max-width: 40ch;
}

.blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.post {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(36, 65, 108, 0.07);
  box-shadow: var(--shadow-sm);
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
  cursor: pointer;
}
.post:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow);
}

.post__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 30%, rgba(110, 167, 224, 0.35), transparent 70%),
    linear-gradient(160deg, #dcebfb, #bfdcf3);
}
.post__emoji {
  font-size: 3rem;
  transition: transform 0.45s var(--ease);
}
.post:hover .post__emoji {
  transform: scale(1.15) rotate(-6deg);
}
.post__tag {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
}

.post__body {
  padding: 24px 24px 26px;
}
.post__date {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--blue-500);
}
.post__body h3 {
  margin-top: 10px;
  font-size: 1.16rem;
  color: var(--navy-900);
  line-height: 1.4;
}
.post__body p {
  margin-top: 10px;
  font-size: 0.94rem;
  color: var(--text-muted);
}
.post__more {
  display: inline-block;
  margin-top: 16px;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--blue-500);
  transition: transform 0.3s var(--ease);
}
.post:hover .post__more {
  transform: translateX(4px);
}

@media (max-width: 980px) {
  .blog__grid {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
  }
}
@media (min-width: 981px) and (max-width: 1100px) {
  .blog__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
