# 表单构建器架构设计

## 🎯 整体架构

```
┌─────────────────┬──────────────────────┬─────────────────┐
│   左侧组件库     │      中间画布区域      │   右侧属性面板   │
│  ComponentLibrary│    LayoutRenderer    │  PropertyPanel  │
│                 │                      │                 │
│ • 组件模板       │ • 布局渲染           │ • 属性编辑       │
│ • 拖拽源        │ • 拖拽目标           │ • 实时预览       │
│ • 分类管理       │ • 选择状态           │ • 表单验证       │
└─────────────────┴──────────────────────┴─────────────────┘
                           │
                    ┌─────────────┐
                    │ 状态管理层   │
                    │useFormBuilder│
                    │             │
                    │ • 布局数据   │
                    │ • 选中状态   │
                    │ • 编辑器状态 │
                    │ • 历史记录   │
                    └─────────────┘
```

## 📊 核心数据结构

### 1. ComponentConfig - 组件配置
```typescript
interface ComponentConfig {
  id: string;                    // 唯一标识
  type: ComponentType;           // 组件类型
  props: ComponentProps;         // 组件属性
  layout: LayoutConfig;          // 布局配置
  meta?: {                      // 元数据
    name: string;
    description?: string;
    category: 'basic' | 'form' | 'layout' | 'media';
    icon?: string;
  };
}
```

### 2. LayoutData - 布局数据
```typescript
interface LayoutData {
  components: ComponentConfig[];  // 所有组件
  containerWidth: number;        // 容器宽度
  cols: number;                  // 网格列数
  rowHeight: number;             // 行高
  margin: [number, number];      // 外边距
  containerPadding: [number, number]; // 内边距
  formConfig?: {                 // 表单配置
    title?: string;
    description?: string;
    submitText?: string;
    resetText?: string;
    onSubmit?: (data: any) => void;
  };
}
```

### 3. EditorState - 编辑器状态
```typescript
interface EditorState {
  mode: 'edit' | 'preview';      // 编辑/预览模式
  selection: SelectionState;     // 选中状态
  clipboard: ComponentConfig | null; // 剪贴板
  history: {                     // 历史记录
    past: LayoutData[];
    present: LayoutData;
    future: LayoutData[];
  };
  canvas: {                      // 画布配置
    zoom: number;
    gridSize: number;
    showGrid: boolean;
    snapToGrid: boolean;
  };
}
```

## 🔄 数据流和联动机制

### 1. 组件添加流程
```
左侧组件库 → 拖拽开始 → 画布放置 → 状态更新 → 右侧属性面板更新
     ↓           ↓         ↓         ↓            ↓
  ComponentTemplate → onDragStart → onDrop → addComponent → 选中新组件
```

### 2. 属性编辑流程
```
右侧属性面板 → 属性修改 → 状态更新 → 画布实时更新
     ↓           ↓         ↓         ↓
  PropertyPanel → updateProperty → updateComponent → LayoutRenderer重渲染
```

### 3. 布局变化流程
```
画布拖拽/调整 → 布局变化 → 状态更新 → 属性面板同步
     ↓           ↓         ↓         ↓
  GridLayout → onLayoutChange → updateLayout → 坐标属性更新
```

## 🛠️ 核心功能实现

### 1. 拖拽添加组件
```typescript
// 左侧组件库
const handleDragStart = (template: ComponentTemplate) => {
  e.dataTransfer.setData('application/json', JSON.stringify(template));
};

// 画布区域
const handleCanvasDrop = (e: React.DragEvent) => {
  const template = JSON.parse(e.dataTransfer.getData('application/json'));
  const position = calculateDropPosition(e);
  addComponent(template, position);
};
```

### 2. 组件选择
```typescript
// 画布点击选择
const handleComponentClick = (componentId: string) => {
  selectComponent(componentId);
  // 自动更新右侧属性面板
};

// 属性面板显示选中组件的属性
const selectedComponent = getSelectedComponent();
```

### 3. 属性编辑
```typescript
// 属性面板修改
const updateProperty = (path: string, value: any) => {
  const updates = buildNestedObject(path, value);
  updateComponent(selectedComponent.id, updates);
};

// 实时预览更新
const ComponentRenderer = ({ config }) => {
  // 根据config.props渲染组件
};
```

### 4. 布局管理
```typescript
// 拖拽结束处理
const handleDragStop = (layout: any[]) => {
  // 当allowOverlap=true时，onLayoutChange可能不触发
  // 所以手动触发布局变化
  triggerLayoutChange(layout, 'onDragStop');
};

// 布局更新
const updateLayout = (newLayout: any[]) => {
  setLayoutData(prev => ({
    ...prev,
    components: prev.components.map(comp => {
      const newLayoutItem = newLayout.find(item => item.i === comp.id);
      return newLayoutItem ? { ...comp, layout: { ...comp.layout, ...newLayoutItem } } : comp;
    })
  }));
};
```

## 🎨 组件设计模式

### 1. 组件模板模式
```typescript
const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    type: 'button',
    name: '按钮',
    defaultProps: { text: '按钮', style: { ... } },
    defaultLayout: { w: 2, h: 1 },
    preview: ({ config }) => <button>{config.props.text}</button>
  }
];
```

### 2. 属性配置模式
```typescript
const PROPERTY_CONFIGS = {
  button: [
    { id: 'text', label: '按钮文字', type: 'text', path: 'props.text' },
    { id: 'type', label: '按钮类型', type: 'select', path: 'props.type' }
  ]
};
```

### 3. 状态管理模式
```typescript
const useFormBuilder = () => {
  const [layoutData, setLayoutData] = useState<LayoutData>();
  const [editorState, setEditorState] = useState<EditorState>();
  
  // 所有操作方法
  const addComponent = useCallback(...);
  const updateComponent = useCallback(...);
  const selectComponent = useCallback(...);
  
  return { layoutData, editorState, addComponent, ... };
};
```

## 🚀 使用示例

### 1. 基本使用
```typescript
import FormBuilder from './components/FormBuilder';

function App() {
  return <FormBuilder />;
}
```

### 2. 自定义组件模板
```typescript
const customTemplates = [
  {
    type: 'custom-button',
    name: '自定义按钮',
    defaultProps: { text: '自定义', color: '#ff6b6b' },
    defaultLayout: { w: 3, h: 1 }
  }
];
```

### 3. 属性面板配置
```typescript
const customPropertyConfig = {
  'custom-button': [
    { id: 'color', label: '颜色', type: 'color', path: 'props.color' }
  ]
};
```

## 🔧 扩展点

### 1. 添加新组件类型
1. 在`ComponentType`中添加新类型
2. 在`COMPONENT_TEMPLATES`中添加模板
3. 在`ComponentRenderer`中添加渲染逻辑
4. 在`PROPERTY_CONFIGS`中添加属性配置

### 2. 自定义属性编辑器
1. 在`PropertyConfig`中添加新的`type`
2. 在`PropertyPanel`中添加对应的渲染逻辑

### 3. 添加新的布局模式
1. 扩展`LayoutConfig`接口
2. 修改`LayoutRenderer`的渲染逻辑
3. 更新布局管理相关的方法

## 📝 总结

这个架构设计实现了：
- ✅ **模块化**：各组件职责清晰，易于维护
- ✅ **可扩展**：支持自定义组件和属性编辑器
- ✅ **响应式**：实时同步三个区域的状态
- ✅ **类型安全**：完整的TypeScript类型定义
- ✅ **性能优化**：使用useCallback和useMemo优化渲染
- ✅ **用户体验**：直观的拖拽操作和实时预览

通过这个架构，你可以轻松构建一个功能完整的可视化表单构建器！
