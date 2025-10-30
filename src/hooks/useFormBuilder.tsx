import { useState, useCallback, useRef } from 'react';
import {
  type ComponentConfig,
  type LayoutData,
  type EditorState,
  type SelectionState,
  type ComponentTemplate,
  type FormBuilderEvents
} from '../types/FormBuilder.ts';

// 组件模板库
const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    type: 'button',
    name: '按钮',
    description: '可点击的按钮组件',
    icon: '🔘',
    category: 'basic',
    defaultProps: {
      text: '按钮',
      type: 'button',
      style: { backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }
    },
    defaultLayout: { w: 2, h: 1, minW: 1, minH: 1 },
    preview: ({ config }) => (
      <button style={{ ...config.props.style }} >
        {config.props.text}
      </button>
    )
  },
  {
    type: 'input',
    name: '输入框',
    description: '单行文本输入框',
    icon: '📝',
    category: 'form',
    defaultProps: {
      placeholder: '请输入内容',
      type: 'text',
      style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
    },
    defaultLayout: { w: 3, h: 1, minW: 2, minH: 1 },
    preview: ({ config }) => (
      <input
        type="text"
        placeholder={config.props.placeholder}
        style={config.props.style}
      />
    )
  },
  {
    type: 'text',
    name: '文本',
    description: '显示文本内容',
    icon: '📄',
    category: 'basic',
    defaultProps: {
      content: '文本内容',
      fontSize: '16px',
      color: '#333',
      style: { padding: '8px' }
    },
    defaultLayout: { w: 2, h: 1, minW: 1, minH: 1 },
    preview: ({ config }) => (
      <div style={{ ...config.props.style, fontSize: config.props.fontSize, color: config.props.color }}>
        {config.props.content}
      </div>
    )
  },
  {
    type: 'image',
    name: '图片',
    description: '显示图片',
    icon: '🖼️',
    category: 'media',
    defaultProps: {
      src: 'https://via.placeholder.com/200x100',
      alt: '图片',
      objectFit: 'cover',
      style: { width: '100%', height: '100%' }
    },
    defaultLayout: { w: 3, h: 2, minW: 1, minH: 1 },
    preview: ({ config }) => (
      <img
        src={config.props.src}
        alt={config.props.alt}
        style={{ ...config.props.style, objectFit: config.props.objectFit }}
      />
    )
  },
  {
    type: 'container',
    name: '容器',
    description: '可包含其他组件的容器',
    icon: '📦',
    category: 'layout',
    defaultProps: {
      children: '容器内容',
      background: '#f8f9fa',
      style: {
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    defaultLayout: { w: 4, h: 3, minW: 2, minH: 2 },
    preview: ({ config }) => (
      <div style={{ ...config.props.style, backgroundColor: config.props.background }}>
        {config.props.children}
      </div>
    )
  }
];

// 初始布局数据
const INITIAL_LAYOUT_DATA: LayoutData = {
  components: [],
  containerWidth: 1200,
  cols: 12,
  rowHeight: 60,
  margin: [10, 10],
  containerPadding: [10, 10],
  formConfig: {
    title: '表单标题',
    description: '表单描述',
    submitText: '提交',
    resetText: '重置'
  }
};

// 初始编辑器状态
const INITIAL_EDITOR_STATE: EditorState = {
  mode: 'edit',
  selection: {
    selectedComponentId: null,
    selectedComponents: [],
    hoveredComponentId: null
  },
  clipboard: null,
  history: {
    past: [],
    present: INITIAL_LAYOUT_DATA,
    future: []
  },
  canvas: {
    zoom: 1,
    gridSize: 10,
    showGrid: true,
    snapToGrid: true
  }
};

export const useFormBuilder = () => {
  // 核心状态
  const [layoutData, setLayoutData] = useState<LayoutData>(INITIAL_LAYOUT_DATA);
  const [editorState, setEditorState] = useState<EditorState>(INITIAL_EDITOR_STATE);

  // 生成唯一ID的计数器
  const idCounterRef = useRef(0);
  const generateId = useCallback(() => {
    return `component_${++idCounterRef.current}`;
  }, []);

  // 添加组件
  const addComponent = useCallback((template: ComponentTemplate, position?: { x: number; y: number }) => {
    const newComponent: ComponentConfig = {
      id: generateId(),
      type: template.type,
      props: { ...template.defaultProps },
      layout: {
        ...template.defaultLayout,
        x: position?.x ?? 0,
        y: position?.y ?? 0
      },
      meta: {
        name: template.name,
        description: template.description,
        category: template.category,
        icon: template.icon
      }
    };

    setLayoutData(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));

    // 选中新添加的组件
    setEditorState(prev => ({
      ...prev,
      selection: {
        ...prev.selection,
        selectedComponentId: newComponent.id,
        selectedComponents: [newComponent.id]
      }
    }));

    return newComponent;
  }, [generateId]);

  // 更新组件
  const updateComponent = useCallback((id: string, updates: Partial<ComponentConfig>) => {
    setLayoutData(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }));
  }, []);

  // 删除组件
  const deleteComponent = useCallback((id: string) => {
    setLayoutData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id)
    }));

    // 清除选中状态
    setEditorState(prev => ({
      ...prev,
      selection: {
        ...prev.selection,
        selectedComponentId: prev.selection.selectedComponentId === id ? null : prev.selection.selectedComponentId,
        selectedComponents: prev.selection.selectedComponents.filter(compId => compId !== id)
      }
    }));
  }, []);

  // 选择组件
  const selectComponent = useCallback((id: string | null, multiSelect = false) => {
    setEditorState(prev => {
      if (!id) {
        return {
          ...prev,
          selection: {
            ...prev.selection,
            selectedComponentId: null,
            selectedComponents: []
          }
        };
      }

      if (multiSelect) {
        const isSelected = prev.selection.selectedComponents.includes(id);
        return {
          ...prev,
          selection: {
            ...prev.selection,
            selectedComponentId: id,
            selectedComponents: isSelected
              ? prev.selection.selectedComponents.filter(compId => compId !== id)
              : [...prev.selection.selectedComponents, id]
          }
        };
      } else {
        return {
          ...prev,
          selection: {
            ...prev.selection,
            selectedComponentId: id,
            selectedComponents: [id]
          }
        };
      }
    });
  }, []);

  // 更新布局
  const updateLayout = useCallback((newLayout: any[]) => {
    setLayoutData(prev => {
      const updatedComponents = prev.components.map(comp => {
        const newLayoutItem = newLayout.find(item => item.i === comp.id);
        if (newLayoutItem) {
          return {
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
        }
        return comp;
      });

      return {
        ...prev,
        components: updatedComponents
      };
    });
  }, []);

  // 切换模式
  const toggleMode = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      mode: prev.mode === 'edit' ? 'preview' : 'edit'
    }));
  }, []);

  // 获取选中的组件
  const getSelectedComponents = useCallback(() => {
    return layoutData.components.filter(comp =>
      editorState.selection.selectedComponents.includes(comp.id)
    );
  }, [layoutData.components, editorState.selection.selectedComponents]);

  // 获取单个选中的组件
  const getSelectedComponent = useCallback(() => {
    if (!editorState.selection.selectedComponentId) return null;
    return layoutData.components.find(comp =>
      comp.id === editorState.selection.selectedComponentId
    );
  }, [layoutData.components, editorState.selection.selectedComponentId]);

  // 复制组件
  const copyComponent = useCallback((id: string) => {
    const component = layoutData.components.find(comp => comp.id === id);
    if (component) {
      setEditorState(prev => ({
        ...prev,
        clipboard: { ...component, id: generateId() }
      }));
    }
  }, [layoutData.components, generateId]);

  // 粘贴组件
  const pasteComponent = useCallback((position?: { x: number; y: number }) => {
    if (editorState.clipboard) {
      const newComponent = {
        ...editorState.clipboard,
        id: generateId(),
        layout: {
          ...editorState.clipboard.layout,
          x: position?.x ?? editorState.clipboard.layout.x + 1,
          y: position?.y ?? editorState.clipboard.layout.y + 1
        }
      };

      setLayoutData(prev => ({
        ...prev,
        components: [...prev.components, newComponent]
      }));

      selectComponent(newComponent.id);
    }
  }, [editorState.clipboard, generateId, selectComponent]);

  return {
    // 状态
    layoutData,
    editorState,
    componentTemplates: COMPONENT_TEMPLATES,

    // 组件操作
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    getSelectedComponents,
    getSelectedComponent,

    // 布局操作
    updateLayout,

    // 编辑器操作
    toggleMode,

    // 剪贴板操作
    copyComponent,
    pasteComponent,

    // 状态更新
    setLayoutData,
    setEditorState
  };
};
