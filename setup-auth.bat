@echo off
chcp 65001 >nul
echo =========================================
echo   刺绣艺术网站 - Supabase 认证系统配置
echo =========================================
echo.

REM 1. 备份原文件
echo 📁 步骤 1: 备份原文件...
if exist "src\views\ProfileView.vue" (
    copy "src\views\ProfileView.vue" "src\views\ProfileView_backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.vue" >nul 2>&1
    echo ✅ 已备份原 ProfileView.vue
)

REM 2. 替换为新文件
echo.
echo 🔄 步骤 2: 更新 ProfileView.vue...
if exist "src\views\ProfileView_new.vue" (
    move /Y "src\views\ProfileView_new.vue" "src\views\ProfileView.vue" >nul 2>&1
    echo ✅ 已更新 ProfileView.vue
) else (
    echo ❌ 找不到 ProfileView_new.vue
)

REM 3. 创建环境变量文件
echo.
echo ⚙️  步骤 3: 配置环境变量...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul 2>&1
        echo ✅ 已创建 .env 文件
    )
) else (
    echo ℹ️  .env 文件已存在，跳过
)

REM 4. 检查依赖
echo.
echo 📦 步骤 4: 检查依赖包...
findstr /C:"@supabase/supabase-js" package.json >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Supabase 依赖已安装
) else (
    echo ⚠️  正在安装 Supabase 依赖...
    call npm install @supabase/supabase-js
)

echo.
echo =========================================
echo   ✨ 配置完成！
echo =========================================
echo.
echo 📋 下一步操作:
echo.
echo 1. 在 Supabase 后台执行 SQL 迁移：
echo    文件: supabase_migration.sql
echo    地址: https://supabase.com/dashboard/project/rrllyueeclyybjlkautq/sql
echo.
echo 2. 启动开发服务器：
echo    npm run dev
echo.
echo 3. 访问个人中心页面测试：
echo    http://localhost:5173/profile
echo.
echo 📖 详细文档请查看: SUPABASE_SETUP.md
echo.
pause
