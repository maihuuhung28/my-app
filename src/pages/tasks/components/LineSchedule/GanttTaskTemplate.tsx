// GanttTaskTemplate.tsx
import React from 'react';

export const GanttTaskTemplate = (props: any) => {
  // DevExtreme React truyền dữ liệu vào qua props.model.taskData
  const data = props.model.taskData;
  
  // Không vẽ cho hàng cha (tên chuyền)
  if (data.isParent || !data.parentId) return null;

  return (
    <div className="custom-gantt-item" style={{ 
      backgroundColor: data.color,
      height: '100%', width: '100%',
      display: 'flex', alignItems: 'center', padding: '0 10px',
      color: '#ffffff', fontSize: '11px', fontWeight: 'bold',
      borderRadius: '2px', boxSizing: 'border-box',
      border: data.isLate ? '1.5px solid #a93226' : 'none'
    }}>
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {data.isLate ? '⚠ ' : ''}{data.title}
      </div>
    </div>
  );
};