<template>
  <section class="featured-products" :id="sectionId">
    <div class="container">
      <h2 v-if="!props.hideTitle" class="section-title">精选绣品</h2>
      <p class="section-intro">
        我们精选非遗传承人匠心制作的绣品，涵盖苏绣、湘绣、蜀绣等多个流派，带你感受中国刺绣的极致之美。
      </p>

      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          class="tab-btn btn btn-primary btn-plain btn-pill"
          :class="{ active: category.id === activeCategory }"
          type="button"
          @click="selectCategory(category.id)"
        >
          {{ category.label }}
        </button>
      </div>

      <p v-if="searchKeyword" class="search-hint">
        当前搜索：<strong>{{ searchKeyword }}</strong>
        <button class="link-button" type="button" @click="clearSearch">清除</button>
      </p>

      <div v-if="displayedProducts.length" class="products-grid">
        <article v-for="product in displayedProducts" :key="product.id" class="product-card" :data-category="product.category">
          <div v-if="product.badge" class="product-badge" :class="product.badge.variant">
            {{ product.badge.label }}
          </div>
          <button 
            class="favorite-btn"
            :class="{ favorited: favoriteStatus[product.id] }"
            @click="handleToggleFavorite(product.id)"
            :title="favoriteStatus[product.id] ? '取消收藏' : '收藏'"
          >
            <span class="favorite-icon">藏</span>
          </button>
          <img :src="product.image" :alt="product.title" class="product-image" />
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-category">{{ product.categoryLabel }}</p>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-text">{{ product.rating.toFixed(1) }} ({{ product.reviews }})</span>
            </div>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
          </div>
        </article>
      </div>

      <el-empty v-else description="暂无符合条件的作品" />

      <div v-if="!props.hideViewMore" class="view-more">
        <el-button class="btn btn-primary btn-pill" round type="primary" @click="handleViewMore">
          查看更多作品
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useCatalogStore } from '@/stores/catalog'
import type { CategoryId } from '@/stores/catalog'
import { toggleFavorite, isFavorited } from '@/services/favorites'
import { getCurrentUser } from '@/services/auth'

const props = defineProps<{
  sectionId?: string
  maxCount?: number
  hideTitle?: boolean
  hideViewMore?: boolean
  reorderLastRowsFirst?: boolean
}>()

const router = useRouter()

const sectionId = props.sectionId ?? 'types'
const maxCount = props.maxCount

const catalogStore = useCatalogStore()

const categories = computed(() => catalogStore.categories)
const products = computed(() => {
  // 有 maxCount（首页/刺绣种类页）：在前 maxCount 幅里做分类和搜索筛选
  if (!maxCount || maxCount <= 0) {
    return catalogStore.filteredProducts
  }

  const base = catalogStore.allProducts.slice(0, maxCount)
  const activeCategory = catalogStore.activeCategory
  const query = catalogStore.searchQuery.trim()

  return base.filter((product) => {
    const matchCategory = activeCategory === 'all' || product.category === activeCategory
    const matchSearch =
      !query ||
      product.title.includes(query) ||
      product.categoryLabel.includes(query)

    return matchCategory && matchSearch
  })
})
const displayedProducts = computed(() => {
  const base = products.value

  if (!props.reorderLastRowsFirst) return base

  const perRow = 3
  if (base.length <= perRow * 3) return base

  const rows: typeof base[] = []
  for (let i = 0; i < base.length; i += perRow) {
    rows.push(base.slice(i, i + perRow))
  }

  if (rows.length <= 3) return base

  const lastThree = rows.slice(-3)
  const rest = rows.slice(0, rows.length - 3)
  return [...lastThree, ...rest].flat()
})
const activeCategory = computed(() => catalogStore.activeCategory)
const searchKeyword = computed(() => catalogStore.searchQuery)

// 收藏状态映射表 { productId: boolean }
const favoriteStatus = ref<Record<string, boolean>>({})

const selectCategory = (category: CategoryId) => {
  catalogStore.setCategory(category)
}

const clearSearch = () => {
  catalogStore.clearSearch()
}

const handleViewMore = () => {
  router.push({ name: 'products' })
}

const formatPrice = (value: number) => {
  return `¥${value.toLocaleString()}`
}

// 加载收藏状态
const loadFavoriteStatus = async () => {
  const user = await getCurrentUser()
  if (!user) {
    // 未登录时清空收藏状态
    favoriteStatus.value = {}
    return
  }

  // 遍历当前展示的产品，检查收藏状态
  for (const product of displayedProducts.value) {
    favoriteStatus.value[product.id] = await isFavorited(product.id)
  }
}

// 切换收藏状态
const handleToggleFavorite = async (productId: string) => {
  const user = await getCurrentUser()
  if (!user) {
    ElMessage.warning('请先登录')
    return
  }

  const result = await toggleFavorite(productId)
  
  if (result.success) {
    // 更新本地收藏状态
    favoriteStatus.value[productId] = !favoriteStatus.value[productId]
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

// 组件挂载时加载收藏状态
onMounted(() => {
  loadFavoriteStatus()
})

// 监听展示产品列表变化，重新加载收藏状态
watch(displayedProducts, () => {
  loadFavoriteStatus()
})
</script>

