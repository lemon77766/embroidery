// 用户扩展信息类型
export interface UserProfile {
  id: string
  username: string | null
  phone: string | null
  avatar_url: string | null
  address: string | null
  created_at: string
  updated_at: string
}

// 验证码类型
export interface VerificationCode {
  id: string
  email: string | null
  phone: string | null
  code: string
  type: 'register' | 'login' | 'reset_password'
  verified: boolean
  expires_at: string
  created_at: string
}

// 注册表单数据
export interface RegisterFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
  phone?: string
}

// 登录表单数据
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

// 验证码请求数据
export interface VerificationCodeRequest {
  email?: string
  phone?: string
  type: 'register' | 'login' | 'reset_password'
}

// 验证码注册表单数据
export interface VerifyCodeRegisterFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
  code: string
  phone?: string
}

// 认证响应
export interface AuthResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}
