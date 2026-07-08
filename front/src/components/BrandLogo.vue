<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  light: { type: Boolean, default: false },
})

// Если положить логотип в public/images/logo.png (или .svg) — он используется.
// Иначе показывается встроенная SVG-копия фирменного знака.
const logoSrc = ref('')
function tryLoad(src) {
  return new Promise((res) => {
    const img = new Image()
    img.onload = () => res(true)
    img.onerror = () => res(false)
    img.src = src
  })
}
onMounted(async () => {
  for (const src of ['/images/logo.svg', '/images/logo.png', '/images/logo.webp']) {
    if (await tryLoad(src)) {
      logoSrc.value = src
      break
    }
  }
})
</script>

<template>
  <RouterLink to="/" class="brand" :class="{ 'is-light': light }" aria-label="Humo Medline">
    <!-- Реальный файл логотипа, если он есть -->
    <img v-if="logoSrc" :src="logoSrc" class="brand__img" alt="Humo Medline" />

    <!-- Иначе — встроенная SVG-копия знака + текст -->
    <template v-else>
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 56 52" width="46" height="42">
          <!-- веер изогнутых линий, сходящихся в одной точке слева (взмах/скорость) -->
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="3.2"
            stroke-linecap="round"
            class="brand__bird"
          >
            <path d="M6 44 C 20 40, 34 32, 44 16" />
            <path d="M6 44 C 18 36, 30 26, 38 12" />
            <path d="M6 44 C 16 33, 24 22, 30 11" />
            <path d="M6 44 C 14 31, 19 21, 23 12" />
          </g>
          <!-- короткий «хвост» снизу для формы R-свуша -->
          <path
            d="M6 44 L 22 44"
            fill="none"
            stroke="currentColor"
            stroke-width="3.2"
            stroke-linecap="round"
            class="brand__bird-tail"
          />
          <!-- красный медицинский плюс -->
          <g class="brand__plus">
            <circle cx="46" cy="12" r="8" fill="#e23b3b" />
            <path
              d="M46 7.6v8.8M41.6 12h8.8"
              stroke="#fff"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </g>
        </svg>
      </span>
      <span class="brand__text">
        HUMO <span class="brand__sub">MEDLINE</span>
      </span>
    </template>
  </RouterLink>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

/* реальный логотип-файл */
.brand__img {
  height: 46px;
  width: auto;
  display: block;
  transition: transform 0.4s var(--ease);
}
.brand:hover .brand__img {
  transform: scale(1.04);
}

/* встроенный знак — без рамки, линии прямо на фоне (как в оригинале) */
.brand__mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 44px;
  color: var(--navy-800); /* линии птицы — фирменный синий */
  transition: transform 0.45s var(--ease-spring);
}
.brand:hover .brand__mark {
  transform: scale(1.07);
}
.brand__bird path {
  opacity: 0;
  animation: birdIn 0.6s var(--ease) forwards;
}
.brand__bird path:nth-child(1) { animation-delay: 0.05s; }
.brand__bird path:nth-child(2) { animation-delay: 0.13s; }
.brand__bird path:nth-child(3) { animation-delay: 0.21s; }
.brand__bird path:nth-child(4) { animation-delay: 0.29s; }
.brand__bird-tail {
  opacity: 0;
  animation: birdIn 0.6s var(--ease) 0.36s forwards;
}
@keyframes birdIn {
  from { opacity: 0; transform: translateX(-3px); }
  to { opacity: 1; transform: none; }
}
.brand__plus {
  transform-origin: 46px 12px;
  animation: plusPop 0.5s var(--ease-spring) 0.34s both;
}
@keyframes plusPop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.brand__text {
  font-family: var(--font-display);
  font-size: 1.22rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--navy-900);
  white-space: nowrap;
  line-height: 1;
  display: flex;
  flex-direction: column;
}
.brand__sub {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.42em;
  opacity: 0.7;
  margin-top: 2px;
}
</style>
