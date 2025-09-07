# 股票数据面板

基于 Next.js + Supabase + Vercel 的现代化股票数据收集与可视化系统。

## 🏗️ 架构概览

- **数据收集**: GitHub Actions + Python + pywencai (同花顺API)
- **数据存储**: Supabase PostgreSQL
- **前端界面**: Next.js 14 + TypeScript + Tailwind CSS
- **部署平台**: Vercel (自动部署)

## 🚀 快速开始

### 1. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入你的 Supabase 配置
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 3. 部署到 Vercel

1. 将项目推送到 GitHub
2. 连接 GitHub 仓库到 Vercel
3. 在 Vercel 中配置环境变量
4. 自动部署完成

## 📊 功能特性

- ✅ **实时数据展示**: 股票价格、涨跌幅、市盈率等关键指标
- ✅ **统计面板**: 总股票数、涨跌分布、平均涨跌幅
- ✅ **历史数据查询**: 按日期筛选历史股票数据
- ✅ **响应式设计**: 支持桌面端和移动端
- ✅ **自动化更新**: 工作日自动获取最新数据

## 🔧 开发说明

### 项目结构
```
├── pages/           # Next.js 页面和 API 路由
├── components/      # React 组件
├── lib/            # 工具函数和类型定义
├── styles/         # 全局样式
├── .github/        # GitHub Actions 工作流
└── Python 脚本     # 数据收集相关文件
```

### 主要命令
```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run start    # 生产服务器
npm run lint     # 代码检查
```

## 📈 数据流程

1. **GitHub Actions** (工作日上午) → 获取同花顺股票数据
2. **Supabase** → 存储股票数据
3. **Next.js** → 从数据库读取并展示数据
4. **Vercel** → 向用户提供 Web 服务

## ⚙️ 配置说明

详细的配置和部署说明请查看 [CLAUDE.md](./CLAUDE.md)。

## 📞 支持

如有问题，请查看项目的 Issues 或创建新的 Issue。