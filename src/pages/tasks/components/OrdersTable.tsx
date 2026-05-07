import DataGrid, { Column, Scrolling, HeaderFilter, Selection } from 'devextreme-react/data-grid';
import { orders, type Order } from '../data/order.data';

interface Props {
  selectedOrderId?: number;
  onSelectOrder?: (order: Order) => void;
}

const getPlanStatusBadge = (value = '') => {
  if (value === 'Done' || value === 'Already have' || value === 'Already plan') {
    return { label: 'Done', className: 'bg-success' };
  }

  if (value.includes('Partial') || value === 'Have Partial') {
    return { label: 'Partial', className: 'bg-warning text-dark' };
  }

  return { label: 'Pending', className: 'bg-secondary' };
};

const getMaterialStatusBadge = (value = '') => {
  if (value === 'DATE - OK' || value === 'OK' || value === 'Done') {
    return { label: 'OK', className: 'bg-success' };
  }

  if (value.includes('Partial')) {
    return { label: 'Partial', className: 'bg-warning text-dark' };
  }

  return { label: 'Pending', className: 'bg-secondary' };
};

export function OrdersTable({ selectedOrderId, onSelectOrder }: Props) {
  const calculateEarliestStart = (data: any) => {
    if (!data?.eta) return null;

    const etaDate = new Date(data.eta);
    let daysToAdd = 6;

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
        keyExpr="id"
        height={450}
        showBorders
        focusedRowEnabled={false}
        selectedRowKeys={selectedOrderId ? [selectedOrderId] : []}
        columnAutoWidth
        wordWrapEnabled
        onRowClick={(e) => onSelectOrder?.(e.data)}
        onSelectionChanged={(e) => {
          const order = e.selectedRowsData[0] as Order | undefined;
          if (order) onSelectOrder?.(order);
        }}
      >
        <Scrolling mode="standard" showScrollbar="always" />
        <HeaderFilter visible={true} />
        <Selection mode="single" />

        <Column caption="THÔNG TIN ĐƠN HÀNG">
          <Column dataField="season" caption="Season" fixed width={110} />
          <Column dataField="style" caption="Style" fixed width={140} />
          <Column dataField="buy" caption="Buy" width={120} />
          <Column dataField="color" caption="Color" width={120} />
          <Column dataField="firstCrd" caption="First CRD" dataType="date" format="dd/MM/yyyy" width={120} />
          <Column dataField="qtyOrder" caption="Qty Order" dataType="number" format="#,##0" width={120} alignment="left" />
          <Column dataField="balQty" caption="Bal Qty" width={110} alignment="left" />
          <Column dataField="smv" caption="SMV" width={160} alignment="left" />
          <Column dataField="category" caption="Category" width={180} alignment="left" allowEditing={true} />
          <Column dataField="productType" caption="Product Type" width={160} alignment="left" allowEditing={true} />
        </Column>

        <Column caption="TÌNH TRẠNG NGUYÊN PHỤ LIỆU">
          <Column
            dataField="materialStatus"
            caption="Status"
            width={120}
            allowEditing={true}
            cellRender={(d) => {
              const status = getMaterialStatusBadge(d.value);

              return <span className={`badge status-badge ${status.className}`}>{status.label}</span>;
            }}
          />
          <Column dataField="eta" caption="ETA" dataType="date" format="dd/MM/yyyy" width={120} />
          <Column
            caption="Earliest Line Start"
            calculateCellValue={calculateEarliestStart}
            dataType="date"
            format="dd/MM/yyyy"
            width={180}
            cssClass="highlight-date-column"
          />
        </Column>

        <Column
          dataField="planStatus"
          caption="Plan Status"
          fixed={true}
          fixedPosition="right"
          width={120}
          alignment="left"
          cellRender={(data: any) => {
            const status = getPlanStatusBadge(data.value);

            return <div className={`badge status-badge ${status.className}`}>{status.label}</div>;
          }}
        />
      </DataGrid>
    </div>
  );
}
