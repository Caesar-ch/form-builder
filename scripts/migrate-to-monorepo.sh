#!/bin/bash

# 从现有项目迁移到 Monorepo 的脚本

set -e

echo "🔄 开始从现有项目迁移到 Monorepo..."

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 备份现有项目
echo "💾 备份现有项目..."
cp -r . ../formbuilder-backup-$(date +%Y%m%d-%H%M%S)
echo "✅ 项目已备份到 ../formbuilder-backup-*"

# 创建新的目录结构
echo "📁 创建 Monorepo 目录结构..."
mkdir -p packages/{core,ui,form-builder,layout-engine,property-panel,component-library}/src
mkdir -p apps/web/src
mkdir -p tools/{build,lint,test,scripts}

# 移动文件到对应的包
echo "📦 移动文件到对应的包..."

# 1. 移动类型定义到 core 包
if [ -f "src/types/FormBuilder.ts" ]; then
    echo "  → 移动类型定义到 @formbuilder/core"
    cp src/types/FormBuilder.ts packages/core/src/types.ts
    echo "export * from './types';" > packages/core/src/index.ts
fi

# 2. 移动 Hooks 到 core 包
if [ -f "src/hooks/useFormBuilder.tsx" ]; then
    echo "  → 移动 Hooks 到 @formbuilder/core"
    cp src/hooks/useFormBuilder.tsx packages/core/src/hooks.tsx
    echo "export * from './hooks';" >> packages/core/src/index.ts
fi

# 3. 移动基础组件到 ui 包
echo "  → 移动基础组件到 @formbuilder/ui"
if [ -f "src/components/ComponentRenderer.tsx" ]; then
    cp src/components/ComponentRenderer.tsx packages/ui/src/ComponentRenderer.tsx
fi

# 创建 ui 包的 index.ts
cat > packages/ui/src/index.ts << 'EOF'
export { ComponentRenderer } from './ComponentRenderer';
EOF

# 4. 移动布局相关组件到 layout-engine 包
echo "  → 移动布局组件到 @formbuilder/layout-engine"
if [ -f "src/components/LayoutRenderer.tsx" ]; then
    cp src/components/LayoutRenderer.tsx packages/layout-engine/src/LayoutRenderer.tsx
fi

# 创建 layout-engine 包的 index.ts
cat > packages/layout-engine/src/index.ts << 'EOF'
export { default as LayoutRenderer } from './LayoutRenderer';
EOF

# 5. 移动属性面板到 property-panel 包
echo "  → 移动属性面板到 @formbuilder/property-panel"
if [ -f "src/components/PropertyPanel.tsx" ]; then
    cp src/components/PropertyPanel.tsx packages/property-panel/src/PropertyPanel.tsx
fi

# 创建 property-panel 包的 index.ts
cat > packages/property-panel/src/index.ts << 'EOF'
export { default as PropertyPanel } from './PropertyPanel';
EOF

# 6. 移动组件库到 component-library 包
echo "  → 移动组件库到 @formbuilder/component-library"
if [ -f "src/components/ComponentLibrary.tsx" ]; then
    cp src/components/ComponentLibrary.tsx packages/component-library/src/ComponentLibrary.tsx
fi

# 创建 component-library 包的 index.ts
cat > packages/component-library/src/index.ts << 'EOF'
export { default as ComponentLibrary } from './ComponentLibrary';
EOF

# 7. 移动主构建器到 form-builder 包
echo "  → 移动主构建器到 @formbuilder/form-builder"
if [ -f "src/components/FormBuilder.tsx" ]; then
    cp src/components/FormBuilder.tsx packages/form-builder/src/FormBuilder.tsx
fi

# 创建 form-builder 包的 index.ts
cat > packages/form-builder/src/index.ts << 'EOF'
export { default as FormBuilder } from './FormBuilder';
EOF

# 8. 移动应用到 apps/web
echo "  → 移动应用到 apps/web"
if [ -f "src/App.tsx" ]; then
    cp src/App.tsx apps/web/src/App.tsx
fi
if [ -f "src/main.tsx" ]; then
    cp src/main.tsx apps/web/src/main.tsx
fi
if [ -f "src/App.css" ]; then
    cp src/App.css apps/web/src/App.css
fi
if [ -d "public" ]; then
    cp -r public apps/web/
fi

# 移动样式文件
if [ -d "src/styles" ]; then
    cp -r src/styles apps/web/src/
fi

# 移动示例文件
if [ -d "src/examples" ]; then
    cp -r src/examples apps/web/src/
fi

if [ -d "src/pages" ]; then
    cp -r src/pages apps/web/src/
fi

# 创建 Web 应用的基础文件
cat > apps/web/src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# 创建 Web 应用的 index.html
cat > apps/web/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>表单构建器</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# 更新 Web 应用的 App.tsx
cat > apps/web/src/App.tsx << 'EOF'
import { useState } from 'react';
import ReactGridLayout from './pages/ReactGridLayout';
import LayoutDataExample from './examples/LayoutDataExample';
import FormBuilderPage from './pages/FormBuilderPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'grid' | 'example' | 'builder'>('builder');

  return (
    <div>
      {/* 页面切换导航 */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        background: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setCurrentPage('builder')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'builder' ? '#007bff' : '#f8f9fa',
            color: currentPage === 'builder' ? 'white' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          表单构建器
        </button>
        <button
          onClick={() => setCurrentPage('grid')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'grid' ? '#007bff' : '#f8f9fa',
            color: currentPage === 'grid' ? 'white' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          网格布局
        </button>
        <button
          onClick={() => setCurrentPage('example')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'example' ? '#007bff' : '#f8f9fa',
            color: currentPage === 'example' ? 'white' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          布局示例
        </button>
      </div>

      {/* 页面内容 */}
      <div style={{ marginTop: currentPage === 'builder' ? '0' : '60px' }}>
        {currentPage === 'builder' && <FormBuilderPage />}
        {currentPage === 'grid' && <ReactGridLayout />}
        {currentPage === 'example' && <LayoutDataExample />}
      </div>
    </div>
  );
}

export default App;
EOF

# 创建 FormBuilderPage
cat > apps/web/src/pages/FormBuilderPage.tsx << 'EOF'
import React from 'react';
import FormBuilder from '@formbuilder/form-builder';

const FormBuilderPage: React.FC = () => {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <FormBuilder />
    </div>
  );
};

export default FormBuilderPage;
EOF

# 更新所有包的导入路径
echo "🔧 更新导入路径..."

# 更新 core 包的导入
if [ -f "packages/core/src/hooks.tsx" ]; then
    sed -i.bak "s|from '../types/FormBuilder'|from './types'|g" packages/core/src/hooks.tsx
    rm packages/core/src/hooks.tsx.bak
fi

# 更新 ui 包的导入
if [ -f "packages/ui/src/ComponentRenderer.tsx" ]; then
    sed -i.bak "s|from '../types/FormBuilder'|from '@formbuilder/core'|g" packages/ui/src/ComponentRenderer.tsx
    rm packages/ui/src/ComponentRenderer.tsx.bak
fi

# 更新 layout-engine 包的导入
if [ -f "packages/layout-engine/src/LayoutRenderer.tsx" ]; then
    sed -i.bak "s|from '../types/FormBuilder'|from '@formbuilder/core'|g" packages/layout-engine/src/LayoutRenderer.tsx
    sed -i.bak "s|from './ComponentRenderer'|from '@formbuilder/ui'|g" packages/layout-engine/src/LayoutRenderer.tsx
    rm packages/layout-engine/src/LayoutRenderer.tsx.bak
fi

# 更新 property-panel 包的导入
if [ -f "packages/property-panel/src/PropertyPanel.tsx" ]; then
    sed -i.bak "s|from '../types/FormBuilder'|from '@formbuilder/core'|g" packages/property-panel/src/PropertyPanel.tsx
    rm packages/property-panel/src/PropertyPanel.tsx.bak
fi

# 更新 component-library 包的导入
if [ -f "packages/component-library/src/ComponentLibrary.tsx" ]; then
    sed -i.bak "s|from '../types/FormBuilder'|from '@formbuilder/core'|g" packages/component-library/src/ComponentLibrary.tsx
    rm packages/component-library/src/ComponentLibrary.tsx.bak
fi

# 更新 form-builder 包的导入
if [ -f "packages/form-builder/src/FormBuilder.tsx" ]; then
    sed -i.bak "s|from '../hooks/useFormBuilder'|from '@formbuilder/core'|g" packages/form-builder/src/FormBuilder.tsx
    sed -i.bak "s|from './ComponentLibrary'|from '@formbuilder/component-library'|g" packages/form-builder/src/FormBuilder.tsx
    sed -i.bak "s|from './LayoutRenderer'|from '@formbuilder/layout-engine'|g" packages/form-builder/src/FormBuilder.tsx
    sed -i.bak "s|from './PropertyPanel'|from '@formbuilder/property-panel'|g" packages/form-builder/src/FormBuilder.tsx
    rm packages/form-builder/src/FormBuilder.tsx.bak
fi

# 运行设置脚本
echo "🚀 运行 Monorepo 设置脚本..."
chmod +x scripts/setup-monorepo.sh
./scripts/setup-monorepo.sh

echo "✅ 迁移完成！"
echo ""
echo "📁 新的项目结构："
echo "├── packages/"
echo "│   ├── core/              # 类型定义和核心逻辑"
echo "│   ├── ui/                # 基础UI组件"
echo "│   ├── layout-engine/     # 布局引擎"
echo "│   ├── property-panel/    # 属性面板"
echo "│   ├── component-library/ # 组件库"
echo "│   └── form-builder/      # 主构建器"
echo "├── apps/"
echo "│   └── web/               # Web应用"
echo "└── tools/                 # 工具包"
echo ""
echo "🚀 下一步操作："
echo "1. 运行 'pnpm install' 安装依赖"
echo "2. 运行 'pnpm dev' 启动开发服务器"
echo "3. 运行 'pnpm build' 构建所有包"
echo ""
echo "📝 注意事项："
echo "- 原始项目已备份到 ../formbuilder-backup-*"
echo "- 请检查各包的导入路径是否正确"
echo "- 可能需要手动调整一些组件的导入"
