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
            
            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label>邮箱</label>
                <input 
                  v-model="loginData.email" 
                  type="email"
                  placeholder="请输入邮箱"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>密码</label>
                <input 
                  v-model="loginData.password" 
                  type="password"
                  placeholder="请输入密码"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="loginData.rememberMe" />
                  <span>记住我</span>
                </label>
                <button type="button" class="forgot-password">忘记密码？</button>
              </div>
              <button 
                type="submit" 
                class="auth-submit"
                :disabled="isLoading"
              >
                {{ isLoading ? '登录中...' : '登录' }}
              </button>
            </form>
          </div>

          <!-- 注册表单 -->
          <div v-else class="auth-form">
            <h2 class="auth-title">创建账户</h2>
            <p class="auth-subtitle">加入我们,开启您的刺绣艺术之旅</p>
            
            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <label>用户名</label>
                <input 
                  v-model="registerData.username" 
                  type="text"
                  placeholder="请输入用户名"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input 
                  v-model="registerData.email" 
                  type="email"
                  placeholder="请输入邮箱"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>邮箱验证码</label>
                <div class="verification-input-group">
                  <input 
                    v-model="registerData.code" 
                    type="text"
                    placeholder="请输入8位验证码"
                    required
                    maxlength="8"
                    class="form-input"
                    style="letter-spacing: 2px; font-family: monospace;"
                  />
                  <button 
                    type="button"
                    class="send-code-btn"
                    :disabled="isSendingCode || countdown > 0 || !registerData.email"
                    @click="handleSendCode"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重试` : (isSendingCode ? '发送中...' : '获取验证码') }}
                  </button>
                </div>
                <p v-if="codeMessage" class="code-message">{{ codeMessage }}</p>
              </div>
              <div class="form-group">
                <label>手机号（选填）</label>
                <input 
                  v-model="registerData.phone" 
                  type="tel"
                  placeholder="请输入手机号"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>密码</label>
                <input 
                  v-model="registerData.password" 
                  type="password"
                  placeholder="请输入密码（6位以上）"
                  required
                  minlength="6"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>确认密码</label>
                <input 
                  v-model="registerData.confirmPassword" 
                  type="password"
                  placeholder="请再次输入密码"
                  required
                  class="form-input"
                />
              </div>
              <button 
                type="submit" 
                class="auth-submit"
                :disabled="isLoading"
              >
                {{ isLoading ? '注册中...' : '注册' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 已登录状态 - 显示用户中心 -->
    <div v-else class="user-center">
      <div class="container">
        <!-- 用户头部 -->
        <div class="user-header">
          <div class="user-avatar-container">
            <div class="user-avatar">
              <img :src="userProfile?.avatar_url || '/images/default-avatar.jpg'" alt="用户头像" />
              <div class="avatar-overlay">
                <label for="avatar-upload" class="avatar-upload-btn">
                  📷 上传头像
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    @change="handleAvatarUpload"
                    style="display: none;"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ userProfile?.username || '用户' }}</h2>
            <p class="user-email">📧 {{ currentUser?.email }}</p>
            <p v-if="userProfile?.phone" class="user-phone">📱 {{ userProfile.phone }}</p>
          </div>
          <button class="btn btn-plain logout-btn" @click="handleLogout">
            退出登录
          </button>
        </div>

        <!-- 功能标签 -->
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
          <div v-if="activeTab === 'info'">
            <h3 class="section-title">个人信息</h3>
            <form @submit.prevent="handleUpdateProfile" class="profile-form">
              <div class="form-group">
                <label>用户名</label>
                <input 
                  v-model="profileEdit.username" 
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>手机号</label>
                <input 
                  v-model="profileEdit.phone" 
                  type="tel"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>地址</label>
                <input 
                  v-model="profileEdit.address" 
                  type="text"
                  class="form-input"
                />
              </div>
              <button type="submit" class="btn" :disabled="isLoading">
                {{ isLoading ? '保存中...' : '保存修改' }}
              </button>
            </form>
          </div>

          <!-- 其他标签页内容保持不变 -->
          <div v-else-if="activeTab === 'favorites'">
            <h3 class="section-title">我的收藏</h3>
            
            <div v-if="loadingFavorites" class="loading-state">
              <p>加载中...</p>
            </div>
            
            <div v-else-if="favoritedProducts.length > 0" class="favorites-grid">
              <div v-for="product in favoritedProducts" :key="product.id" class="favorite-item">
                <div class="favorite-image-wrapper">
                  <img :src="product.image" :alt="product.title" class="favorite-image" />
                  <button 
                    class="remove-favorite-btn"
                    @click="handleRemoveFavorite(product.id)"
                    title="取消收藏"
                  >
                    ✕
                  </button>
                </div>
                <div class="favorite-info">
                  <h4 class="favorite-title">{{ product.title }}</h4>
                  <p class="favorite-category">{{ product.categoryLabel }}</p>
                  <p class="favorite-price">{{ formatPrice(product.price) }}</p>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-favorites">
              <p class="empty-state">暂无收藏内容</p>
              <p class="empty-hint">去看看绣品，收藏心仪的绣品吧~</p>
              <button class="btn" type="button" @click="goToProducts">
                前往绣品展示页面
              </button>
            </div>
          </div>

          <div v-else-if="activeTab === 'orders'">
            <h3 class="section-title">订单管理</h3>
            <p class="empty-state">暂无订单</p>
          </div>

          <div v-else-if="activeTab === 'settings'">
            <h3 class="section-title">账户设置</h3>
            <div class="settings-list">
              <div class="setting-item">
                <span>修改密码</span>
                <button class="btn btn-plain btn-mini" @click="showPasswordModal = true">修改</button>
              </div>
              <div class="setting-item">
                <span>消息通知</span>
                <label class="switch">
                  <input type="checkbox" checked />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="modal-close" @click="closePasswordModal">✕</button>
        </div>
        <form @submit.prevent="handleChangePassword" class="modal-body">
          <div class="form-group">
            <label>原密码</label>
            <input 
              v-model="passwordForm.oldPassword" 
              type="password"
              placeholder="请输入原密码"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input 
              v-model="passwordForm.newPassword" 
              type="password"
              placeholder="请输入新密码（6位以上）"
              required
              minlength="6"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input 
              v-model="passwordForm.confirmPassword" 
              type="password"
              placeholder="请再次输入新密码"
              required
              class="form-input"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-plain" @click="closePasswordModal">取消</button>
            <button type="submit" class="btn" :disabled="isLoading">
              {{ isLoading ? '修改中...' : '确认修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  registerUserWithCode, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword,
  onAuthStateChange
} from '@/services/auth'
import { sendVerificationCode } from '@/services/verification'
import { getUserFavorites, removeFavorite } from '@/services/favorites'
import { useCatalogStore } from '@/stores/catalog'
import type { VerifyCodeRegisterFormData, LoginFormData, UserProfile } from '@/types/auth'

const router = useRouter()

// 获取 catalog store
const catalogStore = useCatalogStore()

// 认证模式
const authMode = ref<'login' | 'register'>('login')
const isLoading = ref(false)
const currentUser = ref<any>(null)
const userProfile = ref<UserProfile | null>(null)

// 登录状态
const isLoggedIn = computed(() => !!currentUser.value)

// 收藏相关
const loadingFavorites = ref(false)
const userFavoritesList = ref<any[]>([])

// 收藏的产品列表（通过 product_id 从 catalog 获取完整信息）
const favoritedProducts = computed(() => {
  if (!userFavoritesList.value || userFavoritesList.value.length === 0) {
    return []
  }
  
  return userFavoritesList.value
    .map(fav => {
      const product = catalogStore.allProducts.find(p => p.id === fav.product_id)
      return product
    })
    .filter((p): p is any => p !== undefined)
})

// 登录表单
const loginData = reactive<LoginFormData>({
  email: '',
  password: '',
  rememberMe: false
})

// 注册表单
const registerData = reactive<VerifyCodeRegisterFormData>({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  phone: ''
})

// 验证码相关状态
const isSendingCode = ref(false)
const countdown = ref(0)
const codeMessage = ref('')
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 处理登录
async function handleLogin() {
  if (!loginData.email || !loginData.password) {
    alert('请填写完整信息')
    return
  }

  isLoading.value = true
  const result = await loginUser(loginData)
  isLoading.value = false

  if (result.success) {
    alert('登录成功！')
    currentUser.value = result.data?.user
    await loadUserProfile()
  } else {
    alert(result.message)
  }
}

// 发送验证码
async function handleSendCode() {
  if (!registerData.email) {
    alert('请先输入邮箱')
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerData.email)) {
    alert('请输入有效的邮箱地址')
    return
  }

  isSendingCode.value = true
  codeMessage.value = ''

  const result = await sendVerificationCode({
    email: registerData.email,
    type: 'register'
  })

  isSendingCode.value = false

  if (result.success) {
    codeMessage.value = '验证码已发送到您的邮箱，请查收'
    // 开始倒计时
    countdown.value = 60
    startCountdown()
  } else {
    alert(result.message)
  }
}

// 倒计时
function startCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

// 处理注册
async function handleRegister() {
  if (!registerData.email || !registerData.username || !registerData.password || !registerData.code) {
    alert('请填写完整信息')
    return
  }

  if (registerData.password !== registerData.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  if (registerData.password.length < 6) {
    alert('密码长度至少6位')
    return
  }

  if (registerData.code.length < 6) {
    alert('请输入完整的验证码')
    return
  }

  isLoading.value = true
  const result = await registerUserWithCode(registerData)
  isLoading.value = false

  if (result.success) {
    alert('注册成功！')
    currentUser.value = result.data?.user
    await loadUserProfile()
    // 清空表单
    registerData.email = ''
    registerData.username = ''
    registerData.password = ''
    registerData.confirmPassword = ''
    registerData.code = ''
    registerData.phone = ''
    codeMessage.value = ''
  } else {
    alert(result.message)
  }
}

// 处理登出
async function handleLogout() {
  if (!confirm('确定要退出登录吗？')) {
    return
  }

  isLoading.value = true
  const result = await logoutUser()
  isLoading.value = false

  if (result.success) {
    currentUser.value = null
    userProfile.value = null
    alert('已退出登录')
  }
}

// 加载用户信息
async function loadUserProfile() {
  if (!currentUser.value?.id) return

  const profile = await getUserProfile(currentUser.value.id)
  if (profile) {
    userProfile.value = profile
    // 初始化编辑表单
    profileEdit.username = profile.username || ''
    profileEdit.phone = profile.phone || ''
    profileEdit.address = profile.address || ''
  }
  
  // 同时加载收藏列表
  await loadUserFavorites()
}

// 加载用户收藏列表
async function loadUserFavorites() {
  if (!currentUser.value?.id) return
  
  loadingFavorites.value = true
  const result = await getUserFavorites()
  loadingFavorites.value = false
  
  if (result.success) {
    userFavoritesList.value = result.data
  }
}

// 取消收藏
async function handleRemoveFavorite(productId: string) {
  const result = await removeFavorite(productId)
  
  if (result.success) {
    alert('已取消收藏')
    // 重新加载收藏列表
    await loadUserFavorites()
  } else {
    alert(result.message)
  }
}

// 前往绣品展示页
function goToProducts() {
  router.push({ name: 'products' })
}

// 格式化价格
const formatPrice = (value: number) => {
  return `¥${value.toLocaleString()}`
}

// 标签页
const activeTab = ref('favorites')
const tabs = [
  { id: 'info', label: '个人信息', icon: '信' },
  { id: 'favorites', label: '我的收藏', icon: '藏' },
  { id: 'orders', label: '订单管理', icon: '单' },
  { id: 'settings', label: '账户设置', icon: '设' }
]

// 个人信息编辑
const profileEdit = reactive({
  username: '',
  phone: '',
  address: ''
})

// 修改密码弹窗
const showPasswordModal = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 关闭密码弹窗
function closePasswordModal() {
  showPasswordModal.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 处理头像上传
async function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file || !currentUser.value?.id) {
    return
  }

  // 检查文件大小
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过 2MB')
    return
  }

  isLoading.value = true
  const result = await uploadAvatar(currentUser.value.id, file)
  isLoading.value = false

  if (result.success) {
    alert('头像上传成功！')
    await loadUserProfile()
  } else {
    alert(result.message)
  }

  // 清空文件选择
  target.value = ''
}

// 处理修改密码
async function handleChangePassword() {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    alert('请填写完整信息')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    alert('新密码长度至少6位')
    return
  }

  if (passwordForm.oldPassword === passwordForm.newPassword) {
    alert('新密码不能与原密码相同')
    return
  }

  isLoading.value = true
  const result = await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
  isLoading.value = false

  if (result.success) {
    alert('密码修改成功！')
    closePasswordModal()
  } else {
    alert(result.message)
  }
}

// 更新个人信息
async function handleUpdateProfile() {
  if (!currentUser.value?.id) return

  isLoading.value = true
  const result = await updateUserProfile(currentUser.value.id, {
    username: profileEdit.username || null,
    phone: profileEdit.phone || null,
    address: profileEdit.address || null
  })
  isLoading.value = false

  if (result.success) {
    alert('更新成功！')
    await loadUserProfile()
  } else {
    alert(result.message)
  }
}

// 初始化
onMounted(async () => {
  // 检查当前登录状态
  currentUser.value = await getCurrentUser()
  if (currentUser.value) {
    await loadUserProfile()
  }

  // 监听认证状态变化
  onAuthStateChange((user) => {
    currentUser.value = user
    if (user) {
      loadUserProfile()
    } else {
      userProfile.value = null
    }
  })
})
</script>

<style scoped lang="scss">
@use '@/styles/main.scss' as *;

.form-group {
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 15px;
  }
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid rgba(212, 165, 116, 0.2);
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: rgba(255, 254, 249, 0.8);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

.verification-input-group {
  display: flex;
  gap: 12px;

  .form-input {
    flex: 1;
  }
}

.send-code-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, rgba(245, 222, 179, 0.3), rgba(212, 165, 116, 0.2));
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  color: var(--dark-gold);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(245, 222, 179, 0.4), rgba(212, 165, 116, 0.3));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 165, 116, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.code-message {
  margin-top: 8px;
  font-size: 13px;
  color: var(--success-color);
}

.profile-form {
  max-width: 600px;

  .btn {
    margin-top: 20px;
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 26px;

    &::before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + .slider {
    background: var(--pattern-gold);
  }

  input:checked + .slider::before {
    transform: translateX(24px);
  }
}

/* 继续使用原有的样式 */
.profile-page {
  min-height: calc(100vh - 80px);
  padding-top: 20px;
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

.auth-section {
  padding: 20px 0;
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
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(212, 165, 116, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

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
  background-image:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(250, 245, 235, 0.92)),
    url('/images/home.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.user-avatar-container {
  position: relative;
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
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.avatar-upload-btn {
  color: white;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
  padding: 5px;
  user-select: none;
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
}

.user-email, .user-phone {
  color: var(--text-secondary);
  font-size: 15px;
  margin: 5px 0;
}

.logout-btn {
  height: 42px;
  padding: 0 28px;
  border: 2px solid rgba(212, 165, 116, 0.4);
  color: var(--primary-color);
  border-radius: 12px;
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, rgba(245, 222, 179, 0.2), rgba(212, 165, 116, 0.15));
    border-color: var(--primary-color);
  }
}

.profile-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 35px;
  overflow-x: auto;
  padding: 8px;
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

  &:hover {
    border-color: rgba(212, 165, 116, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(212, 165, 116, 0.15);
  }

  &.active {
    background: linear-gradient(135deg, rgba(245, 222, 179, 0.4), rgba(212, 165, 116, 0.25));
    border-color: var(--primary-color);
    color: var(--dark-gold);
    font-weight: 700;
  }
}

.tab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid rgba(212, 165, 116, 0.8);
  background: linear-gradient(135deg, #fffaf0, #f3d9a6);
  color: var(--dark-gold);
  font-family: 'SimSun', '宋体', 'Songti SC', serif;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(212, 165, 116, 0.35);
}

.tab-label {
  font-family: 'SimSun', '宋体', 'Songti SC', serif;
}

.profile-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px;
  box-shadow: 
    0 10px 40px rgba(212, 165, 116, 0.12),
    0 0 0 1px rgba(212, 165, 116, 0.08) inset;
  min-height: 450px;
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
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 16px;
}

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
  background: rgba(255, 255, 255, 0.5);

  span {
    font-size: 16px;
    font-weight: 600;
  }
}

/* 修改密码弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(250, 245, 235, 0.95));
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 
    0 20px 60px rgba(212, 165, 116, 0.3),
    0 0 0 1px rgba(212, 165, 116, 0.1) inset;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 35px;
  border-bottom: 2px solid rgba(212, 165, 116, 0.15);
  background: linear-gradient(to bottom, rgba(212, 165, 116, 0.05), transparent);

  h3 {
    font-size: 24px;
    font-weight: 700;
    background: var(--pattern-gold);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--text-secondary);
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(212, 165, 116, 0.1);
    color: var(--primary-color);
  }
}

.modal-body {
  padding: 35px;
}

.modal-footer {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px solid rgba(212, 165, 116, 0.1);

  .btn {
    min-width: 100px;
  }
}

/* 收藏相关样式 */
.loading-state,
.empty-favorites {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-hint {
  color: var(--text-muted);
  font-size: 14px;
  margin-top: 10px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 25px;
}

.favorite-item {
  background: linear-gradient(to bottom, rgba(255, 254, 249, 0.95), rgba(250, 245, 235, 0.9));
  border: 2px solid rgba(212, 165, 116, 0.15);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(212, 165, 116, 0.2);
    border-color: rgba(212, 165, 116, 0.3);
  }
}

.favorite-image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  
  &:hover .remove-favorite-btn {
    opacity: 1;
  }
}

.favorite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .favorite-item:hover & {
    transform: scale(1.05);
  }
}

.remove-favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: var(--error-color);
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: var(--error-color);
    color: white;
    transform: scale(1.1);
  }
}

.favorite-info {
  padding: 18px;
}

.favorite-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.favorite-category {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
}

.favorite-price {
  font-size: 20px;
  font-weight: bold;
  background: var(--pattern-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
</style>
