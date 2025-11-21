<template>
  <section class="hero" :id="sectionId">
    <div class="hero-background" aria-hidden="true">
      <img src="/images/home.jpg" alt="经典刺绣画面" />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  sectionId?: string
}>()

const sectionId = props.sectionId ?? 'home'
</script>

