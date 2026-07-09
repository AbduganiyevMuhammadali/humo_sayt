<script setup>
import HeroSection from '../components/sections/HeroSection.vue'
import QuickInfo from '../components/sections/QuickInfo.vue'
import HighlightsSlider from '../components/sections/HighlightsSlider.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
import DepartmentsSection from '../components/sections/DepartmentsSection.vue'
import ProcessSection from '../components/sections/ProcessSection.vue'
import DoctorsSection from '../components/sections/DoctorsSection.vue'
import MoreSection from '../components/sections/MoreSection.vue'
import TestimonialsSection from '../components/sections/TestimonialsSection.vue'
import BlogSection from '../components/sections/BlogSection.vue'
import FaqSection from '../components/sections/FaqSection.vue'
import ContactsSection from '../components/sections/ContactsSection.vue'
</script>

<template>
  <main>
    <HeroSection />
    <QuickInfo />
    <HighlightsSlider />
    <AboutSection />
    <ServicesSection />
    <DepartmentsSection />
    <ProcessSection />
    <DoctorsSection />
    <MoreSection />
    <TestimonialsSection />
    <BlogSection />
    <FaqSection />
    <ContactsSection />
  </main>
</template>

<style scoped>
main {
  position: relative;
}
</style>
