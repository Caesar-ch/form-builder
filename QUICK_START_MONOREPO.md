# 表单构建器 Monorepo 快速开始指南

## 🚀 快速开始

### 方式一：从现有项目迁移（推荐）

如果你已经有现有的表单构建器项目，可以使用迁移脚本：

```bash
# 1. 确保在项目根目录
cd formbuilder-app

# 2. 运行迁移脚本
chmod +x scripts/migrate-to-monorepo.sh
./scripts/migrate-to-monorepo.sh

# 3. 安装依赖
pnpm install

# 4. 启动开发服务器
pnpm dev
```

### 方式二：从零开始创建

如果你想从零开始创建新的 Monorepo 项目：

```bash
# 1. 创建新目录
mkdir formbuilder-monorepo
cd formbuilder-monorepo

# 2. 下载并运行设置脚本
curl -O https://raw.githubusercontent.com/your-repo/formbuilder-app/main/scripts/setup-monorepo.sh
chmod +x setup-monorepo.sh
./setup-monorepo.sh

# 3. 安装依赖
pnpm install

# 4. 启动开发服务器
pnpm dev
```

## 📁 项目结构概览

```
formbuilder-monorepo/
├── packages/                    # 核心包
│   ├── core/                   # 类型定义和核心逻辑
│   ├── ui/                     # 基础UI组件
│   ├── layout-engine/          # 布局引擎
│   ├── property-panel/         # 属性面板
│   ├── component-library/      # 组件库
│   └── form-builder/           # 主构建器
├── apps/                       # 应用层
│   └── web/                    # Web应用
├── tools/                      # 工具包
└── docs/                       # 文档
```

## 🛠️ 开发命令

### 基础命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建所有包
pnpm build

# 清理构建文件
pnpm clean

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

### 包管理命令

```bash
# 构建特定包
pnpm build:core
pnpm build:ui

# 为特定包添加依赖
pnpm add react --filter @formbuilder/ui

# 添加内部依赖
pnpm add @formbuilder/core --filter @formbuilder/ui

# 添加开发依赖到根目录
pnpm add -w -D typescript
```

### 开发特定包

```bash
# 开发 core 包
cd packages/core
pnpm dev

# 开发 ui 包
cd packages/ui
pnpm dev

# 开发 Web 应用
cd apps/web
pnpm dev
```

## 📦 包说明

### @formbuilder/core
- **职责**: 提供基础类型定义、工具函数和核心逻辑
- **包含**: 类型定义、核心Hooks、工具函数、常量
- **依赖**: 无外部依赖

### @formbuilder/ui
- **职责**: 提供可复用的基础UI组件
- **包含**: 基础组件、布局组件、表单组件
- **依赖**: `@formbuilder/core`, `react`, `react-dom`

### @formbuilder/layout-engine
- **职责**: 处理布局渲染和网格管理
- **包含**: 布局渲染器、网格系统、拖拽处理
- **依赖**: `@formbuilder/core`, `react-grid-layout`

### @formbuilder/property-panel
- **职责**: 提供属性编辑和配置管理
- **包含**: 属性面板、属性编辑器、验证器
- **依赖**: `@formbuilder/core`, `@formbuilder/ui`

### @formbuilder/component-library
- **职责**: 管理组件模板和预览
- **包含**: 组件库、组件模板、分类管理
- **依赖**: `@formbuilder/core`, `@formbuilder/ui`

### @formbuilder/form-builder
- **职责**: 整合所有模块，提供完整的构建器功能
- **包含**: 主构建器、状态管理、事件系统
- **依赖**: 所有其他包

## 🔧 开发工作流

### 1. 添加新组件

```bash
# 1. 在 ui 包中添加基础组件
cd packages/ui/src/components
# 创建新组件文件

# 2. 更新 ui 包的导出
echo "export { NewComponent } from './NewComponent';" >> packages/ui/src/index.ts

# 3. 在 form-builder 中使用
# 在 packages/form-builder/src/FormBuilder.tsx 中导入使用
```

### 2. 添加新功能

```bash
# 1. 在 core 包中添加类型定义
cd packages/core/src
# 添加新的类型定义

# 2. 在相关包中实现功能
# 根据功能性质选择对应的包

# 3. 更新依赖关系
# 在需要使用的包中添加依赖
```

### 3. 调试特定包

```bash
# 1. 进入包目录
cd packages/ui

# 2. 启动包的开发模式
pnpm dev

# 3. 在另一个终端启动应用
cd ../../apps/web
pnpm dev
```

## 🚀 部署

### 构建生产版本

```bash
# 构建所有包
pnpm build

# 构建 Web 应用
cd apps/web
pnpm build
```

### 发布包到 NPM

```bash
# 1. 登录 NPM
npm login

# 2. 发布包
pnpm --filter @formbuilder/core publish
pnpm --filter @formbuilder/ui publish
# ... 其他包
```

## 🔍 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

2. **构建失败**
   ```bash
   # 检查 TypeScript 配置
   pnpm type-check
   
   # 清理后重新构建
   pnpm clean
   pnpm build
   ```

3. **包导入错误**
   ```bash
   # 检查 tsconfig.json 中的路径映射
   # 确保包之间的依赖关系正确
   ```

### 调试技巧

1. **查看包依赖关系**
   ```bash
   pnpm list --depth=0
   ```

2. **检查包构建输出**
   ```bash
   ls -la packages/*/dist/
   ```

3. **查看包大小**
   ```bash
   pnpm --filter @formbuilder/core exec size-limit
   ```

## 📚 更多资源

- [Monorepo 架构设计文档](./MONOREPO_ARCHITECTURE.md)
- [表单构建器架构文档](./FORM_BUILDER_ARCHITECTURE.md)
- [pnpm 官方文档](https://pnpm.io/)
- [Rollup 构建配置](https://rollupjs.org/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
