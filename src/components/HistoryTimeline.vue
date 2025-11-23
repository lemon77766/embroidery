<template>
  <section class="history-timeline" id="history">
    <div class="container">
      <h2 class="section-title">刺绣的历史文化</h2>
      <p class="section-intro">
        千年传承，东方美学的璀璨明珠
      </p>

      <div class="timeline-container">
        <!-- 时间线项目 - 左右交替布局 -->
        <div 
          v-for="(item, index) in timelineItems" 
          :key="item.id"
          class="timeline-item"
          :class="{ 'timeline-item-reverse': index % 2 === 1 }"
        >
          <div class="timeline-content">
            <div class="timeline-text">
              <div class="timeline-badge">
                <span class="timeline-dot"></span>
              </div>
              <h3 class="timeline-title">{{ item.period }}</h3>
              <h4 class="timeline-subtitle">{{ item.title }}</h4>
              <p class="timeline-description">{{ item.description }}</p>
            </div>
            <div class="timeline-image">
              <img :src="item.image" :alt="item.title" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TimelineItem {
  id: number
  period: string
  title: string
  description: string
  image: string
}

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    period: '千年传承',
    title: '东方美学',
    description: '刺绣起源于中国，距今已有数千年历史。早在商周时期，刺绣就已经出现在贵族的服饰上。刺绣不仅是一种装饰艺术，更是中华文明的重要载体，承载着深厚的文化内涵。',
    image: '/images/lishi/1.jpg'
  },
  {
    id: 2,
    period: '刺绣发展的萌芽',
    title: '原始阶段',
    description: '刺绣发源于人们对美的追求，古人用骨针穿引皮条、筋线，在兽皮上刺缀，制作衣服。随着蚕桑业的发展，丝线刺绣逐渐兴起，刺绣工艺日益精湛，成为富贵人家的专属。',
    image: '/images/lishi/2.jpg'
  },
  {
    id: 3,
    period: '唐宋时期',
    title: '繁荣鼎盛',
    description: '唐代是中国刺绣艺术的鼎盛时期，刺绣不仅应用于服饰，还广泛用于宗教艺术品。宋代刺绣在技法上更加丰富，出现了双面绣等高超技艺，成为皇室贵族的珍藏。',
    image: '/images/lishi/3.jpg'
  },
  {
    id: 4,
    period: '明清辉煌',
    title: '四大名绣',
    description: '明清时期，苏绣、湘绣、粤绣、蜀绣四大名绣形成，各具特色。苏绣精细雅致，湘绣色彩艳丽，粤绣金碧辉煌，蜀绣严谨细腻。刺绣技艺达到了登峰造极的境界。',
    image: '/images/lishi/4.jpg'
  },
  {
    id: 5,
    period: '近现代传承',
    title: '创新发展',
    description: '进入近现代，刺绣艺术在传承中不断创新。艺术家们将西方绘画技法融入刺绣，创造出更加逼真细腻的作品。刺绣从宫廷走向民间，成为人们喜爱的艺术形式。',
    image: '/images/lishi/5.jpg'
  },
  {
    id: 6,
    period: '当代',
    title: '非遗保护',
    description: '当代刺绣被列入国家级非物质文化遗产名录，受到国家的高度重视和保护。现代刺绣艺术家在继承传统技艺的同时，不断探索创新，让这门古老的艺术焕发新的生机，走向世界舞台。',
    image: '/images/lishi/6.jpg'
  }
]
</script>

<style scoped lang="scss">
.history-timeline {
  padding: 60px 0;
  background: linear-gradient(to bottom, #fef9f0, #fffef9);
  position: relative;
  overflow: hidden;
}

.timeline-container {
  max-width: 1000px;
  margin: 60px auto 0;
  position: relative;

  /* 中央时间线 */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, 
      rgba(212, 165, 116, 0.3),
      rgba(212, 165, 116, 0.6),
      rgba(212, 165, 116, 0.3)
    );
    transform: translateX(-50%);
  }
}

.timeline-item {
  margin-bottom: 80px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.timeline-item-reverse .timeline-content {
  grid-template-columns: 1fr 1fr;
  
  .timeline-text {
    order: 2;
    text-align: left;
    padding-left: 60px;
    padding-right: 0;
  }
  
  .timeline-image {
    order: 1;
  }

  .timeline-badge {
    left: auto;
    right: -90px;
  }
}

.timeline-text {
  position: relative;
  padding-right: 60px;
  text-align: right;
}

.timeline-badge {
  position: absolute;
  right: -90px;
  top: 20px;
  width: 20px;
  height: 20px;
  background: var(--pattern-gold);
  border-radius: 50%;
  box-shadow: 0 0 0 6px rgba(212, 165, 116, 0.2);
  z-index: 10;

  .timeline-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
  }
}

.timeline-title {
  font-size: 16px;
  color: var(--secondary-color);
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 2px;
}

.timeline-subtitle {
  font-size: 28px;
  background: var(--pattern-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  font-weight: 700;
  font-family: var(--font-family-serif);
}

.timeline-description {
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-secondary);
  text-align: justify;
}

.timeline-image {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(212, 165, 116, 0.2);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 50px rgba(212, 165, 116, 0.3);
  }

  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid rgba(212, 165, 116, 0.3);
    border-radius: 20px;
    pointer-events: none;
  }
}

/* 响应式设计 */
@media (max-width: 968px) {
  .timeline-container::before {
    left: 30px;
  }

  .timeline-content,
  .timeline-item-reverse .timeline-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .timeline-text,
  .timeline-item-reverse .timeline-text {
    text-align: left;
    padding-left: 60px;
    padding-right: 0;
    order: 1;
  }

  .timeline-image,
  .timeline-item-reverse .timeline-image {
    order: 2;
  }

  .timeline-badge,
  .timeline-item-reverse .timeline-badge {
    left: -40px;
    right: auto;
  }

  .timeline-image img {
    height: 250px;
  }
}

@media (max-width: 640px) {
  .timeline-image img {
    height: 200px;
  }

  .timeline-subtitle {
    font-size: 24px;
  }
}
</style>
