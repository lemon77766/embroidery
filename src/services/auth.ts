import { supabase } from './supabase'
import { verifyCode } from './verification'
import type {
  RegisterFormData,
  LoginFormData,
  AuthResponse,
  UserProfile,
  VerifyCodeRegisterFormData
} from '@/types/auth'

/**
 * 用户注册（密码方式）
 */
export async function registerUser(formData: RegisterFormData): Promise<AuthResponse> {
  try {
    // 1. 注册用户（使用 Supabase Auth）
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          phone: formData.phone
        }
      }
    })

    if (authError) {
      console.error('注册失败:', authError)
      return {
        success: false,
        message: authError.message === 'User already registered'
          ? '该邮箱已被注册'
          : '注册失败，请稍后重试',
        error: authError.message
      }
    }

    if (!authData.user) {
      return {
        success: false,
        message: '注册失败，请稍后重试'
      }
    }

    // 2. 创建用户扩展信息
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: authData.user.id,
      username: formData.username,
      phone: formData.phone || null,
      avatar_url: '/images/touxiang.jpg',
      address: null
    })

    if (profileError) {
      console.error('创建用户信息失败:', profileError)
      // 即使创建扩展信息失败，注册也算成功
    }

    return {
      success: true,
      message: '注册成功！',
      data: {
        user: authData.user,
        session: authData.session
      }
    }
  } catch (error: any) {
    console.error('注册异常:', error)
    return {
      success: false,
      message: '注册失败，请稍后重试',
      error: error.message
    }
  }
}

/**
 * 用户注册（验证码方式 - 使用 Supabase Auth OTP）
 */
export async function registerUserWithCode(formData: VerifyCodeRegisterFormData): Promise<AuthResponse> {
  try {
    // 1. 验证验证码并登录（Supabase Auth OTP 验证成功后会自动创建用户和 session）
    const verifyResult = await verifyCode(formData.email, undefined, formData.code, 'register')
    
    if (!verifyResult.success) {
      return verifyResult
    }

    // verifyCode 成功后，用户已经通过 OTP 登录，session 已创建
    const user = verifyResult.data?.user
    const session = verifyResult.data?.session

    if (!user || !session) {
      return {
        success: false,
        message: '注册失败，请重试'
      }
    }

    // 2. 更新用户的密码（因为 OTP 登录不需要密码，我们需要为用户设置密码）
    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.password,
      data: {
        username: formData.username,
        phone: formData.phone
      }
    })

    if (updateError) {
      console.error('设置密码失败:', updateError)
      // 即使设置密码失败，用户仍然可以使用 OTP 登录
    }

    // 3. 创建用户扩展信息
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: user.id,
      username: formData.username,
      phone: formData.phone || null,
      avatar_url: '/images/touxiang.jpg',
      address: formData.email // 将邮箱地址写入 address 字段
    })

    if (profileError) {
      console.error('创建用户信息失败:', profileError)
      // 即使创建扩展信息失败，注册也算成功
    }

    return {
      success: true,
      message: '注册成功！',
      data: {
        user: user,
        session: session
      }
    }
  } catch (error: any) {
    console.error('注册异常:', error)
    return {
      success: false,
      message: '注册失败，请稍后重试',
      error: error.message
    }
  }
}

/**
 * 用户登录
 */
export async function loginUser(formData: LoginFormData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    if (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: error.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : '登录失败，请稍后重试',
        error: error.message
      }
    }

    return {
      success: true,
      message: '登录成功！',
      data: {
        user: data.user,
        session: data.session
      }
    }
  } catch (error: any) {
    console.error('登录异常:', error)
    return {
      success: false,
      message: '登录失败，请稍后重试',
      error: error.message
    }
  }
}

/**
 * 用户登出
 */
export async function logoutUser(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('登出失败:', error)
      return {
        success: false,
        message: '登出失败',
        error: error.message
      }
    }

    return {
      success: true,
      message: '已成功退出登录'
    }
  } catch (error: any) {
    console.error('登出异常:', error)
    return {
      success: false,
      message: '登出失败',
      error: error.message
    }
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 获取用户扩展信息
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('获取用户信息失败:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('获取用户信息异常:', error)
    return null
  }
}

/**
 * 更新用户扩展信息
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<AuthResponse> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)

    if (error) {
      console.error('更新用户信息失败:', error)
      return {
        success: false,
        message: '更新失败',
        error: error.message
      }
    }

    return {
      success: true,
      message: '更新成功'
    }
  } catch (error: any) {
    console.error('更新用户信息异常:', error)
    return {
      success: false,
      message: '更新失败',
      error: error.message
    }
  }
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(userId: string, file: File): Promise<AuthResponse> {
  try {
    // 1. 验证文件类型和大小
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: '只支持 JPG、PNG、WEBP 格式的图片'
      }
    }

    // 限制文件大小为 2MB
    if (file.size > 2 * 1024 * 1024) {
      return {
        success: false,
        message: '图片大小不能超过 2MB'
      }
    }

    // 2. 生成唯一文件名
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // 3. 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('上传头像失败:', uploadError)
      return {
        success: false,
        message: '上传失败，请重试',
        error: uploadError.message
      }
    }

    // 4. 获取公共 URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const avatarUrl = urlData.publicUrl

    // 5. 更新用户信息
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)

    if (updateError) {
      console.error('更新头像 URL 失败:', updateError)
      return {
        success: false,
        message: '更新失败',
        error: updateError.message
      }
    }

    return {
      success: true,
      message: '头像上传成功',
      data: { avatar_url: avatarUrl }
    }
  } catch (error: any) {
    console.error('上传头像异常:', error)
    return {
      success: false,
      message: '上传失败，请重试',
      error: error.message
    }
  }
}

/**
 * 修改密码
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
  try {
    // 1. 验证新密码
    if (newPassword.length < 6) {
      return {
        success: false,
        message: '新密码长度至少6位'
      }
    }

    // 2. 获取当前用户
    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    
    if (getUserError || !user) {
      return {
        success: false,
        message: '请先登录'
      }
    }

    // 3. 验证旧密码（通过尝试重新登录）
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: oldPassword
    })

    if (signInError) {
      return {
        success: false,
        message: '原密码错误'
      }
    }

    // 4. 更新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('修改密码失败:', updateError)
      return {
        success: false,
        message: '修改失败，请重试',
        error: updateError.message
      }
    }

    return {
      success: true,
      message: '密码修改成功'
    }
  } catch (error: any) {
    console.error('修改密码异常:', error)
    return {
      success: false,
      message: '修改失败，请重试',
      error: error.message
    }
  }
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
}
