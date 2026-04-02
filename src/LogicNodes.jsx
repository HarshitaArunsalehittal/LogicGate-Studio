import React from 'react';
import { Handle, Position } from '@xyflow/react';

const nodeStyle = {
  padding: '10px 20px',
  borderRadius: '8px',
  background: 'rgba(30, 41, 59, 0.8)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.5)',
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(8px)',
  minWidth: '80px',
  textAlign: 'center',
};

const gateIconStyle = {
  marginRight: '8px',
  fontSize: '18px',
};

export const InputNode = ({ data }) => {
  return (
    <div style={{ ...nodeStyle, background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981' }}>
      <div style={{ padding: '5px' }}>{data.label}</div>
      <Handle type="source" position={Position.Right} style={{ background: '#10b981' }} />
    </div>
  );
};

export const AndNode = ({ data }) => {
  return (
    <div style={{ ...nodeStyle, background: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6' }} />
      <span style={gateIconStyle}>&</span>
      <div>AND</div>
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6' }} />
    </div>
  );
};

export const OrNode = ({ data }) => {
  return (
    <div style={{ ...nodeStyle, background: 'rgba(245, 158, 11, 0.2)', borderColor: '#f59e0b' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#f59e0b' }} />
      <span style={gateIconStyle}>≥1</span>
      <div>OR</div>
      <Handle type="source" position={Position.Right} style={{ background: '#f59e0b' }} />
    </div>
  );
};

export const XorNode = ({ data }) => {
  return (
    <div style={{ ...nodeStyle, background: 'rgba(236, 72, 153, 0.2)', borderColor: '#ec4899' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#ec4899' }} />
      <span style={gateIconStyle}>=1</span>
      <div>XOR</div>
      <Handle type="source" position={Position.Right} style={{ background: '#ec4899' }} />
    </div>
  );
};

export const NotNode = ({ data }) => {
  return (
    <div style={{ ...nodeStyle, background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#ef4444' }} />
      <span style={gateIconStyle}>!</span>
      <div>NOT</div>
      <Handle type="source" position={Position.Right} style={{ background: '#ef4444' }} />
    </div>
  );
};
