-- ========================================
-- 邮箱验证码功能 - 快速部署脚本
-- ========================================
-- 说明：将此文件的全部内容复制到 Supabase SQL Editor 中执行
-- 注意：如果已经执行过 supabase_migration.sql，请跳过前面的表创建部分

-- ========================================
-- 第一部分：验证码生成和验证函数
-- ========================================

-- 生成6位数字验证码
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_verification_code IS '生成6位数字验证码';


-- 创建验证码记录
CREATE OR REPLACE FUNCTION public.create_verification_code(
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'register',
  p_expires_minutes INTEGER DEFAULT 5
)
RETURNS TABLE(code TEXT, expires_at TIMESTAMPTZ) AS $$
DECLARE
  v_code TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- 验证参数
  IF p_email IS NULL AND p_phone IS NULL THEN
    RAISE EXCEPTION '邮箱或手机号必须提供一个';
  END IF;

  IF p_email IS NOT NULL AND p_phone IS NOT NULL THEN
    RAISE EXCEPTION '邮箱和手机号只能提供一个';
  END IF;

  -- 生成验证码
  v_code := public.generate_verification_code();
  v_expires_at := NOW() + (p_expires_minutes || ' minutes')::INTERVAL;

  -- 删除该邮箱/手机号的旧验证码（同类型）
  IF p_email IS NOT NULL THEN
    DELETE FROM public.verification_codes 
    WHERE email = p_email AND type = p_type AND verified = FALSE;
  ELSE
    DELETE FROM public.verification_codes 
    WHERE phone = p_phone AND type = p_type AND verified = FALSE;
  END IF;

  -- 插入新验证码
  INSERT INTO public.verification_codes (email, phone, code, type, expires_at)
  VALUES (p_email, p_phone, v_code, p_type, v_expires_at);

  RETURN QUERY SELECT v_code, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_verification_code IS '创建验证码记录';


-- 验证验证码
CREATE OR REPLACE FUNCTION public.verify_code(
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_code TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'register'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_valid BOOLEAN;
BEGIN
  -- 验证参数
  IF p_email IS NULL AND p_phone IS NULL THEN
    RAISE EXCEPTION '邮箱或手机号必须提供一个';
  END IF;

  IF p_code IS NULL THEN
    RAISE EXCEPTION '验证码不能为空';
  END IF;

  -- 查询并验证
  IF p_email IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.verification_codes
      WHERE email = p_email 
        AND code = p_code 
        AND type = p_type
        AND verified = FALSE
        AND expires_at > NOW()
    ) INTO v_valid;
    
    -- 如果验证成功，标记为已验证
    IF v_valid THEN
      UPDATE public.verification_codes
      SET verified = TRUE
      WHERE email = p_email 
        AND code = p_code 
        AND type = p_type
        AND verified = FALSE;
    END IF;
  ELSE
    SELECT EXISTS (
      SELECT 1 FROM public.verification_codes
      WHERE phone = p_phone 
        AND code = p_code 
        AND type = p_type
        AND verified = FALSE
        AND expires_at > NOW()
    ) INTO v_valid;
    
    -- 如果验证成功，标记为已验证
    IF v_valid THEN
      UPDATE public.verification_codes
      SET verified = TRUE
      WHERE phone = p_phone 
        AND code = p_code 
        AND type = p_type
        AND verified = FALSE;
    END IF;
  END IF;

  RETURN v_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.verify_code IS '验证验证码是否有效';


-- 清理过期验证码
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.cleanup_expired_verification_codes IS '清理过期的验证码';


-- ========================================
-- 第二部分：授予权限
-- ========================================

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.generate_verification_code() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_verification_code(TEXT, TEXT, TEXT, INTEGER) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.verify_code(TEXT, TEXT, TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_verification_codes() TO authenticated;


-- ========================================
-- 第三部分：测试验证码功能
-- ========================================

-- 测试1: 生成验证码
SELECT public.generate_verification_code();

-- 测试2: 创建验证码记录
SELECT * FROM public.create_verification_code(
  p_email := 'test@example.com',
  p_type := 'register',
  p_expires_minutes := 5
);

-- 测试3: 查看刚创建的验证码
SELECT * FROM public.verification_codes 
WHERE email = 'test@example.com' 
ORDER BY created_at DESC 
LIMIT 1;

-- 测试4: 验证验证码（请替换 'YOUR_CODE' 为上面查询到的验证码）
-- SELECT public.verify_code(
--   p_email := 'test@example.com',
--   p_code := 'YOUR_CODE',
--   p_type := 'register'
-- );

-- 测试5: 清理测试数据
DELETE FROM public.verification_codes WHERE email = 'test@example.com';


-- ========================================
-- 部署完成提示
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '邮箱验证码功能部署成功！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '已创建的函数：';
  RAISE NOTICE '  1. generate_verification_code()';
  RAISE NOTICE '  2. create_verification_code()';
  RAISE NOTICE '  3. verify_code()';
  RAISE NOTICE '  4. cleanup_expired_verification_codes()';
  RAISE NOTICE '';
  RAISE NOTICE '下一步操作：';
  RAISE NOTICE '  1. 配置 Resend API Key（.env 文件）';
  RAISE NOTICE '  2. 启动开发服务器: npm run dev';
  RAISE NOTICE '  3. 访问个人中心页面测试注册功能';
  RAISE NOTICE '========================================';
END $$;
