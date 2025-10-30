import React, { useState } from 'react';

interface OverlayToggleProps {
  isOverlay: boolean;
  onToggle: (isOverlay: boolean) => void;
  onSetTarget: (targetId: string) => void;
  availableTargets: Array<{ id: string; label: string }>;
  className?: string;
}

const OverlayToggle: React.FC<OverlayToggleProps> = ({
  isOverlay,
  onToggle,
  onSetTarget,
  availableTargets,
  className = ''
}) => {
  const [showTargets, setShowTargets] = useState(false);

  const handleToggleOverlay = () => {
    onToggle(!isOverlay);
    if (!isOverlay) {
      setShowTargets(true);
    }
  };

  const handleSelectTarget = (targetId: string) => {
    onSetTarget(targetId);
    setShowTargets(false);
  };

  return (
    <div className={`overlay-toggle ${className}`} style={{ position: 'relative' }}>
      {/* 主切换按钮 */}
      <button
        onClick={handleToggleOverlay}
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: 'none',
          background: isOverlay ? '#ff6b6b' : '#007bff',
          color: 'white',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title={isOverlay ? '取消覆盖' : '设为覆盖元素'}
      >
        {isOverlay ? '×' : 'O'}
      </button>

      {/* 目标选择下拉菜单 */}
      {showTargets && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '-8px',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 1001,
            minWidth: '120px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              color: '#666',
              borderBottom: '1px solid #eee'
            }}
          >
            选择覆盖目标：
          </div>
          {availableTargets.map(target => (
            <button
              key={target.id}
              onClick={() => handleSelectTarget(target.id)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {target.label}
            </button>
          ))}
          <button
            onClick={() => setShowTargets(false)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              background: '#f8f9fa',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#666',
              borderTop: '1px solid #eee'
            }}
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
};

export default OverlayToggle;
