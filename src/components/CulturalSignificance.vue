<template>
  <section class="cultural-significance" :id="sectionId">
    <div class="container">
      <h2 class="section-title">刺绣的文化意义</h2>

      <div class="heritage-section">
        <h3 class="heritage-title">千年传承，东方美学</h3>
        <p class="heritage-text">
          中国刺绣的历史可以追溯到三千多年前。它不仅是技艺，更是文化的延续。从宫廷御用到民间传承，刺绣以独特的东方美学记录时代，展示生活之美。
        </p>

        <div class="facts-grid">
          <div class="fact-card" v-for="fact in facts" :key="fact.title">
            <div class="fact-icon">{{ fact.icon }}</div>
            <div class="fact-content">
              <h4>{{ fact.title }}</h4>
              <p>{{ fact.subtitle }}</p>
            </div>
          </div>
        </div>

        <div class="feature-cards">
          <article class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  sectionId?: string
}>()

const sectionId = props.sectionId ?? 'history'

const facts = [
  { icon: '🕐', title: '3000+年历史', subtitle: '起源于商周时期' },
  { icon: '🌍', title: '世界非遗', subtitle: '2006年入选非遗名录' }
]

const features = [
  {
    icon: '🧵',
    title: '艺术表达',
    description: '针法与色彩的细腻配合，塑造栩栩如生的东方意象，呈现独一无二的美学魅力。'
  },
  {
    icon: '📜',
    title: '文化传承',
    description: '每件绣品都蕴含特定寓意，承载着不同历史时期的故事与精神。'
  },
  {
    icon: '✋',
    title: '匠心精神',
    description: '一针一线皆需专注与耐心，凝聚匠人对传统工艺的热爱和坚持。'
  }
]
</script>

