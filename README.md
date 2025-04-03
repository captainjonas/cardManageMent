# 任务看板应用

一个基于 Next.js 和 Tailwind CSS 构建的拖拽式任务看板应用，支持跨列拖拽和任务排序。

## 特性

- ✨ 美观的现代界面设计
- 🎯 直观的拖拽交互
- 📱 响应式布局
- 🎨 任务卡片自动配色
- ⚡️ 实时任务排序
- 🔄 跨列拖拽支持
- ✅ 完整的单元测试覆盖

## 快速开始

确保你已安装:
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本
- make

### 使用 make

```bash
# 显示所有可用命令
make help

# 仅安装依赖
make install
```

Note: If the downloading speed is too slow for 'npm install', please change to domestic mirror:
```bash
npm config set registry https://registry.npmmirror.com
```
```bash
# 安装依赖并启动开发服务器
make start

# 构建生产版本
make build

# 清理项目
make clean

# 运行测试
make test

# 以监视模式运行测试
make test-watch

# 生成测试覆盖率报告
make test-coverage
```

## 开发

启动开发服务器后，访问 http://localhost:3000 查看应用。

### 项目结构

```
.
├── __tests__/     # 测试文件
│   ├── components/  # 组件测试
│   ├── pages/      # 页面测试
│   └── utils/      # 工具函数测试
├── components/    # React 组件
├── pages/         # Next.js 页面
├── styles/        # 全局样式和 Tailwind 配置
├── utils/         # 工具函数
└── types.ts       # TypeScript 类型定义
```

## 测试

项目使用 Jest 和 React Testing Library 进行测试：

- `npm test`: 运行所有测试
- `npm run test:watch`: 以监视模式运行测试
- `npm run test:coverage`: 生成测试覆盖率报告

测试文件位于 `tests` 目录下，按类型分类：
- `tests/unit/components/`: 组件测试

测试文件命名规范：
- `ComponentName.test.tsx`: 组件测试文件
- `ComponentName.test.ts`: 工具函数测试文件

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [@dnd-kit](https://dndkit.com/) - 拖拽功能
- TypeScript - 类型安全
- Jest - 测试框架
- React Testing Library - React 测试工具

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

MIT
