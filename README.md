# Builder Brain

为独立开发者和 AI Builder 设计的产品灵感工具。

## 简介

Builder Brain 是一个 AI 驱动的产品创意生成器。输入你感兴趣的方向，AI 将分析市场趋势、竞争格局和用户痛点，为你生成可落地的产品方案。

## 功能特性

- **智能创意生成** - 基于 AI 分析市场趋势、竞争格局，生成完整的产品方案
- **MVP 计划** - 每个创意都包含具体可执行的最小可行产品计划
- **变现路径** - 从 0 到 1 的商业化建议
- **风险评估** - 风险提示和竞争格局分析
- **收藏管理** - 登录后可收藏感兴趣的创意
- **搜索历史** - 记录你的探索历程

## 技术栈

- **前端**: Next.js 14 (Pages Router) + React 18
- **UI 设计**: AI SaaS 高级感设计系统 (Calm Tech)
- **AI 模型**: SiliconFlow API (Qwen2.5-7B-Instruct)
- **数据库**: Supabase (Auth + PostgreSQL)
- **部署**: Vercel

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
git clone https://github.com/chikuaidangao/builder-brain.git
cd builder-brain
npm install
```

### 环境变量

创建 `.env.local` 文件：

```env
SILICONFLOW_API_KEY=your_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 运行

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
builder-brain/
├── components/
│   └── IdeaCard.jsx      # 创意卡片组件
├── lib/
│   └── supabase.js       # Supabase 客户端
├── pages/
│   ├── api/
│   │   └── generate.js   # AI 生成 API
│   ├── _app.js
│   ├── _document.js
│   └── index.jsx         # 主页面
├── styles/
│   └── globals.css
└── package.json
```

## 在线访问

https://workspace-six-delta-85.vercel.app

## License

MIT
