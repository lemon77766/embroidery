<template>
  <main>
    <HeroSection section-id="home" />
    <CulturalMeaning section-id="culture" />
    <FeaturedProducts section-id="types" :max-count="6" />
  </main>
</template>

<script setup lang="ts">
import CulturalMeaning from '@/components/CulturalMeaning.vue'
import FeaturedProducts from '@/components/FeaturedProducts.vue'
import HeroSection from '@/components/HeroSection.vue'
</script>

