import React from 'react';
import LayoutRenderer, { type LayoutData } from '../components/LayoutRenderer';

// 示例：如何使用导出的布局数据
const LayoutDataExample: React.FC = () => {
  // 这是一个从编辑器导出的布局数据示例
  const exampleLayoutData: LayoutData = {
    components: [
      {
        id: 'header',
        type: 'text',
        props: {
          content: '欢迎使用低代码平台',
          fontSize: '24px',
          color: '#333',
          bold: true,
          align: 'center'
        },
        layout: { x: 0, y: 0, w: 12, h: 2 }
      },
      {
        id: 'search',
        type: 'input',
        props: {
          placeholder: '搜索内容...',
          value: ''
        },
        layout: { x: 0, y: 2, w: 8, h: 1 }
      },
      {
        id: 'searchBtn',
        type: 'button',
        props: {
          text: '搜索',
          color: '#007bff'
        },
        layout: { x: 8, y: 2, w: 2, h: 1 }
      },
      {
        id: 'resetBtn',
        type: 'button',
        props: {
          text: '重置',
          color: '#6c757d'
        },
        layout: { x: 10, y: 2, w: 2, h: 1 }
      },
      {
        id: 'content',
        type: 'text',
        props: {
          content: '这里是主要内容区域，可以放置各种组件',
          fontSize: '16px',
          color: '#666'
        },
        layout: { x: 0, y: 3, w: 8, h: 3 }
      },
      {
        id: 'sidebar',
        type: 'container',
        props: {
          background: '#f8f9fa',
          children: '侧边栏内容'
        },
        layout: { x: 8, y: 3, w: 4, h: 3 }
      },
      {
        id: 'image',
        type: 'image',
        props: {
          src: 'https://via.placeholder.com/300x200',
          alt: '示例图片',
          objectFit: 'cover'
        },
        layout: { x: 0, y: 6, w: 6, h: 4 }
      },
      {
        id: 'footer',
        type: 'text',
        props: {
          content: '© 2024 低代码平台. 保留所有权利.',
          fontSize: '14px',
          color: '#999',
          align: 'center'
        },
        layout: { x: 0, y: 10, w: 12, h: 1 }
      },
      // 覆盖元素示例 - 现在通过react-grid-layout管理
      {
        id: 'overlay-badge',
        type: 'text',
        props: {
          content: 'NEW',
          fontSize: '12px',
          color: '#fff',
          bold: true,
          align: 'center'
        },
        layout: {
          x: 6, y: 6, w: 2, h: 1,
          overlay: true,
          zIndex: 20
        }
      },
      {
        id: 'overlay-button',
        type: 'button',
        props: {
          text: '立即购买',
          color: '#28a745'
        },
        layout: {
          x: 8, y: 7, w: 3, h: 1,
          overlay: true,
          zIndex: 15
        }
      }
    ],
    containerWidth: 1200,
    cols: 12,
    rowHeight: 60,
    margin: [10, 10],
    containerPadding: [10, 10]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>布局数据渲染示例</h2>
      <p>这个页面展示了如何使用从编辑器中导出的布局数据来渲染页面。</p>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#e9ecef', borderRadius: '4px' }}>
        <h4>布局数据特点：</h4>
        <ul>
          <li>每个组件都有唯一的 ID</li>
          <li>组件类型定义了渲染方式</li>
          <li>props 包含组件的属性和配置</li>
          <li>layout 定义了位置和尺寸（x, y, w, h）</li>
          <li>支持静态元素（不可拖拽）</li>
          <li><strong>优化后：</strong>所有元素（包括覆盖元素）都通过react-grid-layout统一管理</li>
          <li><strong>性能提升：</strong>移除了自定义拖拽实现，使用原生拖拽API</li>
          <li><strong>覆盖元素：</strong>通过zIndex和allowOverlap实现层级效果</li>
        </ul>
      </div>

      <LayoutRenderer
        layoutData={exampleLayoutData}
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  );
};

export default LayoutDataExample;
