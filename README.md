# PokaStudy - 习惯打卡管理系统

<p align="center">
  <img src="https://img.shields.io/badge/PokaStudy-时光有痕，不负朝夕-10b981?style=for-the-badge" alt="PokaStudy" />
</p>

> **时光有痕，不负朝夕** —— 一个基于 React + Supabase 的个人习惯打卡追踪系统。

## ✨ 功能特性

- 🔐 **用户认证** — 基于 Supabase Auth 的邮箱密码登录
- ✅ **打卡管理** — 创建/编辑/删除习惯任务，每日一键打卡
- 📊 **数据热力图** — 类似 GitHub 贡献图的 52 周打卡可视化
- 📈 **统计面板** — 连续打卡天数、累计打卡天数、月度次数、总次数
- 🎨 **精美 UI** — 响应式设计，流畅动效，打卡撒花动画
- ☁️ **云端同步** — 数据存储于 Supabase，多设备无缝同步

## 🖼️ 界面预览

```
┌─────────────────────────────────────────────────┐
│  PokaStudy    时光有痕，不负朝夕          🕐 用户 │
│─────────────────────────────────────────────────│
│  🔥连续打卡    📅累计天数    📆本月次数   ✅总次数  │
│─────────────────────────────────────────────────│
│  我的任务 [新增]  │   📊 打卡热力图                │
│  ┌─────────────┐  │  ░░░░░░░░░░░░░░░░░░░░░░░  │
│  │ 晨间冥想     │  │  近期动态                     │
│  │ 阅读        │  │  昨天 → 晨间冥想 08:00       │
│  │ 运动健身     │  │  前天 → 阅读 21:30          │
│  └─────────────┘  │                              │
└─────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) >= 18
- [Supabase](https://supabase.com/) 账号（免费套餐即可）

### 1. 克隆项目

```bash
git clone https://github.com/Pokaboo/PokaStudy.git
cd PokaStudy
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

#### 3.1 创建 Supabase 项目

前往 [supabase.com/dashboard](https://supabase.com/dashboard) 创建一个新项目。

#### 3.2 获取 API 密钥

进入项目 → ⚙️ Settings → API，复制：
- **Project URL**（如 `https://xxx.supabase.co`）
- **anon public key**

#### 3.3 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 信息：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 3.4 创建数据库表

在 Supabase 控制台的 **SQL Editor** 中执行以下 SQL：

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  color TEXT DEFAULT '#10b981'
);

CREATE TABLE checkins (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  task_id TEXT NOT NULL,
  task_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  datetime TEXT NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their checkins" ON checkins
  FOR ALL USING (auth.uid() = user_id);
```

#### 3.5 启用邮箱登录

- Authentication → Providers → Email → **Enabled**
- Authentication → Settings → 关闭 **Enable email confirmations**（开发阶段推荐）

#### 3.6 创建用户

在 Authentication → Users → **Add User** 手动创建登录账号。

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173) 即可使用。

### 5. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到任意静态托管服务。

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| UI 框架 | Tailwind CSS 4 + Radix UI |
| 动画 | Motion (Framer Motion) |
| 图标 | Lucide React |
| 后端服务 | Supabase (Auth + Database + API) |
| 数据可视化 | 自研 Heatmap 组件 |
| 撒花效果 | canvas-confetti |

## 📁 项目结构

```
PokaStudy/
├── .env.example          # 环境变量模板
├── .gitignore
├── index.html            # 入口 HTML
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx          # React 入口
│   ├── app/
│   │   ├── App.tsx       # 主应用组件
│   │   ├── types.ts      # TypeScript 类型定义
│   │   ├── utils.ts      # 工具函数
│   │   ├── lib/
│   │   │   └── supabase.ts       # Supabase 客户端
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # 认证上下文
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx      # 登录页面
│   │   │   └── RegisterPage.tsx   # 注册页面
│   │   └── components/
│   │       ├── Clock.tsx          # 时钟组件
│   │       ├── HeatmapChart.tsx   # 热力图组件
│   │       ├── StatsBar.tsx       # 统计面板
│   │       ├── TaskSection.tsx    # 任务列表
│   │       └── ui/               # shadcn/ui 组件库
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
```

## 📄 License

MIT
