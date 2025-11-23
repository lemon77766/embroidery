# 邮箱验证码注册功能部署指南

## 📋 功能概述

本文档介绍如何部署和使用基于 Supabase 的邮箱验证码注册功能。

### 主要功能
- ✅ 邮箱验证码发送
- ✅ 验证码验证
- ✅ 用户注册（验证码方式）
- ✅ 验证码过期管理
- ✅ 自动清理过期验证码

---

## 🚀 快速部署步骤

### 步骤 1: 部署数据库更改

1. **登录 Supabase Dashboard**
   - 访问 [https://supabase.com](https://supabase.com)
   - 选择你的项目

2. **执行数据库迁移**
   - 进入 `SQL Editor`
   - 将 `supabase_migration.sql` 文件的完整内容复制粘贴
   - 点击 `Run` 执行

3. **验证部署**
   执行以下 SQL 验证表和函数是否创建成功：
   
   ```sql
   -- 检查表
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('user_profiles', 'verification_codes');
   
   -- 检查函数
   SELECT proname FROM pg_proc 
   WHERE proname IN (
     'generate_verification_code',
     'create_verification_code',
     'verify_code',
     'cleanup_expired_verification_codes'
   );
   ```

### 步骤 2: 配置邮件服务

1. **注册 Resend 账号**（如果还没有）
   - 访问 [https://resend.com](https://resend.com)
   - 注册并获取 API Key

2. **配置环境变量**
   
   在 `.env` 文件中确认以下配置：
   ```env
   # Supabase 配置
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Resend 邮件服务配置
   VITE_RESEND_API_KEY=your_resend_api_key
   VITE_EMAIL_FROM=onboarding@resend.dev
   ```

3. **开发模式说明**
   - 如果未配置 `VITE_RESEND_API_KEY`，验证码将在控制台输出
   - 这方便开发测试，但生产环境必须配置邮件服务

### 步骤 3: 测试功能

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **测试注册流程**
   - 访问个人中心页面
   - 切换到"注册"标签
   - 填写邮箱并点击"获取验证码"
   - 检查邮箱（或控制台）获取验证码
   - 完成注册流程

---

## 📚 API 使用说明

### 发送验证码

```typescript
import { sendVerificationCode } from '@/services/verification'

// 发送注册验证码
const result = await sendVerificationCode({
  email: 'user@example.com',
  type: 'register'
})

if (result.success) {
  console.log('验证码已发送')
}
```

### 验证验证码

```typescript
import { verifyCode } from '@/services/verification'

// 验证验证码
const result = await verifyCode(
  'user@example.com',  // 邮箱
  undefined,           // 手机号（不使用时传 undefined）
  '123456',            // 验证码
  'register'           // 类型
)

if (result.success) {
  console.log('验证成功')
}
```

### 注册用户（验证码方式）

```typescript
import { registerUserWithCode } from '@/services/auth'

const result = await registerUserWithCode({
  email: 'user@example.com',
  username: 'newuser',
  password: 'password123',
  confirmPassword: 'password123',
  code: '123456',
  phone: '13800138000' // 可选
})

if (result.success) {
  console.log('注册成功', result.data.user)
}
```

---

## 🗄️ 数据库架构

### verification_codes 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | TEXT | 邮箱（与 phone 二选一） |
| phone | TEXT | 手机号（与 email 二选一） |
| code | TEXT | 验证码（6位数字） |
| type | TEXT | 类型（register/login/reset_password） |
| verified | BOOLEAN | 是否已验证 |
| expires_at | TIMESTAMPTZ | 过期时间 |
| created_at | TIMESTAMPTZ | 创建时间 |

### 核心函数

#### 1. generate_verification_code()
生成6位随机数字验证码

#### 2. create_verification_code(p_email, p_phone, p_type, p_expires_minutes)
创建验证码记录
- 自动删除同类型的旧验证码
- 返回生成的验证码和过期时间
- 默认5分钟过期

#### 3. verify_code(p_email, p_phone, p_code, p_type)
验证验证码
- 检查验证码是否有效
- 验证成功后标记为已验证
- 返回布尔值

#### 4. cleanup_expired_verification_codes()
清理过期验证码
- 可手动调用或配置定时任务

---

## 🔒 安全说明

### RLS（行级安全）策略

1. **验证码创建**：所有人都可以创建（包括匿名用户）
2. **验证码查询**：只能查看与自己相关的验证码
3. **自动清理**：定期清理过期验证码，防止数据积累

### 最佳实践

1. **验证码有效期**：默认5分钟，可根据需求调整
2. **重发限制**：前端实现60秒倒计时，防止频繁发送
3. **一次性使用**：验证成功后标记为已验证，不可重复使用
4. **邮箱格式验证**：前端和后端双重验证
5. **密码强度**：至少6位，建议添加更强的密码策略

---

## 🎨 UI 组件说明

### 注册表单组件

位置：`src/views/ProfileView.vue`

主要功能：
- 用户名输入
- 邮箱输入
- 验证码输入（带发送按钮）
- 手机号输入（可选）
- 密码输入
- 确认密码输入

特性：
- 60秒倒计时防重发
- 实时验证
- 加载状态提示
- 成功/失败消息提示

---

## 🛠️ 故障排查

### 问题 1: 验证码未发送

**可能原因：**
- Resend API Key 未配置或无效
- 邮箱地址无效
- 网络问题

**解决方法：**
1. 检查 `.env` 文件中的 `VITE_RESEND_API_KEY`
2. 查看浏览器控制台的错误信息
3. 开发模式下，验证码会在控制台输出

### 问题 2: 验证码验证失败

**可能原因：**
- 验证码已过期（5分钟）
- 验证码输入错误
- 验证码已被使用

**解决方法：**
1. 重新获取验证码
2. 检查验证码是否正确（6位数字）
3. 确保在5分钟内使用

### 问题 3: 注册失败

**可能原因：**
- 邮箱已被注册
- 密码不符合要求
- 验证码未验证

**解决方法：**
1. 使用不同的邮箱
2. 确保密码至少6位
3. 先获取并验证验证码

### 问题 4: 数据库函数调用失败

**可能原因：**
- 函数未正确创建
- 权限配置问题
- RLS 策略冲突

**解决方法：**
1. 重新执行迁移脚本
2. 检查函数权限（GRANT 语句）
3. 验证 RLS 策略配置

---

## 📊 监控和维护

### 定期清理过期验证码

**手动清理：**
```sql
SELECT public.cleanup_expired_verification_codes();
```

**自动清理（可选）：**

如果你的 Supabase 项目启用了 pg_cron 扩展：

```sql
-- 每小时清理一次
SELECT cron.schedule(
  'cleanup-expired-codes',
  '0 * * * *',
  'SELECT public.cleanup_expired_verification_codes()'
);
```

### 查询验证码统计

```sql
-- 查看未过期的验证码数量
SELECT COUNT(*) FROM verification_codes 
WHERE expires_at > NOW() AND verified = FALSE;

-- 查看今天发送的验证码数量
SELECT type, COUNT(*) 
FROM verification_codes 
WHERE created_at >= CURRENT_DATE 
GROUP BY type;
```

---

## 🔄 未来扩展

### 1. 短信验证码支持

已预留手机号验证接口，只需集成短信服务商：

```typescript
// 在 verification.ts 中添加
async function sendSmsVerificationCode(phone: string, code: string) {
  // 集成阿里云、腾讯云等短信服务
}
```

### 2. 登录验证码

已支持 `login` 类型验证码，可用于免密登录：

```typescript
const result = await sendVerificationCode({
  email: 'user@example.com',
  type: 'login'
})
```

### 3. 找回密码

已支持 `reset_password` 类型验证码：

```typescript
const result = await sendVerificationCode({
  email: 'user@example.com',
  type: 'reset_password'
})
```

---

## 📞 技术支持

如果遇到问题，请检查：

1. **Supabase Dashboard** - 查看日志和错误
2. **浏览器控制台** - 查看前端错误
3. **网络请求** - 使用开发者工具检查 API 调用

---

## ✅ 部署检查清单

- [ ] 数据库迁移脚本已执行
- [ ] 验证码表和函数创建成功
- [ ] Resend API Key 已配置
- [ ] 环境变量已正确设置
- [ ] 本地开发环境测试通过
- [ ] 注册流程测试成功
- [ ] 验证码邮件发送正常
- [ ] 验证码验证功能正常
- [ ] RLS 策略配置正确

---

**祝你使用愉快！** 🎉
