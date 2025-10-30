import React, { useCallback, useRef } from 'react';
import { useFormBuilder } from '../hooks/useFormBuilder.tsx';
import ComponentLibrary from './ComponentLibrary';
import LayoutRenderer from './LayoutRenderer';
import PropertyPanel from './PropertyPanel';

const FormBuilder: React.FC = () => {
  const {
    layoutData,
    editorState,
    componentTemplates,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    getSelectedComponent,
    updateLayout,
    toggleMode,
    copyComponent,
    pasteComponent,
    setLayoutData,
    setEditorState
  } = useFormBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);

  // 处理组件拖拽开始
  const handleDragStart = useCallback((template: any) => {
    console.log('Drag started:', template);
  }, []);

  // 处理画布拖拽放置
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    try {
      const template = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current?.getBoundingClientRect();

      if (rect) {
        // 计算在画布中的相对位置
        const x = Math.floor((e.clientX - rect.left) / (layoutData.containerWidth / layoutData.cols));
        const y = Math.floor((e.clientY - rect.top) / layoutData.rowHeight);

        addComponent(template, { x, y });
      }
    } catch (error) {
      console.error('Failed to parse dropped component:', error);
    }
  }, [addComponent, layoutData.containerWidth, layoutData.cols, layoutData.rowHeight]);

  // 处理画布拖拽悬停
  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // 处理组件选择
  const handleComponentSelect = useCallback((componentId: string | null) => {
    selectComponent(componentId);
  }, [selectComponent]);

  // 处理布局变化
  const handleLayoutChange = useCallback((newLayout: any[]) => {
    updateLayout(newLayout);
  }, [updateLayout]);

  // 处理组件更新
  const handleComponentUpdate = useCallback((id: string, updates: any) => {
    updateComponent(id, updates);
  }, [updateComponent]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && editorState.selection.selectedComponentId) {
      deleteComponent(editorState.selection.selectedComponentId);
    } else if (e.key === 'Escape') {
      selectComponent(null);
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c' && editorState.selection.selectedComponentId) {
        copyComponent(editorState.selection.selectedComponentId);
      } else if (e.key === 'v' && editorState.clipboard) {
        pasteComponent();
      } else if (e.key === 'z') {
        // TODO: 实现撤销功能
        console.log('Undo');
      } else if (e.key === 'y') {
        // TODO: 实现重做功能
        console.log('Redo');
      }
    }
  }, [
    editorState.selection.selectedComponentId,
    editorState.clipboard,
    deleteComponent,
    selectComponent,
    copyComponent,
    pasteComponent
  ]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#f5f5f5'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 左侧组件库 */}
      <ComponentLibrary
        templates={componentTemplates}
        onDragStart={handleDragStart}
      />

      {/* 中间画布区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'white'
      }}>
        {/* 工具栏 */}
        <div style={{
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '12px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            表单构建器
          </h2>

          <div style={{ flex: 1 }} />

          <button
            onClick={toggleMode}
            style={{
              padding: '8px 16px',
              background: editorState.mode === 'edit' ? '#007bff' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {editorState.mode === 'edit' ? '预览模式' : '编辑模式'}
          </button>

          <div style={{
            fontSize: '12px',
            color: '#666',
            background: '#f8f9fa',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {editorState.mode === 'edit' ? '编辑中' : '预览中'}
          </div>
        </div>

        {/* 画布 */}
        <div
          ref={canvasRef}
          style={{
            flex: 1,
            padding: '20px',
            overflow: 'auto',
            background: '#fafafa'
          }}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          <LayoutRenderer
            layoutData={layoutData}
            editMode={editorState.mode === 'edit'}
            onLayoutChange={handleLayoutChange}
            onComponentSelect={handleComponentSelect}
            selectedComponentId={editorState.selection.selectedComponentId}
            style={{
              minHeight: '600px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          />
        </div>
      </div>

      {/* 右侧属性面板 */}
      <PropertyPanel
        selectedComponent={getSelectedComponent()}
        onUpdateComponent={handleComponentUpdate}
      />
    </div>
  );
};

export default FormBuilder;
