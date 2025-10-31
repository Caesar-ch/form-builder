import { useState, useCallback } from 'react';
import LayoutRenderer from '@formbuilder/layout-engine';
import { type ComponentConfig, type LayoutData } from '@formbuilder/core';

// 注意：ComponentRenderer 现在在 LayoutRenderer 中定义

export default function ReactGridLayoutApp() {
  // 视图模式状态
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // 初始组件配置
  const [components, setComponents] = useState<ComponentConfig[]>([
    {
      id: 'a',
      type: 'button',
      props: { text: '按钮A', color: '#dc3545' },
      layout: { x: 0, y: 1, w: 1, h: 1, static: true }
    },
    {
      id: 'b',
      type: 'input',
      props: { placeholder: '输入框B' },
      layout: { x: 1, y: 0, w: 3, h: 2 }
    },
    {
      id: 'c',
      type: 'text',
      props: { content: '文本C', fontSize: '18px', color: '#28a745' },
      layout: { x: 4, y: 0, w: 1, h: 2 }
    },
    {
      id: 'd',
      type: 'image',
      props: { src: 'https://via.placeholder.com/200x100', alt: '示例图片' },
      layout: { x: 5, y: 0, w: 2, h: 2 }
    },
    {
      id: 'e',
      type: 'text',
      props: { content: '广告位', fontSize: '14px', color: 'white', bold: true },
      layout: {
        x: 50, y: 20, w: 100, h: 30,  // 像素单位
        overlay: true,
        zIndex: 10
      }
    }
  ]);

  // 布局配置
  const layoutConfig = {
    width: 1200,
    cols: 12,
    rowHeight: 60,
    margin: [10, 10] as [number, number],
    containerPadding: [10, 10] as [number, number]
  };

  // 布局变化回调
  const handleLayoutChange = useCallback((newLayout: any[]) => {
    console.log('ReactGridLayout handleLayoutChange called:', newLayout);

    setComponents(prevComponents => {
      const updatedComponents = prevComponents.map(comp => {
        const newLayoutItem = newLayout.find(item => item.i === comp.id);
        if (newLayoutItem) {
          const updatedComp = {
            ...comp,
            layout: {
              ...comp.layout,
              x: newLayoutItem.x,
              y: newLayoutItem.y,
              w: newLayoutItem.w,
              h: newLayoutItem.h,
              static: newLayoutItem.static
            }
          };
          console.log(`Updated component ${comp.id}:`, updatedComp);
          return updatedComp;
        }
        return comp;
      });

      console.log('All updated components:', updatedComponents);
      return updatedComponents;
    });
  }, []);

  // 切换覆盖状态
  const handleToggleOverlay = useCallback((componentId: string, isOverlay: boolean) => {
    setComponents(prevComponents =>
      prevComponents.map(comp => {
        if (comp.id === componentId) {
          return {
            ...comp,
            layout: {
              ...comp.layout,
              overlay: isOverlay,
              // 如果设为覆盖元素，转换为像素单位并设置默认位置
              x: isOverlay ? (comp.layout.x * (layoutConfig.width / layoutConfig.cols)) : comp.layout.x,
              y: isOverlay ? (comp.layout.y * layoutConfig.rowHeight) : comp.layout.y,
              w: isOverlay ? (comp.layout.w * (layoutConfig.width / layoutConfig.cols)) : comp.layout.w,
              h: isOverlay ? (comp.layout.h * layoutConfig.rowHeight) : comp.layout.h,
              zIndex: isOverlay ? (comp.layout.zIndex || 10) : undefined
            }
          };
        }
        return comp;
      })
    );
  }, [layoutConfig]);

  // 注意：覆盖元素不再需要目标选择，直接相对于容器定位
  // 覆盖元素现在通过react-grid-layout统一管理，不需要单独的位置变化回调

  // 导出布局数据
  const exportLayoutData = useCallback((): LayoutData => {
    return {
      components,
      containerWidth: layoutConfig.width,
      cols: layoutConfig.cols,
      rowHeight: layoutConfig.rowHeight,
      margin: layoutConfig.margin,
      containerPadding: layoutConfig.containerPadding
    };
  }, [components]);

  // 打印当前布局数据到控制台
  const logLayoutData = useCallback(() => {
    const data = exportLayoutData();
    console.log('当前布局数据:', data);
    console.log('JSON格式:', JSON.stringify(data, null, 2));
  }, [exportLayoutData]);

  // 注意：网格布局现在由 LayoutRenderer 内部处理

  // 获取当前布局数据
  const currentLayoutData: LayoutData = {
    components, // 
    containerWidth: layoutConfig.width,
    cols: layoutConfig.cols,
    rowHeight: layoutConfig.rowHeight,
    margin: layoutConfig.margin,
    containerPadding: layoutConfig.containerPadding
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* <h2>低代码拖拽布局编辑器</h2> */}

      {/* 控制面板 */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <button
            onClick={() => setViewMode('edit')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'edit' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            编辑模式
          </button>
          <button
            onClick={() => setViewMode('preview')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'preview' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            预览模式
          </button>
          <button
            onClick={logLayoutData}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            导出布局数据
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {viewMode === 'edit'
            ? '拖拽和缩放元素来调整布局，然后切换到预览模式查看效果'
            : '这是根据布局数据渲染的最终效果，可以测试组件交互功能'
          }
        </div>
      </div>

      {/* 根据模式渲染不同内容 */}
      {viewMode === 'edit' ? (
        /* 编辑模式 - 使用支持覆盖功能的渲染器 */
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <LayoutRenderer
            layoutData={currentLayoutData}
            editMode={true}
            onToggleOverlay={handleToggleOverlay}
            onLayoutChange={handleLayoutChange}
          />
        </div>
      ) : (
        /* 预览模式 - 使用渲染器 */
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <LayoutRenderer layoutData={currentLayoutData} />
        </div>
      )}
    </div>
  );
}
