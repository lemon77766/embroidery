<template>
  <div class="app-shell">
    <AppHeader />
    <RouterView />
    <AppFooter v-if="isHomePage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

