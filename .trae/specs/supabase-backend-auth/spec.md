# Supabase 后端集成 & 登录认证 Spec

## Why
当前打卡系统使用 localStorage 存储数据，无法跨设备同步且无用户认证机制。需要接入 Supabase 作为后端，实现用户登录认证、数据持久化到云端数据库，使其成为完整的前后端一体 Web 应用。

## What Changes
- 安装并配置 `@supabase/supabase-js` 客户端 SDK
- 创建 Supabase 客户端初始化模块，包含环境变量配置
- 新增 React Auth Context，管理用户登录状态
- 新增登录页面 (`LoginPage.tsx`) 和注册页面 (`RegisterPage.tsx`)
- 替换 `App.tsx` 中所有 localStorage 操作为 Supabase 数据库操作
- 登录成功后加载用户专属的 Tasks 和 CheckIns 数据
- 移除 localStorage 相关的初始化/持久化逻辑
- 保留首次登录后的示例数据注入（写入 Supabase）
- 添加退出登录按钮

## Impact
- Affected specs: N/A (首次后端集成)
- Affected code:
  - `src/main.tsx` — 包裹 AuthProvider
  - `src/app/App.tsx` — 数据源从 localStorage 切换到 Supabase
  - `src/app/utils.ts` — 移除 localStorage 相关，保留纯工具函数
  - `src/app/types.ts` — Task/CheckIn 类型可保持不变
  - `package.json` — 新增 supabase-js 依赖
  - 新增文件: `src/app/lib/supabase.ts`, `src/app/contexts/AuthContext.tsx`, `src/app/pages/LoginPage.tsx`, `src/app/pages/RegisterPage.tsx`
  - `.env` — Supabase URL 和 anon key

## ADDED Requirements

### Requirement: Supabase 客户端初始化
系统 SHALL 初始化 Supabase 客户端，通过环境变量 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 配置连接。

#### Scenario: 环境变量正确配置
- **WHEN** 应用启动时
- **THEN** Supabase 客户端实例被创建并可被其他模块引用

#### Scenario: 环境变量缺失
- **WHEN** 未配置 Supabase 环境变量
- **THEN** 构建或运行时报错提示

### Requirement: 用户认证系统
系统 SHALL 提供用户注册和登录功能，通过 Supabase Auth 实现邮箱密码认证。

#### Scenario: 用户注册
- **WHEN** 用户在注册页面输入邮箱和密码并提交
- **THEN** Supabase Auth 创建新用户，并自动登录进入主页面

#### Scenario: 用户登录
- **WHEN** 用户在登录页面输入正确的邮箱和密码并提交
- **THEN** 系统验证身份后跳转到打卡主页面

#### Scenario: 登录失败
- **WHEN** 用户输入错误的邮箱或密码
- **THEN** 显示错误提示信息

#### Scenario: 未登录访问
- **WHEN** 用户未登录直接访问打卡主页面
- **THEN** 自动重定向到登录页面

#### Scenario: 已登录访问登录页
- **WHEN** 已登录用户访问登录页面
- **THEN** 自动重定向到打卡主页面

#### Scenario: 退出登录
- **WHEN** 用户点击退出按钮
- **THEN** 清除登录状态并跳转到登录页面

### Requirement: Tasks 数据 CRUD 对接 Supabase
系统 SHALL 将 Task 的增删改查操作从 localStorage 迁移到 Supabase `tasks` 表，所有操作关联当前登录用户。

#### Scenario: 加载任务列表
- **WHEN** 用户登录后进入主页面
- **THEN** 系统从 Supabase 加载该用户的所有任务并显示。如果是首次登录且无任务，自动注入默认示例任务。

#### Scenario: 创建新任务
- **WHEN** 用户新增任务
- **THEN** 任务数据写入 Supabase `tasks` 表（含 user_id），并实时显示在列表中

#### Scenario: 编辑任务
- **WHEN** 用户编辑任务名称或描述
- **THEN** 更新 Supabase 中对应记录，UI 同步更新

#### Scenario: 删除任务
- **WHEN** 用户删除任务
- **THEN** 从 Supabase 中软性或硬性删除该任务记录，UI 同步移除（历史打卡记录保留）

### Requirement: CheckIns 数据对接 Supabase
系统 SHALL 将打卡记录的存储和读取从 localStorage 迁移到 Supabase `checkins` 表。

#### Scenario: 加载打卡记录
- **WHEN** 用户登录后进入主页面
- **THEN** 系统从 Supabase 加载该用户的所有打卡记录

#### Scenario: 执行打卡
- **WHEN** 用户对某任务执行打卡操作
- **THEN** 打卡记录写入 Supabase `checkins` 表，统计数据（热力图、连续天数等）实时更新

#### Scenario: 防止重复打卡
- **WHEN** 用户尝试在同一天对同一任务再次打卡
- **THEN** 系统阻止操作（前端 guard + 后端 DB 约束均可）

### Requirement: 首次登录示例数据注入
系统 SHALL 在用户首次登录且 tasks 表为空时，自动创建默认示例任务和示例打卡记录。

#### Scenario: 首次登录
- **WHEN** 用户注册后第一次进入主页面
- **THEN** 系统自动创建默认任务（晨间冥想、阅读、运动健身）及示例打卡数据写入 Supabase

#### Scenario: 已有数据用户
- **WHEN** 用户已有任务数据再次登录
- **THEN** 直接加载已有数据，不重复注入示例数据
