<template>
  <header class="header" :class="{ 'header--elevated': isElevated }">
    <nav class="navbar">
      <div class="nav-container">
        <div v-if="isProductsPage" class="products-page-header">
          <button class="products-back-btn" type="button" @click="goHome" aria-label="返回主页">
            <span class="products-back-icon">←</span>
          </button>
          <div class="products-page-title logo-text">绣见江山-绣品展示</div>
        </div>
        <template v-else>
          <div class="logo">
            <router-link to="/" class="logo-link">
              <span class="logo-text">绣见江山</span>
            </router-link>
          </div>
          <ul class="nav-menu">
            <li v-for="item in navItems" :key="item.target">
              <router-link
                v-if="item.isRoute"
                :to="item.target"
                class="nav-link"
                :class="{ active: isActiveRoute(item.target) }"
              >
                {{ item.label }}
              </router-link>
              <button
                v-else
                class="nav-link"
                :class="{ active: item.target === activeSection }"
                type="button"
                @click="handleNavClick(item.target)"
              >
                {{ item.label }}
              </button>
            </li>
          </ul>
          <div class="search-box">
            <input
              v-model="searchTerm"
              type="text"
              class="search-input"
              placeholder="请输入绣品名，例如星河锦绣"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" type="button" @click="handleSearch" aria-label="搜索">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCatalogStore } from '@/stores/catalog'

interface NavItem {
  label: string
  target: string
  isRoute?: boolean
}

const navItems: NavItem[] = [
  { label: '首页', target: '/', isRoute: true },
  { label: '历史文化', target: '/history', isRoute: true },
  { label: '刺绣种类', target: '/types', isRoute: true },
  { label: '我的', target: '/profile', isRoute: true }
]

const route = useRoute()
const router = useRouter()
const isProductsPage = computed(() => route.name === 'products')
const catalogStore = useCatalogStore()
const searchTerm = ref(catalogStore.searchQuery)
const isElevated = ref(false)
const activeSection = ref('')

const isActiveRoute = (path: string) => {
  return route.path === path
}

const goHome = () => {
  router.push('/')
}

const handleSearch = () => {
  const query = searchTerm.value.trim()
  if (!query) {
    ElMessage.warning('请输入绣品名，例如星河锦绣')
    return
  }

  catalogStore.setSearchQuery(query)
  router.push({ name: 'products' })
  ElMessage.success(`正在搜索：${query}`)
}

const handleNavClick = (target: string) => {
  const el = document.getElementById(target)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = target
  }
}

const updateElevation = () => {
  isElevated.value = window.scrollY > 100
}

const updateActiveSection = () => {
  // 只在首页才更新锚点激活状态
  if (route.path !== '/') {
    activeSection.value = ''
    return
  }

  const sections = navItems
    .filter((item) => !item.isRoute)
    .map((item) => document.getElementById(item.target))
    .filter(Boolean) as HTMLElement[]
  
  if (sections.length === 0) {
    activeSection.value = ''
    return
  }

  const offset = window.scrollY + 120
  let foundSection = false
  
  for (const section of sections) {
    if (offset >= section.offsetTop && offset < section.offsetTop + section.offsetHeight) {
      activeSection.value = section.id
      foundSection = true
      break
    }
  }
  
  if (!foundSection) {
    activeSection.value = ''
  }
}

const handleScroll = () => {
  updateElevation()
  updateActiveSection()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(
  () => catalogStore.searchQuery,
  (value) => {
    searchTerm.value = value
  }
)
</script>

