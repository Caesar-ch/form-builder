import React from 'react';
import { type ComponentTemplate } from '../types/FormBuilder.ts';

interface ComponentLibraryProps {
  templates: ComponentTemplate[];
  onDragStart: (template: ComponentTemplate) => void;
  className?: string;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  templates,
  onDragStart,
  className = ''
}) => {
  // 按分类分组组件
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ComponentTemplate[]>);

  const categoryNames = {
    basic: '基础组件',
    form: '表单组件',
    layout: '布局组件',
    media: '媒体组件'
  };

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  return (
    <div className={`component-library ${className}`} style={{
      width: '250px',
      height: '100%',
      background: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      overflowY: 'auto',
      padding: '16px'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        组件库
      </h3>

      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
        <div key={category} style={{ marginBottom: '24px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {categoryNames[category as keyof typeof categoryNames] || category}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categoryTemplates.map((template) => (
              <div
                key={template.type}
                draggable
                onDragStart={(e) => handleDragStart(e, template)}
                style={{
                  padding: '12px',
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#007bff';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,123,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: '20px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {template.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '2px'
                  }}>
                    {template.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    lineHeight: '1.3'
                  }}>
                    {template.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 拖拽提示 */}
      <div style={{
        marginTop: '24px',
        padding: '12px',
        background: '#e3f2fd',
        border: '1px solid #bbdefb',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#1976d2',
        textAlign: 'center'
      }}>
        💡 拖拽组件到画布中添加
      </div>
    </div>
  );
};

export default ComponentLibrary;
