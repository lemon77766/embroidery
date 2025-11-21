<template>
  <main class="profile-page">
    <!-- 未登录状态 - 显示登录/注册 -->
    <div v-if="!isLoggedIn" class="auth-section">
      <div class="container">
        <div class="auth-container">
          <div class="auth-tabs">
            <button 
              class="auth-tab" 
              :class="{ active: authMode === 'login' }"
              @click="authMode = 'login'"
            >
              登录
            </button>
            <button 
              class="auth-tab" 
              :class="{ active: authMode === 'register' }"
              @click="authMode = 'register'"
            >
              注册
            </button>
          </div>

          <!-- 登录表单 -->
          <div v-if="authMode === 'login'" class="auth-form">
            <h2 class="auth-title">欢迎回来</h2>
            <p class="auth-subtitle">登录您的账户，继续探索刺绣艺术</p>
            
            <el-form :model="loginForm" label-position="top">
              <el-form-item label="手机号 / 邮箱">
                <el-input 
                  v-model="loginForm.username" 
                  placeholder="请输入手机号或邮箱"
                  size="large"
                />
              </el-form-item>
              <el-form-item label="密码">
                <el-input 
                  v-model="loginForm.password" 
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                />
              </el-form-item>
              <div class="form-options">
                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
                <button type="button" class="forgot-password">忘记密码？</button>
              </div>
              <el-button 
                type="primary" 
                size="large" 
                class="auth-submit"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form>
          </div>

          <!-- 注册表单 -->
          <div v-else class="auth-form">
            <h2 class="auth-title">创建账户</h2>
            <p class="auth-subtitle">加入我们，开启您的刺绣艺术之旅</p>
            
            <el-form :model="registerForm" label-position="top">
              <el-form-item label="用户名">
                <el-input 
                  v-model="registerForm.username" 
                  placeholder="请输入用户名"
                  size="large"
                />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input 
                  v-model="registerForm.phone" 
                  placeholder="请输入手机号"
                  size="large"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input 
                  v-model="registerForm.email" 
                  placeholder="请输入邮箱"
                  size="large"
                />
              </el-form-item>
              <el-form-item label="密码">
                <el-input 
                  v-model="registerForm.password" 
                  type="password"
                  placeholder="请输入密码（6位以上）"
                  size="large"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input 
                  v-model="registerForm.confirmPassword" 
                  type="password"
                  placeholder="请再次输入密码"
                  size="large"
                  show-password
                />
              </el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="auth-submit"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 已登录状态 - 显示个人中心 -->
    <div v-else class="user-center">
      <div class="container">
        <!-- 用户信息卡片 -->
        <div class="user-header">
          <div class="user-avatar">
            <img :src="userInfo.avatar || '/images/default-avatar.png'" alt="用户头像" />
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ userInfo.username }}</h2>
            <p class="user-email">{{ userInfo.email }}</p>
          </div>
          <el-button class="logout-btn" @click="handleLogout">退出登录</el-button>
        </div>

        <!-- 功能导航 -->
        <div class="profile-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="profile-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="profile-content">
          <!-- 个人信息 -->
          <div v-if="activeTab === 'info'" class="content-section">
            <h3 class="section-title">个人信息</h3>
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userInfo.phone" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="userInfo.address" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleUpdateInfo">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 我的收藏 -->
          <div v-if="activeTab === 'favorites'" class="content-section">
            <h3 class="section-title">我的收藏</h3>
            <div v-if="favorites.length === 0" class="empty-state">
              <p>暂无收藏，快去发现喜欢的作品吧~</p>
            </div>
            <div v-else class="favorites-grid">
              <div v-for="item in favorites" :key="item.id" class="favorite-item">
                <img :src="item.image" :alt="item.title" />
                <div class="favorite-info">
                  <h4>{{ item.title }}</h4>
                  <p class="favorite-price">¥{{ item.price }}</p>
                </div>
                <button class="remove-favorite" @click="removeFavorite(item.id)">
                  移除收藏
                </button>
              </div>
            </div>
          </div>

          <!-- 浏览历史 -->
          <div v-if="activeTab === 'history'" class="content-section">
            <h3 class="section-title">浏览历史</h3>
            <div v-if="history.length === 0" class="empty-state">
              <p>暂无浏览记录</p>
            </div>
            <div v-else class="history-list">
              <div v-for="item in history" :key="item.id" class="history-item">
                <img :src="item.image" :alt="item.title" />
                <div class="history-info">
                  <h4>{{ item.title }}</h4>
                  <p class="history-time">{{ item.viewTime }}</p>
                </div>
                <button class="remove-history" @click="removeHistory(item.id)">
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 订单管理 -->
          <div v-if="activeTab === 'orders'" class="content-section">
            <h3 class="section-title">我的订单</h3>
            <div v-if="orders.length === 0" class="empty-state">
              <p>暂无订单记录</p>
            </div>
            <div v-else class="orders-list">
              <div v-for="order in orders" :key="order.id" class="order-item">
                <div class="order-header">
                  <span class="order-number">订单号：{{ order.orderNo }}</span>
                  <span class="order-status" :class="order.status">{{ order.statusText }}</span>
                </div>
                <div class="order-content">
                  <img :src="order.image" :alt="order.title" />
                  <div class="order-info">
                    <h4>{{ order.title }}</h4>
                    <p>数量：{{ order.quantity }}</p>
                  </div>
                  <div class="order-price">
                    <p class="price">¥{{ order.totalPrice }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 账户设置 -->
          <div v-if="activeTab === 'settings'" class="content-section">
            <h3 class="section-title">账户设置</h3>
            <div class="settings-list">
              <div class="setting-item">
                <span>修改密码</span>
                <el-button text>去修改</el-button>
              </div>
              <div class="setting-item">
                <span>绑定手机</span>
                <el-button text>{{ userInfo.phone ? '已绑定' : '去绑定' }}</el-button>
              </div>
              <div class="setting-item">
                <span>绑定邮箱</span>
                <el-button text>{{ userInfo.email ? '已绑定' : '去绑定' }}</el-button>
              </div>
              <div class="setting-item">
                <span>消息通知</span>
                <el-switch v-model="settings.notification" />
              </div>
              <div class="setting-item">
                <span>隐私设置</span>
                <el-button text>查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 认证状态
const isLoggedIn = ref(false)
const authMode = ref<'login' | 'register'>('login')

// 登录表单
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

// 注册表单
const registerForm = ref({
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 用户信息
const userInfo = ref({
  username: '刺绣爱好者',
  email: 'user@example.com',
  phone: '138****8888',
  address: '',
  avatar: ''
})

// 当前选中的标签
const activeTab = ref('info')

// 标签页配置
const tabs = [
  { id: 'info', label: '个人信息', icon: '👤' },
  { id: 'favorites', label: '我的收藏', icon: '❤️' },
  { id: 'history', label: '浏览历史', icon: '🕐' },
  { id: 'orders', label: '订单管理', icon: '📦' },
  { id: 'settings', label: '账户设置', icon: '⚙️' }
]

// 收藏列表
const favorites = ref([
  {
    id: 1,
    title: '花鸟图',
    price: 2980,
    image: '/images/jingxuan/huaniao.jpg'
  },
  {
    id: 2,
    title: '山水图',
    price: 3680,
    image: '/images/jingxuan/shanshui.jpg'
  }
])

// 浏览历史
const history = ref([
  {
    id: 1,
    title: '牡丹图',
    image: '/images/jingxuan/mudan.jpg',
    viewTime: '2024-01-15 14:30'
  },
  {
    id: 2,
    title: '人物图',
    image: '/images/jingxuan/renwu.jpg',
    viewTime: '2024-01-14 10:20'
  }
])

// 订单列表
const orders = ref([
  {
    id: 1,
    orderNo: 'XJ202401150001',
    title: '花鸟图',
    image: '/images/jingxuan/huaniao.jpg',
    quantity: 1,
    totalPrice: 2980,
    status: 'completed',
    statusText: '已完成'
  }
])

// 设置
const settings = ref({
  notification: true
})

// 登录处理
const handleLogin = () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请填写完整的登录信息')
    return
  }
  
  // 模拟登录
  setTimeout(() => {
    isLoggedIn.value = true
    ElMessage.success('登录成功！')
  }, 500)
}

// 注册处理
const handleRegister = () => {
  if (!registerForm.value.username || !registerForm.value.phone || 
      !registerForm.value.email || !registerForm.value.password) {
    ElMessage.warning('请填写完整的注册信息')
    return
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  
  if (registerForm.value.password.length < 6) {
    ElMessage.error('密码长度至少6位')
    return
  }
  
  // 模拟注册
  setTimeout(() => {
    isLoggedIn.value = true
    userInfo.value.username = registerForm.value.username
    userInfo.value.email = registerForm.value.email
    userInfo.value.phone = registerForm.value.phone
    ElMessage.success('注册成功！')
  }, 500)
}

// 退出登录
const handleLogout = () => {
  isLoggedIn.value = false
  ElMessage.success('已退出登录')
}

// 更新个人信息
const handleUpdateInfo = () => {
  ElMessage.success('信息更新成功！')
}

// 移除收藏
const removeFavorite = (id: number) => {
  favorites.value = favorites.value.filter(item => item.id !== id)
  ElMessage.success('已取消收藏')
}

// 删除历史
const removeHistory = (id: number) => {
  history.value = history.value.filter(item => item.id !== id)
  ElMessage.success('已删除')
}
</script>

<style scoped lang="scss">
.profile-page {
  min-height: calc(100vh - 80px);
  padding-top: 80px;
  background: linear-gradient(180deg, #fffef9 0%, #fef9f0 50%, #f5ede0 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: radial-gradient(ellipse at top, rgba(212, 165, 116, 0.15), transparent 70%);
    pointer-events: none;
  }
}

/* 认证部分 */
.auth-section {
  padding: 80px 0;
  position: relative;
}

.auth-container {
  max-width: 520px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  box-shadow: 
    0 20px 60px rgba(212, 165, 116, 0.2),
    0 0 0 1px rgba(212, 165, 116, 0.1) inset;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--pattern-gold);
  }
}

.auth-tabs {
  display: flex;
  background: linear-gradient(to bottom, rgba(212, 165, 116, 0.03), transparent);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(212, 165, 116, 0.2), transparent);
  }
}

.auth-tab {
  flex: 1;
  padding: 24px;
  background: none;
  border: none;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  letter-spacing: 1px;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 60%;
    height: 3px;
    background: var(--pattern-gold);
    border-radius: 3px 3px 0 0;
    transition: transform 0.4s ease;
  }

  &.active {
    color: var(--dark-gold);
    
    &::before {
      transform: translateX(-50%) scaleX(1);
    }
  }

  &:hover:not(.active) {
    color: var(--primary-color);
  }
}

.auth-form {
  padding: 50px 45px;
}

.auth-title {
  font-size: 32px;
  font-weight: 700;
  background: var(--pattern-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  text-align: center;
  font-family: var(--font-family-serif);
  letter-spacing: 2px;
}

.auth-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 40px;
  font-size: 15px;
  line-height: 1.6;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--dark-gold);
    text-decoration: underline;
  }
}

.auth-submit {
  width: 100%;
  height: 50px;
  background: var(--pattern-gold);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 3px;
  font-size: 16px;
  box-shadow: 0 8px 20px rgba(212, 165, 116, 0.3);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(212, 165, 116, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

/* 用户中心 */
.user-center {
  padding: 40px 0 100px;
  position: relative;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 35px;
  padding: 50px;
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 245, 235, 0.9)),
    url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(212,165,116,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  border-radius: 24px;
  margin-bottom: 40px;
  box-shadow: 
    0 10px 40px rgba(212, 165, 116, 0.15),
    0 0 0 1px rgba(212, 165, 116, 0.1) inset;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--pattern-gold);
  }
}

.user-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #fff;
  box-shadow: 
    0 8px 24px rgba(212, 165, 116, 0.3),
    0 0 0 2px var(--primary-color);
  background: linear-gradient(135deg, #f5deb3, #d4a574);
  transition: all 0.4s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 12px 32px rgba(212, 165, 116, 0.4),
      0 0 0 2px var(--dark-gold);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  background: var(--pattern-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  font-family: var(--font-family-serif);
  letter-spacing: 1px;
}

.user-email {
  color: var(--text-secondary);
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn {
  height: 42px;
  padding: 0 28px;
  border: 2px solid rgba(212, 165, 116, 0.4);
  color: var(--primary-color);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(245, 222, 179, 0.2), rgba(212, 165, 116, 0.15));
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 165, 116, 0.2);
  }
}

/* 标签页 */
.profile-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 35px;
  overflow-x: auto;
  padding: 8px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 165, 116, 0.3);
    border-radius: 3px;
  }
}

.profile-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 165, 116, 0.15);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(212, 165, 116, 0.08);

  &:hover {
    border-color: rgba(212, 165, 116, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(212, 165, 116, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }

  &.active {
    background: linear-gradient(135deg, rgba(245, 222, 179, 0.4), rgba(212, 165, 116, 0.25));
    border-color: var(--primary-color);
    color: var(--dark-gold);
    font-weight: 700;
    box-shadow: 0 6px 16px rgba(212, 165, 116, 0.25);
    transform: translateY(-2px);
  }
}

.tab-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(212, 165, 116, 0.3));
}

/* 内容区域 */
.profile-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px;
  box-shadow: 
    0 10px 40px rgba(212, 165, 116, 0.12),
    0 0 0 1px rgba(212, 165, 116, 0.08) inset;
  min-height: 450px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--pattern-gold);
    border-radius: 24px 24px 0 0;
  }
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  background: var(--pattern-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 35px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(212, 165, 116, 0.15);
  font-family: var(--font-family-serif);
  letter-spacing: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 80px;
    height: 2px;
    background: var(--pattern-gold);
  }
}

/* 收藏网格 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.favorite-item {
  border: 2px solid rgba(212, 165, 116, 0.15);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.08);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(212, 165, 116, 0.25);
    border-color: var(--primary-color);
  }

  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  &:hover img {
    transform: scale(1.08);
  }
}

.favorite-info {
  padding: 20px;

  h4 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text-primary);
  }
}

.favorite-price {
  color: var(--primary-color);
  font-size: 20px;
  font-weight: 700;
  font-family: var(--font-family-serif);
}

.remove-favorite {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to bottom, rgba(212, 165, 116, 0.08), rgba(212, 165, 116, 0.12));
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background: linear-gradient(to bottom, rgba(212, 165, 116, 0.15), rgba(212, 165, 116, 0.2));
    color: var(--dark-gold);
  }
}

/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  border: 2px solid rgba(212, 165, 116, 0.12);
  border-radius: 16px;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(212, 165, 116, 0.06);

  &:hover {
    border-color: rgba(212, 165, 116, 0.4);
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(8px);
    box-shadow: 0 6px 20px rgba(212, 165, 116, 0.15);
  }

  img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid rgba(212, 165, 116, 0.2);
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.history-info {
  flex: 1;

  h4 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
}

.history-time {
  color: var(--text-secondary);
  font-size: 13px;
}

.remove-history {
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(212, 165, 116, 0.3);
  color: var(--primary-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background: linear-gradient(135deg, rgba(245, 222, 179, 0.2), rgba(212, 165, 116, 0.15));
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 165, 116, 0.2);
  }
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-item {
  border: 2px solid rgba(212, 165, 116, 0.15);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 16px rgba(212, 165, 116, 0.1);
  transition: all 0.4s ease;
  
  &:hover {
    box-shadow: 0 8px 28px rgba(212, 165, 116, 0.2);
    border-color: rgba(212, 165, 116, 0.3);
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding: 18px 24px;
  background: linear-gradient(to right, rgba(212, 165, 116, 0.08), rgba(212, 165, 116, 0.05));
  border-bottom: 1px solid rgba(212, 165, 116, 0.15);
}

.order-number {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.order-status {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
  background: rgba(212, 165, 116, 0.15);
  padding: 4px 12px;
  border-radius: 8px;
}

.order-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;

  img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid rgba(212, 165, 116, 0.2);
  }
}

.order-info {
  flex: 1;

  h4 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    font-size: 14px;
  }
}

.order-price {
  .price {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-color);
    font-family: var(--font-family-serif);
  }
}

/* 设置列表 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border: 2px solid rgba(212, 165, 116, 0.12);
  border-radius: 16px;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(212, 165, 116, 0.06);

  &:hover {
    border-color: rgba(212, 165, 116, 0.3);
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(6px);
    box-shadow: 0 6px 18px rgba(212, 165, 116, 0.12);
  }

  span {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.8;
  
  &::before {
    content: '📦';
    display: block;
    font-size: 60px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
}

/* 响应式 */
@media (max-width: 968px) {
  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-content {
    padding: 35px 25px;
  }
}

@media (max-width: 640px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .profile-tabs {
    flex-wrap: nowrap;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    padding: 35px 25px;
  }
  
  .auth-form {
    padding: 35px 25px;
  }
}
</style>
