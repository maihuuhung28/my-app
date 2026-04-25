import React from 'react';
import { productionPlanDetailData } from '../data/productionPlanDetail.data';
import DataGrid, {
  Column,
  Scrolling,
  FilterRow,
  HeaderFilter,
  Selection,
  Editing,
  Paging,
  Pager,
} from 'devextreme-react/data-grid';


export function ProductionPlanDetail() {
  return (
    <div className="grid-container">

    <DataGrid
        dataSource={productionPlanDetailData}
        height={450}
        rowAlternationEnabled={true}
        showBorders={true}
        showRowLines
        showColumnLines
        focusedRowEnabled={false}
        columnAutoWidth
        wordWrapEnabled
      >
 
    <Scrolling mode="standard" showScrollbar="always" />


    <Paging defaultPageSize={10}/>
    <Pager
    visible={true}
    displayMode="full"
    //Giãn Datagrid
    //showPageSizeSelector={true}
    //allowedPageSizes={[]}
    showInfo={true}
    showNavigationButtons={true}
    />
       
    <FilterRow visible = {false}/>
    <HeaderFilter visible />
    <Selection mode="single" />
    <Editing mode="cell" allowUpdating={true} />

    <Column 
      dataField="line" 
      caption="LINE" 
      width={100} 
      allowEditing={false}
    />
    
    <Column
      dataField="season" 
      caption="Season" 
      width={100} 
      allowEditing={false} 
    />
    
    <Column 
      dataField="style" 
      caption="Style" 
      width={140} 
      allowEditing={false} 
    />
    
    <Column 
      dataField="buy" 
      caption="BUY" 
      width={110} 
      allowEditing={false} 
    />
    
    <Column 
      dataField="category" 
      caption="Category" 
      width={110} 
      allowEditing={true} 
    />

    <Column 
      dataField="orderQty" 
      caption="Order Qty" 
      dataType="number" 
      format="#,##0" 
      width={120} 
      allowEditing={true} 
    />
    
    <Column 
      dataField="dutyQty" 
      caption="Duty Qty" 
      dataType="number" 
      format="#,##0" 
      width={110} 
      allowEditing={true} 
    />
    
    <Column 
      dataField="target" 
      caption="Target" 
      dataType="number"   
      format="#,##0" 
      width={110} 
      allowEditing={true} 
    />
    
    <Column
      dataField="inlineDays" 
      caption="inline days" 
      dataType="number" 
      width={100} 
      allowEditing={true} 
    />
    
    <Column 
      dataField="conversionTime" 
      caption="Conversion time" 
      width={160} 
      allowEditing={true} 
    />
    
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
      caption="Est. offline date" 
      dataType="date" 
      format="dd/MM/yyyy" 
      width={150} 
      allowEditing={false} 
    />
    
    <Column 
      dataField="actualOfflineDate" 
      caption="Actual offline date" 
      dataType="date" 
      format="dd/MM/yyyy" 
      width={170} 
      allowEditing={false} 
    />
    
    <Column 
      dataField="finalOfflineDate" 
      caption="Final offline date" 
      dataType="date" 
      format="dd/MM/yyyy"  
      width={170} 
      allowEditing={false} 
    />
    
    <Column 
      dataField="crd" 
      caption="CRD" 
      dataType="date" 
      format="dd/MM/yyyy" 
      width={130} 
      allowEditing={true} 
    />

    </DataGrid>
    </div>
  );
}