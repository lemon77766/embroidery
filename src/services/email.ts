/**
 * 邮件服务模块
 * 使用 Resend 发送邮件
 */

import { Resend } from 'resend'

// 初始化 Resend 客户端
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

/**
 * 发送验证码邮件
 */
export async function sendVerificationEmail(
  to: string,
  code: string,
  type: 'register' | 'login' | 'reset_password'
): Promise<{ success: boolean; error?: string }> {
  try {
    const typeLabels = {
      register: '注册验证码',
      login: '登录验证码',
      reset_password: '重置密码验证码'
    }

    const subject = `【国风刺绣】${typeLabels[type]}`
    
    const html = getEmailTemplate(code, typeLabels[type])

    const { data, error } = await resend.emails.send({
      from: import.meta.env.VITE_EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: subject,
      html: html
    })

    if (error) {
      console.error('发送邮件失败:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ 邮件发送成功:', data)
    return { success: true }
  } catch (error: any) {
    console.error('发送邮件异常:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取邮件 HTML 模板
 */
function getEmailTemplate(code: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
      background: linear-gradient(135deg, #fef9f0 0%, #f5e6c8 100%);
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(212, 165, 116, 0.2);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(135deg, #d4a574 0%, #c9954d 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 2px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .email-body {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #3d3020;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #6b6350;
      line-height: 1.8;
      margin-bottom: 30px;
    }
    .code-container {
      background: linear-gradient(135deg, rgba(245, 222, 179, 0.2), rgba(212, 165, 116, 0.1));
      border: 2px dashed #d4a574;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code-label {
      font-size: 14px;
      color: #a89f8a;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .code {
      font-size: 42px;
      font-weight: 700;
      color: #d4a574;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      text-shadow: 0 2px 4px rgba(212, 165, 116, 0.2);
    }
    .validity {
      font-size: 14px;
      color: #d64545;
      margin-top: 15px;
    }
    .tips {
      background: #fef9f0;
      border-left: 4px solid #d4a574;
      padding: 15px 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .tips h3 {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #3d3020;
    }
    .tips ul {
      margin: 0;
      padding-left: 20px;
      color: #6b6350;
      font-size: 14px;
      line-height: 1.8;
    }
    .email-footer {
      background: #3d3020;
      color: #f5f0e6;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      line-height: 1.8;
    }
    .email-footer a {
      color: #d4a574;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #ebe4d5, transparent);
      margin: 30px 0;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #d4a574;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- 邮件头部 -->
    <div class="email-header">
      <h1>🧵 国风刺绣艺术网</h1>
    </div>

    <!-- 邮件正文 -->
    <div class="email-body">
      <div class="greeting">尊敬的用户，您好！</div>
      
      <div class="message">
        感谢您使用国风刺绣艺术网。您正在进行<strong>${title}</strong>操作，请使用以下验证码完成验证：
      </div>

      <!-- 验证码 -->
      <div class="code-container">
        <div class="code-label">您的验证码</div>
        <div class="code">${code}</div>
        <div class="validity">⏰ 有效期：10分钟</div>
      </div>

      <div class="divider"></div>

      <!-- 安全提示 -->
      <div class="tips">
        <h3>🔒 安全提示</h3>
        <ul>
          <li>请勿将验证码告知他人，以保护您的账户安全</li>
          <li>验证码10分钟内有效，过期请重新获取</li>
          <li>如非本人操作，请忽略此邮件</li>
        </ul>
      </div>

      <div class="message">
        祝您使用愉快！<br>
        国风刺绣艺术网团队
      </div>
    </div>

    <!-- 邮件页脚 -->
    <div class="email-footer">
      <div class="logo">千针万线 · 传承匠心</div>
      <p>
        这是一封系统自动发送的邮件，请勿直接回复。<br>
        如有疑问，请联系客服：<a href="mailto:support@example.com">support@example.com</a>
      </p>
      <p style="color: #a89f8a; font-size: 12px; margin-top: 20px;">
        © 2025 国风刺绣艺术网 · 保留所有权利
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * 发送欢迎邮件（注册成功后）
 */
export async function sendWelcomeEmail(to: string, username?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; font-family: 'PingFang SC', sans-serif; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #d4a574, #c9954d); padding: 40px; text-align: center; color: #fff; }
    .body { padding: 40px; }
    h1 { margin: 0; font-size: 28px; }
    p { font-size: 16px; line-height: 1.8; color: #6b6350; }
    .footer { background: #3d3020; color: #f5f0e6; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 欢迎加入国风刺绣艺术网！</h1>
    </div>
    <div class="body">
      <p>亲爱的 ${username || '用户'}，</p>
      <p>恭喜您成功注册国风刺绣艺术网！您已经开启了探索中华传统刺绣艺术的精彩旅程。</p>
      <p>在这里，您可以：</p>
      <ul>
        <li>欣赏精美的刺绣作品</li>
        <li>了解四大名绣的历史与文化</li>
        <li>收藏您喜爱的作品</li>
        <li>探索千年刺绣的传承之美</li>
      </ul>
      <p>祝您使用愉快！</p>
    </div>
    <div class="footer">
      <p>千针万线 · 传承匠心</p>
      <p style="color: #a89f8a; font-size: 12px;">© 2025 国风刺绣艺术网</p>
    </div>
  </div>
</body>
</html>
    `

    const { data, error } = await resend.emails.send({
      from: import.meta.env.VITE_EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: '🎉 欢迎加入国风刺绣艺术网',
      html: html
    })

    if (error) {
      console.error('发送欢迎邮件失败:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ 欢迎邮件发送成功:', data)
    return { success: true }
  } catch (error: any) {
    console.error('发送欢迎邮件异常:', error)
    return { success: false, error: error.message }
  }
}
