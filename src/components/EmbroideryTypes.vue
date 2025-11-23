<template>
  <section class="embroidery-types">
    <div class="container">
      <h2 class="section-title">中国四大名绣</h2>
      <p class="section-intro">
        中国刺绣经过长期的发展，形成了各具特色的地域流派。其中苏绣、湘绣、粤绣、蜀绣称为"中国四大名绣"，代表了中国刺绣艺术的最高水平。
      </p>

      <!-- 四大名绣卡片 -->
      <div class="types-grid">
        <div 
          v-for="type in embroideryTypes" 
          :key="type.id"
          class="type-card"
        >
          <div class="type-image-wrapper">
            <img :src="type.image" :alt="type.name" class="type-image" />
            <div class="type-overlay">
              <h3 class="type-name">{{ type.name }}</h3>
            </div>
          </div>
          <div class="type-content">
            <p class="type-description">{{ type.description }}</p>
            <button class="type-link" type="button" @click="goToProducts(type.category)">
              了解更多 →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import type { CategoryId } from '@/stores/catalog'

interface EmbroideryType {
  id: number
  name: string
  description: string
  image: string
  category: CategoryId
}

const router = useRouter()
const catalogStore = useCatalogStore()

const goToProducts = (category: CategoryId) => {
  catalogStore.setCategory(category)
  router.push({ name: 'products' })
}

const embroideryTypes: EmbroideryType[] = [
  {
    id: 1,
    name: '苏绣',
    description: '以精细、雅洁著称，针法丰富、色彩鲜艳，擅长以针代笔，"巧夺天工"之美誉，是中国刺绣艺术的杰出代表。',
    image: '/images/zhonglei/1.jpg',
    category: 'su'
  },
  {
    id: 2,
    name: '湘绣',
    description: '以狮、虎等主题闻名，形态生动细腻、色彩鲜明，有"绣花能生香，绣鸟能闻声，绣虎能奔跑"的美誉。',
    image: '/images/zhonglei/2.jpg',
    category: 'xiang'
  },
  {
    id: 4,
    name: '蜀绣',
    description: '以软缎和彩丝为主要原料，针法严谨、片线光亮，色彩鲜明和谐，擅长于花鸟、走兽、山水等题材，具有浓郁的蜀地风情。',
    image: '/images/zhonglei/4.jpg',
    category: 'shu'
  },
  {
    id: 3,
    name: '粤绣',
    description: '以构图饱满、繁而不乱著称，色彩鲜艳明亮、富丽堂皇，常用金银线刺绣花鸟，显得金碧辉煌，具有浓郁的岭南特色。',
    image: '/images/zhonglei/3.jpg',
    category: 'modern'
  }
]
</script>

<style scoped lang="scss">
.embroidery-types {
  padding: 60px 0 60px;
  background: linear-gradient(to bottom, #fffef9, #fef9f0);
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 60px;
}

.type-card {
  background: linear-gradient(to bottom, var(--bg-surface), rgba(250, 245, 235, 0.5));
  border: 2px solid rgba(212, 165, 116, 0.15);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 32px rgba(212, 165, 116, 0.25);
    border-color: rgba(212, 165, 116, 0.3);
  }
}

.type-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.type-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .type-card:hover & {
    transform: scale(1.1);
  }
}

.type-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 30px 20px 20px;
}

.type-name {
  font-size: 28px;
  color: #fff;
  font-weight: 700;
  font-family: var(--font-family-serif);
  letter-spacing: 3px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.type-content {
  padding: 25px;
}

.type-description {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 20px;
  text-align: justify;
}

.type-link {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    color: var(--dark-gold);
    transform: translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .types-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .types-grid {
    grid-template-columns: 1fr;
  }

  .type-image-wrapper {
    height: 240px;
  }
}
</style>
