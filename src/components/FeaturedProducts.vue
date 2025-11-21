<template>
  <section class="featured-products" :id="sectionId">
    <div class="container">
      <h2 class="section-title">精选绣品</h2>
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

      <div v-if="products.length" class="products-grid">
        <article v-for="product in products" :key="product.id" class="product-card" :data-category="product.category">
          <div v-if="product.badge" class="product-badge" :class="product.badge.variant">
            {{ product.badge.label }}
          </div>
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

      <div class="view-more">
        <el-button class="btn btn-primary btn-pill" round type="primary" @click="handleViewMore">
          查看更多作品
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

import { useCatalogStore } from '@/stores/catalog'
import type { CategoryId } from '@/stores/catalog'

const props = defineProps<{
  sectionId?: string
}>()

const sectionId = props.sectionId ?? 'types'

const catalogStore = useCatalogStore()

const categories = computed(() => catalogStore.categories)
const products = computed(() => catalogStore.filteredProducts)
const activeCategory = computed(() => catalogStore.activeCategory)
const searchKeyword = computed(() => catalogStore.searchQuery)

const selectCategory = (category: CategoryId) => {
  catalogStore.setCategory(category)
}

const clearSearch = () => {
  catalogStore.clearSearch()
}

const handleViewMore = () => {
  ElMessage.info('敬请期待更多限量绣品发布')
}

const formatPrice = (value: number) => {
  return `¥${value.toLocaleString()}`
}
</script>

