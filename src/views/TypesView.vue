<template>
  <main>
    <EmbroideryTypes />
    <FeaturedProducts section-id="products" :max-count="6" />
  </main>
</template>

<script setup lang="ts">
import EmbroideryTypes from '@/components/EmbroideryTypes.vue'
import FeaturedProducts from '@/components/FeaturedProducts.vue'
</script>
