import React from 'react';
import DataGrid, {
  Column,
  Scrolling,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  Selection,
} from 'devextreme-react/data-grid';

import { orders } from '../data/order.data';

interface Props {
  onSelectOrder?: (order: any) => void;
}

export function OrdersTable({ onSelectOrder }: Props) {
  
  // Logic tính toán ngày bắt đầu sớm nhất dựa trên Special Notes
  const calculateEarliestStart = (data: any) => {
    if (!data?.eta) return null;

    const etaDate = new Date(data.eta);
    let daysToAdd = 6; // Mặc định là 6 ngày

    const notes = data.specialNotes || '';
    if (notes.includes('Print/EMB difficult') || notes.includes('Quilting difficult')) {
      daysToAdd = 19;
    } else if (notes.includes('Print/EMB')) {
      daysToAdd = 12;
    } 

    etaDate.setDate(etaDate.getDate() + daysToAdd);
    return etaDate;
  };

  return (
    <div className="grid-container orders-table">
      <DataGrid
        dataSource={orders}
        height={450}
        showBorders
        focusedRowEnabled
        columnAutoWidth
        wordWrapEnabled
        onRowClick={(e) => onSelectOrder?.(e.data)}
      >

        <Scrolling mode="standard" showScrollbar="always" />
        <FilterRow visible />
        <HeaderFilter visible />
        <Selection mode="single" />
        <ColumnChooser enabled />

        {/* CÁC CỘT THÔNG TIN ĐƠN HÀNG */}
        <Column caption="Thông tin đơn hàng">
          <Column dataField="season" caption="Season" fixed width={110} />
          <Column dataField="style" caption="Style" fixed width={140} />
          <Column dataField="buy" caption="Buy" width={120} />
          <Column dataField="color" caption="Color" width={120} />
          <Column 
            dataField="firstCrd" 
            caption="First CRD" 
            dataType="date" 
            format="dd/MM/yyyy" 
            width={130} 
          />
          <Column 
            dataField="qtyOrder" 
            caption="Qty Order" 
            dataType="number" 
            format="#,##0" 
            width={120} 
          />
          <Column dataField="productType" caption="Product Type" width={160} />
          <Column dataField="specialNotes" caption="Special Notes" width={200} />
        </Column>

        {/* CÁC CỘT TÌNH TRẠNG NGUYÊN PHỤ LIỆU */}
        <Column caption="Tình trạng Nguyên phụ liệu">
          <Column 
            dataField="materialStatus" 
            caption="Status Material" 
            width={160} 
            cellRender={(d) => (
              <span style={{ 
                color: d.value === 'DATE - OK' ? '#27ae60' : '#e74c3c', 
                fontWeight: 'bold' 
              }}>
                {d.value}
              </span>
            )}
          />
          <Column 
            dataField="eta" 
            caption="ETA" 
            dataType="date" 
            format="dd/MM/yyyy" 
            width={120} 
          />

          <Column
            caption="Earliest Line Start"
            calculateCellValue={calculateEarliestStart}
            dataType="date"
            format="dd/MM/yyyy"
            width={180}
            cssClass="highlight-date-column"
          />
        </Column>

        {/*Plan Status*/}
        <Column 
          dataField="planStatus" 
          caption="Plan Status" 
          fixed={true}
          fixedPosition="right" 
          width={170}
          alignment="center"
          cellRender={(data: any) => {
            const value = data.value || '';
            let statusClass = "status-notyet";

            // Logic chọn Class dựa trên giá trị dữ liệu
            if (value === 'Already have') {
              statusClass = "status-already";

            } else if (value.includes('Partial')) {
              statusClass = "status-partial";

            } else if (value === 'Not yet have') {
              statusClass = "status-notyet";
            }
            return (
              
              <div className={`badge status-badge ${statusClass}`}>
                {value}
              </div>
            );
          }}
        />
      </DataGrid>
    </div>
  );
}