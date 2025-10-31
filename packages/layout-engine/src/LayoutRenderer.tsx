import React, { useCallback, useRef } from 'react';
import GridLayout from 'react-grid-layout';
// import type { Layout, Layouts } from 'react-grid-layout';
// import 'react-grid-layout/css/styles.css'; // 暂时注释掉，在运行时加载
// import '../styles/overlay.css'; // 暂时注释掉
// import OverlayToggle from './OverlayToggle'; // 暂时注释掉
import { ComponentConfig, LayoutData } from '@formbuilder/core/dist/index.js';

// 组件渲染器
const ComponentRenderer: React.FC<{ config: ComponentConfig }> = ({ config }) => {
  const { type, props } = config;

  const renderComponent = () => {
    switch (type) {
      case 'button':
        return (
          <button
            style={{
              width: '100%',
              height: '100%',
              background: props.color || '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => props.onClick && props.onClick()}
          >
            {props.text || '按钮'}
          </button>
        );
      case 'input':
        return (
          <input
            type="text"
            placeholder={props.placeholder || '请输入内容'}
            value={props.value || ''}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        );
      case 'text':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: props.fontSize || '16px',
            color: props.color || '#333',
            fontWeight: props.bold ? 'bold' : 'normal',
            textAlign: props.align || 'center',
            padding: '8px',
            boxSizing: 'border-box'
          }}>
            {props.content || '文本内容'}
          </div>
        );
      case 'image':
        return (
          <img
            src={props.src || 'https://via.placeholder.com/150'}
            alt={props.alt || '图片'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: props.objectFit || 'cover',
              borderRadius: '4px'
            }}
          />
        );
      case 'container':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            background: props.background || '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            boxSizing: 'border-box'
          }}>
            {props.children || '容器'}
          </div>
        );
      default:
        return <div>未知组件类型</div>;
    }
  };

  return renderComponent();
};

// 布局渲染器组件
interface LayoutRendererProps {
  layoutData: LayoutData;
  className?: string; // 类名
  style?: React.CSSProperties;
  editMode?: boolean;  // 是否为编辑模式
  onToggleOverlay?: (componentId: string, isOverlay: boolean) => void;
  onLayoutChange?: (layout: any[]) => void;  // 布局变化回调
  onComponentSelect?: (componentId: string | null) => void;  // 组件选择回调
  selectedComponentId?: string | null;  // 当前选中的组件ID
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layoutData, // 布局数据
  className,
  style,
  editMode = false, // 是否为编辑模式
  onToggleOverlay, // 覆盖元素切换回调
  onLayoutChange, // 布局变化回调
  onComponentSelect, // 组件选择回调
  selectedComponentId // 当前选中的组件ID
}) => {
  // 所有组件都使用react-grid-layout管理，不再分离覆盖元素
  const allComponents = layoutData.components;

  // 用于跟踪是否已经通过其他回调触发了布局变化，避免重复调用
  const layoutChangeTriggeredRef = useRef(false);

  // 转换为 react-grid-layout 格式
  const gridLayout = allComponents.map(comp => ({
    i: comp.id,
    x: comp.layout.x,
    y: comp.layout.y,
    w: comp.layout.w,
    h: comp.layout.h,
    static: comp.layout.static, // 是否支持拖拽和缩放
    isDraggable: editMode && !comp.layout.static, // 编辑模式下可拖拽（除非是static）
    isResizable: editMode && !comp.layout.static, // 编辑模式下可调整大小（除非是static）
    zIndex: comp.layout.zIndex || (comp.layout.overlay ? 10 : 1) // 覆盖元素层级更高
  }));

  // 统一的布局变化处理函数，避免重复调用
  const triggerLayoutChange = useCallback((layout: any[], source: string) => {
    console.log(`Triggering layout change from ${source}:`, layout);
    layoutChangeTriggeredRef.current = true;
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  }, [onLayoutChange]);

  // 处理布局变化，将react-grid-layout的格式转换回我们的格式
  const handleLayoutChange = useCallback((newLayout: any[]) => {
    console.log('LayoutRenderer handleLayoutChange called:', newLayout);
    console.log('editMode:', editMode);
    console.log('onLayoutChange exists:', !!onLayoutChange);
    console.log('Already triggered by other callback:', layoutChangeTriggeredRef.current);

    // 如果已经通过其他回调触发了，就不重复调用
    if (layoutChangeTriggeredRef.current) {
      console.log('Skipping duplicate layout change call');
      layoutChangeTriggeredRef.current = false; // 重置标志
      return;
    }

    if (onLayoutChange) {
      console.log('Calling parent onLayoutChange...');
      onLayoutChange(newLayout);
    } else {
      console.log('No onLayoutChange callback provided');
    }
  }, [onLayoutChange, editMode]);

  // 添加拖拽和调整大小的回调，用于调试
  const handleDragStart = useCallback((_layout: any[], _oldItem: any, _newItem: any, _placeholder: any, _event: MouseEvent, _element: HTMLElement) => {
    // console.log('Drag started:', { oldItem, newItem });
  }, []);

  const handleDrag = useCallback((_layout: any[], _oldItem: any, _newItem: any, _placeholder: any, _event: MouseEvent, _element: HTMLElement) => {
    // console.log('Dragging:', { oldItem, newItem });
  }, []);

  const handleDragStop = useCallback((layout: any[], oldItem: any, newItem: any, _placeholder: any, _event: MouseEvent, _element: HTMLElement) => {
    console.log('Drag stopped:', { oldItem, newItem, layout });

    // 当allowOverlap=true时，onLayoutChange可能不会触发
    // 所以我们需要在onDragStop中手动触发布局变化回调
    triggerLayoutChange(layout, 'onDragStop');
  }, [triggerLayoutChange]);

  // 调整大小结束回调
  const handleResizeStop = useCallback((layout: any[], oldItem: any, newItem: any, _placeholder: any, _event: MouseEvent, _element: HTMLElement) => {
    console.log('Resize stopped:', { oldItem, newItem, layout });

    // 调整大小结束时也需要手动触发布局变化回调
    triggerLayoutChange(layout, 'onResizeStop');
  }, [triggerLayoutChange]);

  //   🔍 问题分析
  // allowOverlap={true}时onLayoutChange不触发的原因：
  // 重叠检测机制：当允许重叠时，react-grid-layout认为元素可以自由放置，不会进行碰撞检测
  // 布局变化判断：如果拖拽没有改变网格位置（x, y坐标），onLayoutChange就不会触发
  // 自由拖拽模式：在重叠模式下，元素更像是"自由浮动"，而不是网格约束

  return (
    <div className={className} style={{ ...style, position: 'relative' }}>
      {/* 统一的网格布局 - 所有元素都通过react-grid-layout管理 */}
      {/* @ts-ignore */}
      <GridLayout
        layout={gridLayout}
        width={layoutData.containerWidth}
        cols={layoutData.cols}
        rowHeight={layoutData.rowHeight}
        isResizable={editMode}  // 编辑模式下可缩放
        isDraggable={editMode}  // 编辑模式下可拖拽
        resizeHandles={editMode ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
        margin={layoutData.margin}
        containerPadding={layoutData.containerPadding}
        onLayoutChange={handleLayoutChange}
        onDragStart={editMode ? handleDragStart : undefined}
        onDrag={editMode ? handleDrag : undefined}
        onDragStop={editMode ? handleDragStop : undefined}
        onResizeStart={editMode ? handleDragStart : undefined}
        onResize={editMode ? handleDrag : undefined}
        onResizeStop={editMode ? handleResizeStop : undefined}
        style={{ minHeight: '400px' }}
        // 允许元素重叠，这样覆盖元素可以正常显示
        allowOverlap={true}
        // 使用CSS3 transform提升性能
        useCSSTransforms={true}
      >
        {allComponents.map(comp => (
          <div
            key={comp.id}
            style={{
              position: 'relative',
              zIndex: comp.layout.zIndex || (comp.layout.overlay ? 10 : 1),
              cursor: editMode ? 'pointer' : 'default',
              border: selectedComponentId === comp.id ? '2px solid #007bff' : '2px solid transparent',
              borderRadius: '4px',
              transition: 'border-color 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (editMode && onComponentSelect) {
                onComponentSelect(comp.id);
              }
            }}
          >
            <ComponentRenderer config={comp} />
            {/* 编辑模式下的覆盖切换按钮 - 暂时注释掉 */}
            {/* {editMode && onToggleOverlay && (
              <OverlayToggle
                isOverlay={comp.layout.overlay || false}
                onToggle={(isOverlay) => onToggleOverlay(comp.id, isOverlay)}
                onSetTarget={() => { }} // 不再需要目标选择
                availableTargets={[]} // 空数组
                className="overlay-toggle-container"
              />
            )} */}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default LayoutRenderer;
