import React from 'react';
import Gantt, {  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation } from 'devextreme-react/gantt';

import { ganttTasks } from '../data/gantt.data';

interface Props {
  selectedOrder?: any;
}

export function LineSchedule({ selectedOrder }: Props) {
  return (
    <div className="gantt-container">
      <h3></h3>

      {!selectedOrder && (
        <div className="no-selection-message">
        </div>
      )}

      <Gantt
        taskListWidth={380}
        height={550}
        scaleType="days"
        showResources={false}
        showDependencies={false}
      >
        <Tasks dataSource={ganttTasks} />

        <Column dataField="Priline" caption="PRI Line" width={140} />
        <Column dataField="line" caption="Line" width={140} />
        <Column dataField="linetype" caption="Line Type" width={140} />
        <Column dataField="start" caption="Ngày bắt đầu" dataType="date" format="dd/MM/yyyy" />
        <Column dataField="end" caption="Ngày kết thúc" dataType="date" format="dd/MM/yyyy" />
        <Column dataField="progress" caption="Tiến độ" />

        <Editing enabled={true} />

        <Toolbar>
          <Item name="zoomIn" />
          <Item name="zoomOut" />
          <Item name="undo" />
          <Item name="redo" />
        </Toolbar>


      </Gantt>
    </div>
  );
}