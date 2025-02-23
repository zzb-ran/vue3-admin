# Vue3 Admin 游戏模拟器

一个基于 Vue 3 和 Element Plus 的游戏模拟器管理系统，支持多种游戏ROM的在线模拟。

## 功能特性

- 🎮 支持多种游戏ROM格式
- 🎯 在线游戏模拟器
- 🔐 用户登录认证
- 📊 数据统计面板
- 💫 响应式设计
- 🌓 深色模式支持

## 技术栈

- Vue 3
- Vue Router
- Element Plus
- Vite
- EmulatorJS
- ECharts
- Axios

## 安装

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 目录结构

```
├── public/          # 静态资源
│   └── games/       # 游戏ROM和封面
├── src/             # 源代码
│   ├── components/  # 组件
│   ├── views/       # 页面
│   ├── router/      # 路由
│   ├── utils/       # 工具函数
│   └── mock/        # 模拟数据
└── vite.config.js   # Vite配置
```

## 使用说明

1. 游戏ROM文件请放置在 `public/games/roms` 目录下
2. 游戏封面图片请放置在 `public/games/covers` 目录下
3. 支持的ROM格式包括：.nes, .smc, .gba, .gb 等

## 开发

```bash
# 启动开发服务器
pnpm dev

# 预览生产构建
pnpm preview
```

## 部署

项目使用 GitHub Actions 进行自动化部署，每次推送到 main 分支时会自动构建并部署到 GitHub Pages。

## 许可证

[MIT](LICENSE)