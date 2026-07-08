<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const show = ref(false)
function onScroll() {
  show.value = window.scrollY > 600
}
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="pop">
    <button v-show="show" class="totop" aria-label="Наверх" @click="toTop">
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path d="M12 8l-6 6 1.4 1.4L12 10.8l4.6 4.6L18 14z" fill="currentColor" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.totop {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 90;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, var(--blue-400), var(--navy-700));
  box-shadow: 0 14px 34px rgba(36, 65, 108, 0.4);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.totop:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 44px rgba(36, 65, 108, 0.5);
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(10px);
}
</style>
