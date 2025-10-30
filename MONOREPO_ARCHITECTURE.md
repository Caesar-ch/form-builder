# 表单构建器 Monorepo 架构设计

## 🎯 项目拆包策略

基于功能模块和职责边界，将单体项目拆分为多个独立的包，使用 pnpm workspace 进行统一管理。

## 📁 目录结构

```
formbuilder-monorepo/
├── packages/
│   ├── core/                    # 核心包
│   │   ├── src/
│   │   │   ├── types/          # 类型定义
│   │   │   ├── hooks/          # 核心Hooks
│   │   │   ├── utils/          # 工具函数
│   │   │   └── constants/      # 常量定义
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                      # UI组件包
│   │   ├── src/
│   │   │   ├── components/     # 基础UI组件
│   │   │   ├── layouts/        # 布局组件
│   │   │   ├── forms/          # 表单组件
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── form-builder/            # 表单构建器核心
│   │   ├── src/
│   │   │   ├── components/     # 构建器组件
│   │   │   ├── hooks/          # 构建器Hooks
│   │   │   ├── templates/      # 组件模板
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── layout-engine/           # 布局引擎
│   │   ├── src/
│   │   │   ├── renderer/       # 渲染器
│   │   │   ├── grid/           # 网格系统
│   │   │   ├── overlay/        # 覆盖层管理
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── property-panel/          # 属性面板
│   │   ├── src/
│   │   │   ├── components/     # 属性编辑器
│   │   │   ├── configs/        # 属性配置
│   │   │   ├── validators/     # 验证器
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── component-library/       # 组件库
│   │   ├── src/
│   │   │   ├── templates/      # 组件模板
│   │   │   ├── categories/     # 分类管理
│   │   │   ├── previews/       # 预览组件
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── examples/                # 示例应用
│   │   ├── basic/              # 基础示例
│   │   ├── advanced/           # 高级示例
│   │   └── playground/         # 在线演示
│   │
│   └── docs/                    # 文档包
│       ├── src/
│       ├── package.json
│       └── docusaurus.config.js
│
├── apps/                        # 应用层
│   ├── web/                     # Web应用
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── desktop/                 # 桌面应用（可选）
│       ├── src/
│       ├── package.json
│       └── electron.config.js
│
├── tools/                       # 工具包
│   ├── build/                   # 构建工具
│   ├── lint/                    # 代码检查
│   ├── test/                    # 测试工具
│   └── scripts/                 # 脚本工具
│
├── pnpm-workspace.yaml          # pnpm workspace配置
├── package.json                 # 根package.json
├── pnpm-lock.yaml              # 锁文件
├── .gitignore
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## 📦 包职责划分

### 1. @formbuilder/core - 核心包
**职责**: 提供基础类型定义、工具函数和核心逻辑

```json
{
  "name": "@formbuilder/core",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./hooks": {
      "import": "./dist/hooks/index.js",
      "types": "./dist/hooks/index.d.ts"
    }
  }
}
```

**包含内容**:
- 类型定义 (`ComponentConfig`, `LayoutData`, `EditorState`)
- 核心Hooks (`useFormBuilder`, `useSelection`)
- 工具函数 (`generateId`, `deepMerge`, `validateConfig`)
- 常量定义 (`DEFAULT_LAYOUT`, `COMPONENT_TYPES`)

### 2. @formbuilder/ui - UI组件包
**职责**: 提供可复用的基础UI组件

```json
{
  "name": "@formbuilder/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

**包含内容**:
- 基础组件 (`Button`, `Input`, `Text`, `Image`, `Container`)
- 布局组件 (`Grid`, `Flex`, `Stack`)
- 表单组件 (`Form`, `Field`, `ValidationMessage`)
- 通用组件 (`Modal`, `Tooltip`, `Loading`)

### 3. @formbuilder/layout-engine - 布局引擎
**职责**: 处理布局渲染和网格管理

```json
{
  "name": "@formbuilder/layout-engine",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "react-grid-layout": "^1.5.2"
  }
}
```

**包含内容**:
- 布局渲染器 (`LayoutRenderer`)
- 网格系统 (`GridSystem`, `GridCalculator`)
- 覆盖层管理 (`OverlayManager`)
- 拖拽处理 (`DragHandler`, `ResizeHandler`)

### 4. @formbuilder/property-panel - 属性面板
**职责**: 提供属性编辑和配置管理

```json
{
  "name": "@formbuilder/property-panel",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "@formbuilder/ui": "workspace:*"
  }
}
```

**包含内容**:
- 属性面板 (`PropertyPanel`)
- 属性编辑器 (`TextEditor`, `ColorEditor`, `SelectEditor`)
- 属性配置 (`PropertyConfigs`, `ValidationRules`)
- 表单验证 (`Validators`, `ValidationEngine`)

### 5. @formbuilder/component-library - 组件库
**职责**: 管理组件模板和预览

```json
{
  "name": "@formbuilder/component-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "@formbuilder/ui": "workspace:*"
  }
}
```

**包含内容**:
- 组件库 (`ComponentLibrary`)
- 组件模板 (`ComponentTemplates`)
- 分类管理 (`CategoryManager`)
- 预览组件 (`PreviewComponents`)

### 6. @formbuilder/form-builder - 表单构建器核心
**职责**: 整合所有模块，提供完整的构建器功能

```json
{
  "name": "@formbuilder/form-builder",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "@formbuilder/ui": "workspace:*",
    "@formbuilder/layout-engine": "workspace:*",
    "@formbuilder/property-panel": "workspace:*",
    "@formbuilder/component-library": "workspace:*"
  }
}
```

**包含内容**:
- 主构建器 (`FormBuilder`)
- 状态管理 (`FormBuilderStore`)
- 事件系统 (`EventBus`)
- 插件系统 (`PluginManager`)

## 🛠️ 实施步骤

### 第一步: 初始化 Monorepo

```bash
# 创建根目录
mkdir formbuilder-monorepo
cd formbuilder-monorepo

# 初始化 pnpm workspace
pnpm init

# 创建 pnpm-workspace.yaml
cat > pnpm-workspace.yaml << EOF
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'
EOF
```

### 第二步: 创建包结构

```bash
# 创建包目录
mkdir -p packages/{core,ui,form-builder,layout-engine,property-panel,component-library}
mkdir -p apps/web tools/{build,lint,test,scripts}

# 为每个包初始化 package.json
for pkg in core ui form-builder layout-engine property-panel component-library; do
  cd packages/$pkg
  pnpm init
  cd ../..
done
```

### 第三步: 配置 TypeScript

```bash
# 根目录 tsconfig.json
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@formbuilder/core": ["./packages/core/src"],
      "@formbuilder/ui": ["./packages/ui/src"],
      "@formbuilder/layout-engine": ["./packages/layout-engine/src"],
      "@formbuilder/property-panel": ["./packages/property-panel/src"],
      "@formbuilder/component-library": ["./packages/component-library/src"],
      "@formbuilder/form-builder": ["./packages/form-builder/src"]
    }
  },
  "include": ["packages/*/src", "apps/*/src"],
  "exclude": ["node_modules", "dist", "build"]
}
EOF
```

### 第四步: 配置构建工具

```bash
# 安装构建依赖
pnpm add -w -D typescript @types/node rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-dts

# 创建构建脚本
cat > tools/build/rollup.config.js << EOF
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

const external = ['react', 'react-dom', 'react-grid-layout'];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/]
  }
];
EOF
```

### 第五步: 配置脚本

```json
// 根目录 package.json
{
  "name": "formbuilder-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "build:core": "pnpm --filter @formbuilder/core build",
    "build:ui": "pnpm --filter @formbuilder/ui build",
    "build:all": "pnpm -r --parallel build",
    "dev": "pnpm --filter @formbuilder/web dev",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "clean": "pnpm -r clean",
    "type-check": "pnpm -r type-check",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.2",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0"
  }
}
```

## 🔧 包间依赖关系

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

## 📋 迁移清单

### 从现有项目迁移

1. **类型定义迁移**
   ```bash
   # 移动类型定义到 core 包
   mv src/types/FormBuilder.ts packages/core/src/types/
   ```

2. **Hooks迁移**
   ```bash
   # 移动核心Hooks到 core 包
   mv src/hooks/useFormBuilder.tsx packages/core/src/hooks/
   ```

3. **组件迁移**
   ```bash
   # 移动UI组件到 ui 包
   mv src/components/ComponentRenderer.tsx packages/ui/src/components/
   
   # 移动构建器组件到 form-builder 包
   mv src/components/FormBuilder.tsx packages/form-builder/src/components/
   mv src/components/LayoutRenderer.tsx packages/layout-engine/src/
   mv src/components/PropertyPanel.tsx packages/property-panel/src/
   mv src/components/ComponentLibrary.tsx packages/component-library/src/
   ```

4. **应用迁移**
   ```bash
   # 移动应用到 apps 目录
   mv src/App.tsx apps/web/src/
   mv src/main.tsx apps/web/src/
   mv public/ apps/web/
   ```

## 🚀 开发工作流

### 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

### 包管理
```bash
# 添加依赖到特定包
pnpm add react --filter @formbuilder/ui

# 添加开发依赖到根目录
pnpm add -w -D typescript

# 添加内部依赖
pnpm add @formbuilder/core --filter @formbuilder/ui
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

### 1. 模块化优势
- ✅ **职责清晰**: 每个包有明确的职责边界
- ✅ **独立开发**: 不同团队可以并行开发不同包
- ✅ **按需使用**: 可以只使用需要的包，减少bundle大小

### 2. 维护优势
- ✅ **依赖管理**: 清晰的依赖关系，避免循环依赖
- ✅ **版本控制**: 独立的版本管理，支持语义化版本
- ✅ **测试隔离**: 每个包可以独立测试

### 3. 扩展优势
- ✅ **插件系统**: 易于扩展新功能
- ✅ **多平台**: 支持Web、桌面、移动端
- ✅ **生态建设**: 可以单独发布和维护包

## 🎯 总结

通过这种monorepo架构，你可以：

1. **提高开发效率**: 模块化开发，并行工作
2. **优化构建性能**: 按需构建，增量更新
3. **简化依赖管理**: 统一管理，避免版本冲突
4. **支持多平台**: 一套核心，多端复用
5. **便于维护**: 清晰的架构，易于理解和维护

这种架构特别适合大型项目，能够很好地支持团队协作和长期维护！
