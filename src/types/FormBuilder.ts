// 表单构建器核心类型定义

// 组件类型枚举
export type ComponentType = 'button' | 'input' | 'text' | 'image' | 'container' | 'select' | 'textarea' | 'checkbox' | 'radio';

// 组件属性接口
export interface ComponentProps {
  // 通用属性
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  
  // 文本相关
  text?: string;
  content?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  
  // 输入相关
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  
  // 按钮相关
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  
  // 图片相关
  src?: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  
  // 容器相关
  background?: string;
  children?: React.ReactNode;
  
  // 表单验证
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  
  // 自定义属性
  [key: string]: any;
}

// 布局配置接口
export interface LayoutConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
  overlay?: boolean;
  zIndex?: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
}

// 组件配置接口
export interface ComponentConfig {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  layout: LayoutConfig;
  // 组件元数据
  meta?: {
    name: string;
    description?: string;
    category: 'basic' | 'form' | 'layout' | 'media';
    icon?: string;
    version?: string;
  };
}

// 布局数据接口
export interface LayoutData {
  components: ComponentConfig[];
  containerWidth: number;
  cols: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
  // 表单配置
  formConfig?: {
    title?: string;
    description?: string;
    submitText?: string;
    resetText?: string;
    onSubmit?: (data: any) => void;
  };
}

// 组件模板接口（用于左侧组件库）
export interface ComponentTemplate {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  category: 'basic' | 'form' | 'layout' | 'media';
  defaultProps: ComponentProps;
  defaultLayout: Omit<LayoutConfig, 'x' | 'y'>; // 不包含位置，位置由拖拽时确定
  preview: React.ComponentType<{ config: ComponentConfig }>;
}

// 选中状态接口
export interface SelectionState {
  selectedComponentId: string | null;
  selectedComponents: string[]; // 支持多选
  hoveredComponentId: string | null;
}

// 编辑器状态接口
export interface EditorState {
  mode: 'edit' | 'preview';
  selection: SelectionState;
  clipboard: ComponentConfig | null;
  history: {
    past: LayoutData[];
    present: LayoutData;
    future: LayoutData[];
  };
  // 画布配置
  canvas: {
    zoom: number;
    gridSize: number;
    showGrid: boolean;
    snapToGrid: boolean;
  };
}

// 属性面板配置
export interface PropertyPanelConfig {
  sections: PropertySection[];
}

export interface PropertySection {
  id: string;
  title: string;
  properties: PropertyConfig[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface PropertyConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'range' | 'file';
  path: string; // 在props中的路径，如 'style.fontSize'
  options?: { label: string; value: any }[]; // 用于select类型
  min?: number; // 用于number和range类型
  max?: number;
  step?: number;
  placeholder?: string;
  description?: string;
  condition?: (props: ComponentProps) => boolean; // 条件显示
}

// 事件类型
export interface FormBuilderEvents {
  onComponentAdd: (component: ComponentConfig) => void;
  onComponentUpdate: (id: string, updates: Partial<ComponentConfig>) => void;
  onComponentDelete: (id: string) => void;
  onComponentSelect: (id: string | null) => void;
  onLayoutChange: (layout: LayoutData) => void;
  onModeChange: (mode: 'edit' | 'preview') => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: (component: ComponentConfig) => void;
  onPaste: (component: ComponentConfig) => void;
}
