import { supabase } from './supabase'
import type { VerificationCodeRequest, AuthResponse } from '@/types/auth'

/**
 * 发送验证码到邮箱（使用 Supabase Auth 的 Email OTP）
 */
export async function sendVerificationCode(
  request: VerificationCodeRequest
): Promise<AuthResponse> {
  try {
    const { email, phone, type } = request

    // 验证参数
    if (!email && !phone) {
      return {
        success: false,
        message: '请提供邮箱或手机号'
      }
    }

    if (email && phone) {
      return {
        success: false,
        message: '邮箱和手机号只能提供一个'
      }
    }

    // 发送邮件验证码
    if (email) {
      // 使用 Supabase Auth 的 signInWithOtp 发送验证码
      // 这会自动发送一封包含验证码的邮件
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: type === 'register', // 注册时创建用户，其他情况不创建
          data: {
            verification_type: type // 记录验证类型
          }
        }
      })

      if (error) {
        console.error('发送验证码失败:', error)
        
        // 处理常见错误
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          return {
            success: false,
            message: '该邮箱已被注册'
          }
        }
        
        if (error.message.includes('Email rate limit exceeded')) {
          return {
            success: false,
            message: '发送过于频繁，请稍后再试'
          }
        }

        return {
          success: false,
          message: '发送验证码失败，请稍后重试',
          error: error.message
        }
      }

      console.log('✅ 验证码邮件已发送到:', email)

      return {
        success: true,
        message: '验证码已发送到您的邮箱，请查收',
        data: data
      }
    }

    // TODO: 发送短信验证码（如果是手机号）
    if (phone) {
      // 这里需要集成短信服务提供商，如阿里云、腾讯云等
      console.log(`短信验证码发送功能待开发: ${phone}`)
      return {
        success: false,
        message: '短信验证码功能暂未开放'
      }
    }

    return {
      success: false,
      message: '发送失败'
    }
  } catch (error: any) {
    console.error('发送验证码异常:', error)
    return {
      success: false,
      message: '发送验证码失败，请稍后重试',
      error: error.message
    }
  }
}

/**
 * 验证邮箱 OTP 验证码（使用 Supabase Auth）
 */
export async function verifyEmailOTP(
  email: string,
  token: string
): Promise<AuthResponse> {
  try {
    // 使用 Supabase Auth 的 verifyOtp 验证验证码
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email'
    })

    if (error) {
      console.error('验证失败:', error)
      
      if (error.message.includes('expired')) {
        return {
          success: false,
          message: '验证码错误或无效'
        }
      }
      
      if (error.message.includes('invalid')) {
        return {
          success: false,
          message: '验证码错误或无效'
        }
      }

      return {
        success: false,
        message: '验证失败，请稍后重试',
        error: error.message
      }
    }

    if (!data.session) {
      return {
        success: false,
        message: '验证失败'
      }
    }

    console.log('✅ 验证码验证成功')

    return {
      success: true,
      message: '验证成功',
      data: {
        user: data.user,
        session: data.session
      }
    }
  } catch (error: any) {
    console.error('验证异常:', error)
    return {
      success: false,
      message: '验证失败，请稍后重试',
      error: error.message
    }
  }
}

/**
 * 验证验证码（兼容旧接口）
 */
export async function verifyCode(
  email: string | undefined,
  phone: string | undefined,
  code: string,
  type: 'register' | 'login' | 'reset_password'
): Promise<AuthResponse> {
  try {
    if (!email && !phone) {
      return {
        success: false,
        message: '请提供邮箱或手机号'
      }
    }

    if (!code) {
      return {
        success: false,
        message: '请输入验证码'
      }
    }

    // 如果是邮箱，使用 Supabase Auth OTP 验证
    if (email) {
      return await verifyEmailOTP(email, code)
    }

    // TODO: 手机号验证（待实现）
    if (phone) {
      return {
        success: false,
        message: '短信验证功能暂未开放'
      }
    }

    return {
      success: false,
      message: '验证失败'
    }
  } catch (error: any) {
    console.error('验证异常:', error)
    return {
      success: false,
      message: '验证失败，请稍后重试',
      error: error.message
    }
  }
}
