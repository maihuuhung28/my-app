// LineSchedule.tsx
import React, { useMemo } from 'react';
import Gantt, { Tasks, Column, Editing, Validation, Toolbar, Item } from 'devextreme-react/gantt';
import { lineScheduleData, PLANNING_COLORS } from './LineSchedule.data';
import { GanttTaskTemplate } from './GanttTaskTemplate';

export const LineSchedule: React.FC<{ selectedOrder?: any }> = ({ selectedOrder }) => {
  
  const tasks = useMemo(() => {
    const flatData: any[] = [];
    const baseDate = new Date(2026, 3, 1); 

    lineScheduleData.forEach((line) => {

      flatData.push({
        id: line.LineName,
        title: line.LineName,
        pri: line.PRI,
        lineType: line.LineType,
        start: new Date(2026, 3, 1),
        end: new Date(2026, 3, 30),
        isParent: true
      });

      line.ScheduleTasks.forEach((t, idx) => {
        const startDate = new Date(baseDate);
        startDate.setDate(baseDate.getDate() + (t.startDay - 1));
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + t.duration);
  
        // RULE: So sánh ngày bắt đầu may với ngày QVT (Vật tư)
        const isLate = startDate < t.QVTDate; 

        flatData.push({
          id: `${line.LineName}_task_${idx}`,
          parentId: line.LineName,
          title: `${t.Style} (${t.Quantity} pcs)`,
          start: startDate,
          end: endDate,
          color: isLate ? PLANNING_COLORS.late : PLANNING_COLORS.ontime,
          isLate: isLate
        });
      });
    });
    return flatData;
  }, []);

  return (
    <div className="line-schedule-container" style={{ marginTop: '25px', padding: '10px' }}>
      <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Bảng 2: Biểu đồ chuyền theo Timeline (APS)</h3>
      
      <div className="grid-container planning-gantt">
        <Gantt
          taskListWidth={320} // Độ rộng 3 cột PRI, LINE, TYPE
          height={480}
          scaleType="days"
          viewType="days"
          taskTitlePosition="none"
          taskContentComponent={GanttTaskTemplate} 
          showResources={false}
          rowHeight={42}
        >
          <Column dataField="pri" caption="PRI" width={60} alignment="center" />
          <Column dataField="title" caption="LINE" width={120} />
          <Column dataField="lineType" caption="TYPE" width={100} alignment="center" />
          
          <Tasks dataSource={tasks} />

          <Toolbar>
            <Item name="zoomIn" />
            <Item name="zoomOut" />
          </Toolbar>

          <Editing enabled={true} />
          <Validation autoUpdateParentTasks={true} />
        </Gantt>
      </div>

      {/* Chú thích màu sắc */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: PLANNING_COLORS.ontime, borderRadius: '2px' }} />
          <span>Vật tư OK</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: PLANNING_COLORS.late, borderRadius: '2px', border: '1px solid #a93226' }} />
          <span>Trễ vật tư (Check QVT Date)</span>
        </div>
      </div>
    </div>
  );
};