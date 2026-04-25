import React from 'react';
import DataGrid, {Column, Scrolling, HeaderFilter, Selection} from 'devextreme-react/data-grid';
import { orders } from '../data/order.data';

interface Props {
  onSelectOrder?: (order: any) => void;
}
//Logic nghiệp vụ
export function OrdersTable({ onSelectOrder }: Props) {
  
  const calculateEarliestStart = (data: any) => {
    if (!data?.eta) return null;

    const etaDate = new Date(data.eta);
    let daysToAdd = 6; // Mặc định 6 ngày làm (T2 -> T7)

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
        focusedRowEnabled={false}
        columnAutoWidth
        wordWrapEnabled
        onRowClick={(e) => onSelectOrder?.(e.data)}
      >

        <Scrolling mode="standard" showScrollbar="always" />
        <HeaderFilter visible = {false}/>
        <Selection mode="single" />

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
          />
          
          <Column 
            dataField="qtyOrder" 
            caption="Qty Order" 
            dataType="number" 
            format="#,##0" 
            width={120}
            alignment="left" 
          />

          <Column dataField="balQty" caption="Bal Qty" width={110} alignment="left" />
          <Column dataField="smv" caption="SMV" width={160} alignment="left" />
          <Column dataField="category" caption="Category" width={180} alignment="left" />
          <Column dataField="productType" caption="Product Type" width={160} alignment="left" />
          <Column dataField="specialNotes" caption="Special Notes" width={160} alignment="left"/>
        </Column>

        {/*MỤC TÌNH TRẠNG NGUYÊN PHỤ LIỆU */}
        <Column caption="Tình trạng Nguyên Phụ Liệu">
          <Column 
            dataField="materialStatus" 
            caption="Status Material"
            width={160} 
            cellRender={(d) => (
              <span style={{ 
                                                //Xanh: Date-ok, Đỏ: Date-Not Yet
                color: d.value === 'DATE - OK' ? '#27ae60' : '#e74c3c', 
                fontWeight: 'bold' 
              }}
              >
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

        {/*Trạng thái kế hoạch/Plan Status*/}
        <Column
          dataField="planStatus"
          caption="Plan Status" 
          fixed={true}
          fixedPosition="right" 
          width={170}
          alignment="left"
          cellRender={(data: any) => {
            const value = data.value || '';
            let statusClass = "status-notyet";

            // Chọn Class dựa trên giá trị dữ liệu
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