<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import BackToTop from './components/BackToTop.vue'
import ScrollProgress from './components/ScrollProgress.vue'

const route = useRoute()
// Admin sahifasida sayt sarlavhasi/footer ko'rsatilmaydi.
const isChrome = computed(() => route.name !== 'admin')
</script>

<template>
  <ScrollProgress v-if="isChrome" />
  <SiteHeader v-if="isChrome" />
  <RouterView />
  <BackToTop v-if="isChrome" />
</template>
