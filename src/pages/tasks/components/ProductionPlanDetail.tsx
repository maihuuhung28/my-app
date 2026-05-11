import { useState } from 'react';
import DataGrid, {
  Column,
  Scrolling,
  HeaderFilter,
  Editing,
} from 'devextreme-react/data-grid';
import { productionPlanDetailData } from '../data/productionPlanDetail.data';

interface ProductionPlanDetailProps {
  selectedLineIds: string[];   
}

// Hàm tính Inline days (cột Duty Qty chia cột Target)
//làm tròn giá trị lên
const calculateInlineDays = (row: any) => {
  if (!row?.dutyQty || !row?.target || row.target === 0) return 0; 
  return Math.ceil(row.dutyQty / row.target); //DutyQty chia cho Target làm tròn lên để đảm bảo đủ ngày sản xuất
};

// Hàm tính Est. Offline Date
const calculateEstOfflineDate = (row: any) => {
  if (!row?.inlineDate) return null;

  let daysToAdd = calculateInlineDays(row);
  if (row.conversionTime === "Conv") {
    daysToAdd += 3;
  }

  const date = new Date(row.inlineDate);
  date.setDate(date.getDate() + daysToAdd);
  
  //trừ Chủ Nhật
  let addedDays = 0;
  while (addedDays < daysToAdd) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) { // Nếu không phải Chủ Nhật
      addedDays++;
    }
  }
  return date;
};

export function ProductionPlanDetail({ selectedLineIds = [] }: ProductionPlanDetailProps) {
  const dataSource = productionPlanDetailData.filter(row => 
    selectedLineIds.includes(row.line)
  );

  if (dataSource.length === 0) return null;

  return (
    <div className="production-plan-detail">
      <h5 className="mb-3">PRODUCTION PLAN DETAIL</h5>
      
      <DataGrid
        dataSource={dataSource}
        height={450}
        showBorders={true}
        showRowLines={true}
        showColumnLines={true}
        rowAlternationEnabled={true}
        columnAutoWidth
        wordWrapEnabled
      >
        <Scrolling mode="standard" showScrollbar="always" />
        <HeaderFilter visible />
        <Editing mode="cell" allowUpdating={true} />

        <Column dataField="line" caption="LINE" width={90} allowEditing={false} />
        <Column dataField="season" caption="Season" width={100} allowEditing={false} />
        <Column dataField="style" caption="Style" width={150} allowEditing={false} />
        <Column dataField="buy" caption="BUY" width={120} allowEditing={false} />
        <Column dataField="category" caption="Category" width={110} allowEditing={true} />
        <Column dataField="orderQty" caption="Order Qty" dataType="number" format="#,##0" width={120} allowEditing={false} />
        <Column dataField="dutyQty" caption="Duty Qty" dataType="number" format="#,##0" width={120} allowEditing={true} />
        <Column dataField="target" caption="Target" dataType="number" format="#,##0" width={110} allowEditing={true} />
        
        <Column 
          dataField="InlineDays" 
          caption="Inline days" 
          dataType="number" 
          width={140} 
          allowEditing={false}
          calculateCellValue={calculateInlineDays}
        />

        <Column dataField="conversionTime" caption="Conv." width={100} allowEditing={true} />

        <Column 
          dataField="inlineDate" 
          caption="Inline Date" 
          dataType="date" 
          format="dd/MM/yyyy" 
          width={130} 
          allowEditing={true} 
        />

        <Column 
          dataField="estOfflineDate" 
          caption="Est. Offline" 
          dataType="date" 
          format="dd/MM/yyyy" 
          width={140} 
          allowEditing={false}
          calculateCellValue={calculateEstOfflineDate}
        />

        <Column dataField="actualOfflineDate" caption="Actual Offline" dataType="date" format="dd/MM/yyyy" width={140} allowEditing={true} />
        <Column dataField="finalOfflineDate" caption="Final Offline" dataType="date" format="dd/MM/yyyy" width={140} allowEditing={false} />
        <Column dataField="crd" caption="CRD" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={false} />
      </DataGrid>
    </div>
  );
}