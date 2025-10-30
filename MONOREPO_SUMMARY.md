# 表单构建器 Monorepo 拆包方案总结

## 🎯 拆包目标

将现有的单体表单构建器项目拆分为多个独立的包，使用 pnpm workspace 进行统一管理，实现：

- ✅ **模块化开发**: 每个包职责清晰，独立开发
- ✅ **按需使用**: 可以只使用需要的包，减少bundle大小
- ✅ **并行开发**: 不同团队可以并行开发不同包
- ✅ **独立版本**: 每个包可以独立版本管理和发布
- ✅ **依赖管理**: 清晰的依赖关系，避免循环依赖

## 📦 包划分方案

### 核心包 (Core Packages)

| 包名 | 职责 | 依赖 | 包含内容 |
|------|------|------|----------|
| `@formbuilder/core` | 基础类型和核心逻辑 | 无 | 类型定义、Hooks、工具函数、常量 |
| `@formbuilder/ui` | 基础UI组件 | `@formbuilder/core` | 基础组件、布局组件、表单组件 |
| `@formbuilder/layout-engine` | 布局渲染引擎 | `@formbuilder/core`, `react-grid-layout` | 布局渲染器、网格系统、拖拽处理 |
| `@formbuilder/property-panel` | 属性编辑面板 | `@formbuilder/core`, `@formbuilder/ui` | 属性面板、编辑器、验证器 |
| `@formbuilder/component-library` | 组件库管理 | `@formbuilder/core`, `@formbuilder/ui` | 组件模板、分类管理、预览 |
| `@formbuilder/form-builder` | 主构建器 | 所有其他包 | 主构建器、状态管理、事件系统 |

### 应用层 (Applications)

| 应用名 | 平台 | 用途 |
|--------|------|------|
| `@formbuilder/web` | Web | 基于React的Web应用 |
| `@formbuilder/desktop` | Electron | 桌面应用（可选） |

### 工具包 (Tools)

| 工具名 | 用途 |
|--------|------|
| `@formbuilder/build` | 构建工具和配置 |
| `@formbuilder/lint` | 代码检查和格式化 |
| `@formbuilder/test` | 测试工具和配置 |

## 🏗️ 目录结构

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
│   ├── web/                    # Web应用
│   └── desktop/                # 桌面应用（可选）
├── tools/                      # 工具包
│   ├── build/                  # 构建工具
│   ├── lint/                   # 代码检查
│   └── test/                   # 测试工具
├── docs/                       # 文档
├── scripts/                    # 脚本工具
├── pnpm-workspace.yaml         # pnpm workspace配置
├── package.json                # 根package.json
└── tsconfig.json               # 根TypeScript配置
```

## 🔄 依赖关系图

```mermaid
graph TD
    A[@formbuilder/core] --> B[@formbuilder/ui]
    A --> C[@formbuilder/layout-engine]
    A --> D[@formbuilder/property-panel]
    A --> E[@formbuilder/component-library]
    
    B --> F[@formbuilder/form-builder]
    C --> F
    D --> F
    E --> F
    
    F --> G[@formbuilder/web]
    
    H[react-grid-layout] --> C
    I[react] --> B
    I --> C
    I --> D
    I --> E
    I --> F
```

## 🛠️ 实施步骤

### 第一步：环境准备
```bash
# 1. 安装 pnpm
npm install -g pnpm

# 2. 创建项目目录
mkdir formbuilder-monorepo
cd formbuilder-monorepo
```

### 第二步：运行设置脚本
```bash
# 从现有项目迁移
./scripts/migrate-to-monorepo.sh

# 或从零开始创建
./scripts/setup-monorepo.sh
```

### 第三步：验证设置
```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 启动开发服务器
pnpm dev
```

## 📋 迁移清单

### 文件迁移映射

| 原路径 | 新路径 | 包名 |
|--------|--------|------|
| `src/types/FormBuilder.ts` | `packages/core/src/types.ts` | `@formbuilder/core` |
| `src/hooks/useFormBuilder.tsx` | `packages/core/src/hooks.tsx` | `@formbuilder/core` |
| `src/components/ComponentRenderer.tsx` | `packages/ui/src/ComponentRenderer.tsx` | `@formbuilder/ui` |
| `src/components/LayoutRenderer.tsx` | `packages/layout-engine/src/LayoutRenderer.tsx` | `@formbuilder/layout-engine` |
| `src/components/PropertyPanel.tsx` | `packages/property-panel/src/PropertyPanel.tsx` | `@formbuilder/property-panel` |
| `src/components/ComponentLibrary.tsx` | `packages/component-library/src/ComponentLibrary.tsx` | `@formbuilder/component-library` |
| `src/components/FormBuilder.tsx` | `packages/form-builder/src/FormBuilder.tsx` | `@formbuilder/form-builder` |
| `src/App.tsx` | `apps/web/src/App.tsx` | `@formbuilder/web` |
| `src/main.tsx` | `apps/web/src/main.tsx` | `@formbuilder/web` |

### 导入路径更新

| 原导入 | 新导入 |
|--------|--------|
| `from '../types/FormBuilder'` | `from '@formbuilder/core'` |
| `from '../hooks/useFormBuilder'` | `from '@formbuilder/core'` |
| `from './ComponentRenderer'` | `from '@formbuilder/ui'` |
| `from './LayoutRenderer'` | `from '@formbuilder/layout-engine'` |
| `from './PropertyPanel'` | `from '@formbuilder/property-panel'` |
| `from './ComponentLibrary'` | `from '@formbuilder/component-library'` |
| `from './FormBuilder'` | `from '@formbuilder/form-builder'` |

## 🚀 开发工作流

### 日常开发
```bash
# 启动开发服务器
pnpm dev

# 构建特定包
pnpm build:core
pnpm build:ui

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

### 包管理
```bash
# 添加依赖到特定包
pnpm add react --filter @formbuilder/ui

# 添加内部依赖
pnpm add @formbuilder/core --filter @formbuilder/ui

# 添加开发依赖到根目录
pnpm add -w -D typescript
```

### 版本发布
```bash
# 创建变更集
pnpm changeset

# 版本升级
pnpm version-packages

# 发布包
pnpm release
```

## 📊 优势分析

### 开发效率
- ✅ **并行开发**: 不同团队可以同时开发不同包
- ✅ **独立测试**: 每个包可以独立测试和调试
- ✅ **按需构建**: 只构建修改的包，提高构建速度

### 维护性
- ✅ **职责清晰**: 每个包有明确的职责边界
- ✅ **依赖管理**: 清晰的依赖关系，避免循环依赖
- ✅ **版本控制**: 独立的版本管理，支持语义化版本

### 扩展性
- ✅ **插件系统**: 易于扩展新功能
- ✅ **多平台**: 支持Web、桌面、移动端
- ✅ **生态建设**: 可以单独发布和维护包

### 性能优化
- ✅ **按需加载**: 可以只加载需要的包
- ✅ **Tree Shaking**: 更好的代码分割和优化
- ✅ **缓存优化**: 独立的包可以独立缓存

## 🔧 工具链配置

### 构建工具
- **Rollup**: 用于构建各个包
- **TypeScript**: 类型检查和编译
- **ESBuild**: 快速构建和开发服务器

### 代码质量
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks
- **Lint-staged**: 暂存文件检查

### 测试工具
- **Jest**: 单元测试
- **Testing Library**: 组件测试
- **Cypress**: E2E测试

### 发布工具
- **Changesets**: 版本管理和发布
- **Semantic Release**: 自动化发布
- **NPM**: 包发布

## 📚 文档结构

```
docs/
├── architecture/           # 架构文档
├── api/                   # API文档
├── guides/                # 使用指南
├── examples/              # 示例代码
└── changelog/             # 更新日志
```

## 🎯 总结

通过这种 Monorepo 架构，我们实现了：

1. **模块化**: 清晰的包职责划分
2. **可维护**: 独立的版本管理和依赖管理
3. **可扩展**: 易于添加新功能和平台支持
4. **高性能**: 按需加载和构建优化
5. **团队协作**: 支持并行开发和独立发布

这种架构特别适合大型项目，能够很好地支持团队协作和长期维护！

## 📞 支持

如果你在实施过程中遇到问题，可以：

1. 查看 [快速开始指南](./QUICK_START_MONOREPO.md)
2. 查看 [详细架构文档](./MONOREPO_ARCHITECTURE.md)
3. 查看 [表单构建器架构](./FORM_BUILDER_ARCHITECTURE.md)
4. 提交 Issue 或 Pull Request
