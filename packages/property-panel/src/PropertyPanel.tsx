import React, { useCallback } from 'react';
import { ComponentConfig, PropertyPanelConfig, PropertyConfig } from '@formbuilder/core/dist/index.js';

interface PropertyPanelProps {
  selectedComponent: ComponentConfig | null;
  onUpdateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
  className?: string;
}

// 属性配置
const PROPERTY_CONFIGS: Record<string, PropertyConfig[]> = {
  basic: [
    {
      id: 'id',
      label: 'ID',
      type: 'text',
      path: 'id',
      description: '组件的唯一标识符'
    },
    {
      id: 'className',
      label: 'CSS类名',
      type: 'text',
      path: 'className',
      description: '自定义CSS类名'
    }
  ],
  text: [
    {
      id: 'content',
      label: '文本内容',
      type: 'textarea',
      path: 'props.content',
      description: '显示的文本内容'
    },
    {
      id: 'fontSize',
      label: '字体大小',
      type: 'text',
      path: 'props.fontSize',
      description: '字体大小，如：16px, 1.2em'
    },
    {
      id: 'color',
      label: '文字颜色',
      type: 'color',
      path: 'props.color',
      description: '文字颜色'
    },
    {
      id: 'fontWeight',
      label: '字体粗细',
      type: 'select',
      path: 'props.fontWeight',
      options: [
        { label: '正常', value: 'normal' },
        { label: '粗体', value: 'bold' }
      ],
      description: '字体粗细'
    },
    {
      id: 'textAlign',
      label: '对齐方式',
      type: 'select',
      path: 'props.textAlign',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' }
      ],
      description: '文本对齐方式'
    }
  ],
  button: [
    {
      id: 'text',
      label: '按钮文字',
      type: 'text',
      path: 'props.text',
      description: '按钮上显示的文字'
    },
    {
      id: 'type',
      label: '按钮类型',
      type: 'select',
      path: 'props.type',
      options: [
        { label: '普通按钮', value: 'button' },
        { label: '提交按钮', value: 'submit' },
        { label: '重置按钮', value: 'reset' }
      ],
      description: '按钮类型'
    },
    {
      id: 'disabled',
      label: '禁用状态',
      type: 'boolean',
      path: 'props.disabled',
      description: '是否禁用按钮'
    }
  ],
  input: [
    {
      id: 'placeholder',
      label: '占位符',
      type: 'text',
      path: 'props.placeholder',
      description: '输入框占位符文字'
    },
    {
      id: 'value',
      label: '默认值',
      type: 'text',
      path: 'props.value',
      description: '输入框的默认值'
    },
    {
      id: 'required',
      label: '必填',
      type: 'boolean',
      path: 'props.required',
      description: '是否为必填项'
    },
    {
      id: 'disabled',
      label: '禁用状态',
      type: 'boolean',
      path: 'props.disabled',
      description: '是否禁用输入框'
    }
  ],
  image: [
    {
      id: 'src',
      label: '图片地址',
      type: 'text',
      path: 'props.src',
      description: '图片的URL地址'
    },
    {
      id: 'alt',
      label: '替代文字',
      type: 'text',
      path: 'props.alt',
      description: '图片无法显示时的替代文字'
    },
    {
      id: 'objectFit',
      label: '适应方式',
      type: 'select',
      path: 'props.objectFit',
      options: [
        { label: '覆盖', value: 'cover' },
        { label: '包含', value: 'contain' },
        { label: '填充', value: 'fill' },
        { label: '缩放', value: 'scale-down' }
      ],
      description: '图片如何适应容器'
    }
  ],
  container: [
    {
      id: 'children',
      label: '容器内容',
      type: 'textarea',
      path: 'props.children',
      description: '容器内的文本内容'
    },
    {
      id: 'background',
      label: '背景色',
      type: 'color',
      path: 'props.background',
      description: '容器的背景颜色'
    }
  ],
  layout: [
    {
      id: 'x',
      label: 'X坐标',
      type: 'number',
      path: 'layout.x',
      description: '组件在网格中的X坐标'
    },
    {
      id: 'y',
      label: 'Y坐标',
      type: 'number',
      path: 'layout.y',
      description: '组件在网格中的Y坐标'
    },
    {
      id: 'w',
      label: '宽度',
      type: 'number',
      path: 'layout.w',
      min: 1,
      description: '组件占用的网格宽度'
    },
    {
      id: 'h',
      label: '高度',
      type: 'number',
      path: 'layout.h',
      min: 1,
      description: '组件占用的网格高度'
    },
    {
      id: 'static',
      label: '固定位置',
      type: 'boolean',
      path: 'layout.static',
      description: '是否固定位置（不可拖拽）'
    },
    {
      id: 'overlay',
      label: '覆盖模式',
      type: 'boolean',
      path: 'layout.overlay',
      description: '是否为覆盖元素'
    },
    {
      id: 'zIndex',
      label: '层级',
      type: 'number',
      path: 'layout.zIndex',
      description: '元素的层级（数字越大越靠前）'
    }
  ]
};

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  className = ''
}) => {
  // 更新属性值
  const updateProperty = useCallback((path: string, value: any) => {
    if (!selectedComponent) return;

    const keys = path.split('.');
    const updates: any = {};
    let current = updates;

    // 构建嵌套对象
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = current[keys[i]] || {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    onUpdateComponent(selectedComponent.id, updates);
  }, [selectedComponent, onUpdateComponent]);

  // 获取属性值
  const getPropertyValue = useCallback((path: string) => {
    if (!selectedComponent) return '';

    const keys = path.split('.');
    let current: any = selectedComponent;

    for (const key of keys) {
      current = current?.[key];
      if (current === undefined) return '';
    }

    return current;
  }, [selectedComponent]);

  // 渲染属性输入控件
  const renderPropertyInput = (config: PropertyConfig) => {
    const value = getPropertyValue(config.path);

    switch (config.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateProperty(config.path, e.target.value)}
            placeholder={config.placeholder}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateProperty(config.path, e.target.value)}
            placeholder={config.placeholder}
            rows={3}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateProperty(config.path, Number(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => updateProperty(config.path, e.target.checked)}
            style={{ marginRight: '8px' }}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => updateProperty(config.path, e.target.value)}
            style={{
              width: '100%',
              height: '32px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateProperty(config.path, e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return <div>不支持的属性类型</div>;
    }
  };

  if (!selectedComponent) {
    return (
      <div className={`property-panel ${className}`} style={{
        width: '300px',
        height: '100%',
        background: '#f8f9fa',
        borderLeft: '1px solid #dee2e6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <div>选择一个组件来编辑属性</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`property-panel ${className}`} style={{
      width: '300px',
      height: '100%',
      background: '#f8f9fa',
      borderLeft: '1px solid #dee2e6',
      overflowY: 'auto',
      padding: '16px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {selectedComponent.meta?.name || selectedComponent.type}
        </h3>
        <div style={{
          fontSize: '12px',
          color: '#666',
          background: '#e9ecef',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {selectedComponent.type}
        </div>
      </div>

      {/* 基础属性 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333'
        }}>
          基础属性
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PROPERTY_CONFIGS.basic.map((config) => (
            <div key={config.id}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#555',
                marginBottom: '4px'
              }}>
                {config.label}
              </label>
              {renderPropertyInput(config)}
              {config.description && (
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  marginTop: '2px'
                }}>
                  {config.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 组件特定属性 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333'
        }}>
          组件属性
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PROPERTY_CONFIGS[selectedComponent.type]?.map((config) => (
            <div key={config.id}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#555',
                marginBottom: '4px'
              }}>
                {config.label}
              </label>
              {renderPropertyInput(config)}
              {config.description && (
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  marginTop: '2px'
                }}>
                  {config.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 布局属性 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333'
        }}>
          布局属性
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PROPERTY_CONFIGS.layout.map((config) => (
            <div key={config.id}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#555',
                marginBottom: '4px'
              }}>
                {config.label}
              </label>
              {renderPropertyInput(config)}
              {config.description && (
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  marginTop: '2px'
                }}>
                  {config.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
