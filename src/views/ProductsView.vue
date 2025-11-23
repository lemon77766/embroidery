<template>
  <main>
    <FeaturedProducts
      section-id="products-page"
      :hide-title="true"
      :hide-view-more="true"
      :reorder-last-rows-first="true"
    />
  </main>
</template>

<script setup lang="ts">
import FeaturedProducts from '@/components/FeaturedProducts.vue'
</script>
