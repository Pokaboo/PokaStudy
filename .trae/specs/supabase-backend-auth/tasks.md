# Tasks

- [x] Task 1: 安装依赖 & 创建 Supabase 客户端模块
  - [x] 安装 `@supabase/supabase-js` 依赖
  - [x] 创建 `src/app/lib/supabase.ts`，初始化并导出 Supabase 客户端实例
  - [x] 创建 `.env` 文件，添加 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 占位变量

- [x] Task 2: 创建 Auth Context 认证上下文
  - [x] 创建 `src/app/contexts/AuthContext.tsx`，封装用户状态（session/user）、登录、注册、退出方法
  - [x] 在 `src/main.tsx` 中用 AuthProvider 包裹 App 组件

- [x] Task 3: 创建登录和注册页面
  - [x] 创建 `src/app/pages/LoginPage.tsx`，包含邮箱密码登录表单、跳转注册链接、错误提示、加载状态
  - [x] 创建 `src/app/pages/RegisterPage.tsx`，包含邮箱密码注册表单、跳转登录链接、错误提示、加载状态
  - [x] 更新 `App.tsx` 入口逻辑：根据认证状态决定渲染登录页还是打卡主页

- [x] Task 4: 重构 App.tsx 数据层，对接 Supabase
  - [x] 在 App.tsx 中移除 localStorage 存储/读取逻辑
  - [x] 登录后从 Supabase `tasks` 表加载用户任务列表
  - [x] 登录后从 Supabase `checkins` 表加载用户打卡记录列表
  - [x] CRUD 操作改为调用 Supabase API 进行增删改
  - [x] 首次登录无数据时，自动注入默认示例任务和示例打卡数据到 Supabase
  - [x] 在 header 区域添加用户邮箱显示和退出登录按钮

- [x] Task 5: 验证 & 测试前后端联通
  - [x] 确认 `npm run dev` 正常启动
  - [x] 确认 `npm run build` 构建成功无类型错误
  - [x] 确认登录注册流程完整可用
  - [x] 确认新建任务、编辑任务、删除任务均可正常同步到 Supabase
  - [x] 确认打卡操作可正常写入 Supabase 并刷新统计
  - [x] 确认退出登录后状态清除

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 依赖 Task 2, Task 3
- Task 5 依赖 Task 4
