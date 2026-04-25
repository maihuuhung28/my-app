import React from 'react';
import DataGrid, { Column, Selection, FilterRow, HeaderFilter } from 'devextreme-react/data-grid';
import DateBox from 'devextreme-react/date-box';
import Gantt, { Tasks } from 'devextreme-react/gantt';
import { lineScheduleData, ganttTasks } from '../data/LineSchedule.data';

interface LineScheduleProps {selectedOrder: any;}

export function LineSchedule({selectedOrder}: LineScheduleProps) {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 12,
          alignItems: 'flex-end',
        }}
      >
        <DateBox type="date" label="Inline" />
        <DateBox type="date" label="Offline" />
      </div>

      {/* GRID + GANTT */}
      <div style={{ display: 'flex', gap: 12 }}>
        {/* LEFT: DATAGRID */}
        <div style={{ flex: 1 }}>
          <DataGrid
            dataSource={lineScheduleData}
            keyExpr="id"
            showBorders
            columnAutoWidth
            height={350}
          >
            <Selection mode="multiple" />

            <Column dataField="priLine" caption="PRI Line" />
            <Column dataField="line" caption="Line" />
            <Column dataField="lineType" caption="Line Type" />
          
            <Column
              caption="Summary"
              cellRender={(cell) => {
                const d = cell.data;
                return `${d.style}-${d.buy}-${d.season}`;
              }}
            />

            <Column
              dataField="inline"
              caption="Inline"
              dataType="date"
              format="dd/MM/yyyy"
            />
            <Column
              dataField="offline"
              caption="Offline"
              dataType="date"
              format="dd/MM/yyyy"
            />
          </DataGrid>
        </div>

        {/* RIGHT: GANTT */}
        <div style={{ flex: 2 }}>
          <Gantt
            height={350}
            scaleType="days"
            taskListWidth={10}
            showDependencies={false}
            showResources={false}
          >
            <Tasks dataSource={ganttTasks} />
          </Gantt>
        </div>
      </div>
    </div>
  );
}