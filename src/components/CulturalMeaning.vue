<template>
  <section class="cultural-meaning" :id="sectionId">
    <div class="container">
      <div class="cultural-grid">
        <div class="cultural-text">
          <p class="eyebrow">千年传承 · 东方美学</p>
          <h2 class="cultural-heading">
            刺绣的 <span>文化意义</span>
          </h2>
          <p class="lead">
            刺绣是传统文化与生活美学的结合。它记录历史、寄托祝福、连接情感，是了解中华文明的重要窗口。
          </p>
          <p>
            苏绣、湘绣、蜀绣、粤绣等流派以不同审美回应时代。无论是宫廷御绣还是民间嫁衣，都映射出人们对美好生活的向往。
          </p>

          <div class="stat-list">
            <div class="stat-item" v-for="item in stats" :key="item.title">
              <div class="stat-icon">
                <span>{{ item.icon }}</span>
              </div>
              <div>
                <p class="stat-title">{{ item.title }}</p>
                <p class="stat-desc">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cultural-gallery">
          <div class="gallery-main">
            <img src="/images/微信图片_20251118111130_106_160.jpg" alt="刺绣花卉" />
          </div>
          <div class="gallery-secondary">
            <img src="/images/微信图片_20251118111131_107_160.jpg" alt="山水刺绣" />
          </div>
        </div>
      </div>

      <div class="meaning-cards">
        <article class="meaning-card" v-for="card in cards" :key="card.title">
          <div class="card-icon" :class="card.iconClass"></div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  sectionId?: string
}>()

const sectionId = props.sectionId ?? 'culture'

const stats = [
  { icon: '↺', title: '3000+ 年历史', description: '起源于商周时期' },
  { icon: '✦', title: '世界非遗', description: '2006 年入选非遗名录' }
]

const cards = [
  {
    iconClass: 'brush',
    title: '艺术表达',
    description: '色丝和针法的交织表达情感，呈现东方美学的层次与情致。'
  },
  {
    iconClass: 'book',
    title: '文化传承',
    description: '族谱、嫁衣、吉祥寓意通过刺绣传递，成为文化记忆的延续。'
  },
  {
    iconClass: 'craft',
    title: '匠心精神',
    description: '绣娘常以十年磨一剑的韧性打磨技艺，体现匠心精神。'
  }
]
</script>

