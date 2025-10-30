// import React from 'react'
// import {rSuiteComponents} from '@react-form-builder/components-rsuite'
// import {BuilderView, FormBuilder} from '@react-form-builder/designer'

// // 官方组件
// const components = rSuiteComponents.map(c => c.build())
// const builderView = new BuilderView(components)

// // 拖拽设计器
// function App() {
//   return <FormBuilder
//   licenseKey="dev-license-key" // 开发环境密钥
//   view={builderView}/>
// }

// export default App


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

export default App