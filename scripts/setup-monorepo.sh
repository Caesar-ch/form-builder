#!/bin/bash

# 表单构建器 Monorepo 设置脚本

set -e

echo "🚀 开始设置表单构建器 Monorepo..."

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm:"
    echo "npm install -g pnpm"
    exit 1
fi

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p packages/{core,ui,form-builder,layout-engine,property-panel,component-library}
mkdir -p apps/web
mkdir -p tools/{build,lint,test,scripts}
mkdir -p docs

# 创建 pnpm-workspace.yaml
echo "📝 创建 pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'
EOF

# 创建根目录 package.json
echo "📝 创建根目录 package.json..."
cat > package.json << 'EOF'
{
  "name": "formbuilder-monorepo",
  "version": "1.0.0",
  "private": true,
  "description": "表单构建器 Monorepo",
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
    "rollup-plugin-dts": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
EOF

# 创建根目录 tsconfig.json
echo "📝 创建根目录 tsconfig.json..."
cat > tsconfig.json << 'EOF'
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

# 为每个包创建 package.json
echo "📝 为每个包创建 package.json..."

# Core 包
cat > packages/core/package.json << 'EOF'
{
  "name": "@formbuilder/core",
  "version": "1.0.0",
  "description": "表单构建器核心包",
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
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# UI 包
cat > packages/ui/package.json << 'EOF'
{
  "name": "@formbuilder/ui",
  "version": "1.0.0",
  "description": "表单构建器UI组件包",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "@formbuilder/core": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Layout Engine 包
cat > packages/layout-engine/package.json << 'EOF'
{
  "name": "@formbuilder/layout-engine",
  "version": "1.0.0",
  "description": "表单构建器布局引擎",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "react-grid-layout": "^1.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Property Panel 包
cat > packages/property-panel/package.json << 'EOF'
{
  "name": "@formbuilder/property-panel",
  "version": "1.0.0",
  "description": "表单构建器属性面板",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "@formbuilder/ui": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Component Library 包
cat > packages/component-library/package.json << 'EOF'
{
  "name": "@formbuilder/component-library",
  "version": "1.0.0",
  "description": "表单构建器组件库",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "@formbuilder/ui": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Form Builder 包
cat > packages/form-builder/package.json << 'EOF'
{
  "name": "@formbuilder/form-builder",
  "version": "1.0.0",
  "description": "表单构建器核心包",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@formbuilder/core": "workspace:*",
    "@formbuilder/ui": "workspace:*",
    "@formbuilder/layout-engine": "workspace:*",
    "@formbuilder/property-panel": "workspace:*",
    "@formbuilder/component-library": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "rollup": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "rollup-plugin-dts": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Web App 包
cat > apps/web/package.json << 'EOF'
{
  "name": "@formbuilder/web",
  "version": "1.0.0",
  "description": "表单构建器Web应用",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@formbuilder/form-builder": "workspace:*",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
EOF

# 创建 rollup 配置文件
echo "📝 创建 rollup 配置文件..."
for pkg in core ui layout-engine property-panel component-library form-builder; do
  cat > packages/$pkg/rollup.config.js << 'EOF'
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
done

# 创建 tsconfig.json 文件
echo "📝 创建 tsconfig.json 文件..."
for pkg in core ui layout-engine property-panel component-library form-builder; do
  cat > packages/$pkg/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
done

# 创建 src 目录和基础文件
echo "📝 创建基础文件结构..."
for pkg in core ui layout-engine property-panel component-library form-builder; do
  mkdir -p packages/$pkg/src
  echo "export * from './index';" > packages/$pkg/src/index.ts
done

# 创建 Web 应用基础文件
echo "📝 创建 Web 应用基础文件..."
mkdir -p apps/web/src
cat > apps/web/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@formbuilder/core': '../../packages/core/src',
      '@formbuilder/ui': '../../packages/ui/src',
      '@formbuilder/layout-engine': '../../packages/layout-engine/src',
      '@formbuilder/property-panel': '../../packages/property-panel/src',
      '@formbuilder/component-library': '../../packages/component-library/src',
      '@formbuilder/form-builder': '../../packages/form-builder/src'
    }
  }
});
EOF

cat > apps/web/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# 创建 .gitignore
echo "📝 创建 .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
EOF

# 安装依赖
echo "📦 安装依赖..."
pnpm install

echo "✅ Monorepo 设置完成！"
echo ""
echo "🚀 下一步操作："
echo "1. 运行 'pnpm dev' 启动开发服务器"
echo "2. 运行 'pnpm build' 构建所有包"
echo "3. 查看 MONOREPO_ARCHITECTURE.md 了解详细架构"
echo ""
echo "📁 项目结构："
echo "├── packages/          # 核心包"
echo "├── apps/             # 应用"
echo "├── tools/            # 工具"
echo "└── docs/             # 文档"
