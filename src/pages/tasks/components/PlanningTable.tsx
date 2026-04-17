import React from 'react';
import DataGrid, { Column, Scrolling, Selection } from 'devextreme-react/data-grid';
import { planningData } from '../data/planning.data';
 
export function PlanningTable({ onLineSelectionChange }: any) {
  
  // Logic render dải màu cho Timeline
  const renderTimelineCell = (cellData: any, dayIndex: number) => {
    // SOI DỮ LIỆU: Tìm trong mảng 'tasks' xem ngày hiện tại có mã hàng nào đang chạy không
    const task = cellData.data.tasks?.find(
      (t: any) => dayIndex >= t.startDay && dayIndex <= t.endDay
    );

    if (!task) return null; 

    // CHỈ HIỂN THỊ TEXT Ở Ô ĐẦU TIÊN của dải màu để tránh bị lặp chữ
    const isFirstCell = dayIndex === task.startDay;

    return (
      <div style={{
        backgroundColor: task.color,
        color: '#fff', 
        height: '100%',
        margin: '-5px -7px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: isFirstCell ? 'flex-start' : 'center',
        paddingLeft: isFirstCell ? '5px' : '0',
        fontSize: '10px',
        fontWeight: 600,
        overflow: 'hidden',
        whiteSpace: 'nowrap',

        borderRight: dayIndex === task.endDay ? 'none' : '1px solid rgba(255,255,255,0.2)'
      }}>
        {isFirstCell ? task.styleInfo : ''}
      </div>
    );
  };

  return (
    <div className="grid-container planning-table">
      <DataGrid
        dataSource={planningData} // Đổ dữ liệu từ planning.data vào đây
        showBorders
        showColumnLines={true}
        showRowLines={true}
        height={350}
        columnAutoWidth={false}
        onSelectionChanged={(e) => onLineSelectionChange(e.selectedRowsData)}
      >
        <Selection mode="multiple" showCheckBoxesMode="always" />
        <Scrolling mode="standard" />

        {/* KHỚP DATAFIELD VỚI FILE PLANNING.DATA.TS */}
        <Column dataField="priLine" caption="PRI Line" width={80} alignment="center" fixed />
        <Column dataField="lineName" caption="LINE" width={100} fixed />
        <Column dataField="lineType" caption="Line Type" width={100} fixed />

        {/* SINH TỰ ĐỘNG 10 CỘT NGÀY (date1 -> date10) */}
        {[...Array(10)].map((_, i) => (
          <Column
            key={i}
            caption={`date${i + 1}`}
            width={120}
            cellRender={(d) => renderTimelineCell(d, i + 1)} // Truyền dayIndex từ 1 đến 10
            alignment="center"
          />
        ))}
      </DataGrid>
    </div>
  );
}