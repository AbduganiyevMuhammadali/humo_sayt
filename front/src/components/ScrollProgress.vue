<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)
function onScroll() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  progress.value = max > 0 ? (h.scrollTop / max) * 100 : 0
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="progress" aria-hidden="true">
    <span class="progress__bar" :style="{ width: progress + '%' }"></span>
  </div>
</template>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 200;
  background: transparent;
  pointer-events: none;
}
.progress__bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent-2), var(--accent), var(--blue-400));
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
  border-radius: 0 3px 3px 0;
  transition: width 0.1s linear;
}
</style>
