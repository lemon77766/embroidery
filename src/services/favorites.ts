import { supabase } from './supabase'

/**
 * 收藏项接口
 */
export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

/**
 * 添加收藏
 */
export async function addFavorite(productId: string) {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        success: false,
        message: '请先登录'
      }
    }

    // 添加收藏
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        product_id: productId
      })
      .select()
      .single()

    if (error) {
      // 如果是唯一性约束错误（已经收藏过）
      if (error.code === '23505') {
        return {
          success: false,
          message: '已经收藏过该商品'
        }
      }
      
      console.error('添加收藏失败:', error)
      return {
        success: false,
        message: '收藏失败，请重试'
      }
    }

    return {
      success: true,
      message: '收藏成功',
      data
    }
  } catch (error: any) {
    console.error('添加收藏异常:', error)
    return {
      success: false,
      message: '收藏失败，请重试'
    }
  }
}

/**
 * 取消收藏
 */
export async function removeFavorite(productId: string) {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        success: false,
        message: '请先登录'
      }
    }

    // 删除收藏
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      console.error('取消收藏失败:', error)
      return {
        success: false,
        message: '取消收藏失败，请重试'
      }
    }

    return {
      success: true,
      message: '已取消收藏'
    }
  } catch (error: any) {
    console.error('取消收藏异常:', error)
    return {
      success: false,
      message: '取消收藏失败，请重试'
    }
  }
}

/**
 * 检查是否已收藏
 */
export async function isFavorited(productId: string): Promise<boolean> {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return false
    }

    // 查询收藏记录
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (error) {
      // 如果是找不到记录（PGRST116），说明没有收藏
      if (error.code === 'PGRST116') {
        return false
      }
      console.error('查询收藏状态失败:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('查询收藏状态异常:', error)
    return false
  }
}

/**
 * 获取用户的所有收藏
 */
export async function getUserFavorites() {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        success: false,
        message: '请先登录',
        data: []
      }
    }

    // 查询收藏列表
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取收藏列表失败:', error)
      return {
        success: false,
        message: '获取收藏列表失败',
        data: []
      }
    }

    return {
      success: true,
      message: '获取成功',
      data: data || []
    }
  } catch (error: any) {
    console.error('获取收藏列表异常:', error)
    return {
      success: false,
      message: '获取收藏列表失败',
      data: []
    }
  }
}

/**
 * 切换收藏状态（收藏/取消收藏）
 */
export async function toggleFavorite(productId: string) {
  const favorited = await isFavorited(productId)
  
  if (favorited) {
    return await removeFavorite(productId)
  } else {
    return await addFavorite(productId)
  }
}
