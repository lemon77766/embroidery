<template>
  <footer class="footer" id="contact">
    <div class="container">
      <div class="footer-content">
        <div class="footer-left">
          <h3>非遗刺绣</h3>
          <p>传承千年刺绣艺术，守护非遗文化根脉，让指尖上的艺术绽放永恒魅力。</p>
          <div class="newsletter">
            <h4>订阅通讯</h4>
            <div class="newsletter-form">
              <input
                v-model="email"
                type="email"
                placeholder="请输入您的邮箱"
                class="newsletter-input"
                @keyup.enter="handleSubscribe"
              />
              <el-button
                class="btn btn-primary btn-pill"
                type="primary"
                round
                :loading="isSubmitting"
                @click="handleSubscribe"
              >
                订阅
              </el-button>
            </div>
            <p class="newsletter-tip">订阅后可第一时间获取非遗活动与新品资讯。</p>
          </div>
        </div>
        <div class="footer-right">
          <h3>千年传承，东方美学</h3>
          <div class="social-media">
            <div class="social-item">
              <div class="social-icon wechat">微信</div>
              <span>微信号: 18132394762</span>
            </div>
            <div class="social-item">
              <div class="social-icon xiaohongshu">小红书</div>
              <span>小红书号: 6772922941</span>
            </div>
          </div>
          <p class="contact-email">邮箱：heritage@embroidery.cn</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

import { submitNewsletter } from '@/services/newsletter'

const email = ref('')
const isSubmitting = ref(false)

const handleSubscribe = async () => {
  const value = email.value.trim()
  if (!value) {
    ElMessage.warning('请输入您的邮箱地址')
    return
  }

  if (!validateEmail(value)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  try {
    isSubmitting.value = true
    await submitNewsletter({ email: value })
    ElMessage.success('订阅成功！我们将定期发送最新资讯。')
    email.value = ''
  } catch (error) {
    ElMessage.error('订阅失败，请稍后再试')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const validateEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
</script>

