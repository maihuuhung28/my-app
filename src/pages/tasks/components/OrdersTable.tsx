import { useState, useMemo } from "react";
import DataGrid, {
  Column,
  Editing,
  HeaderFilter,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import { orders, type Order } from "../data/order.data";
import { OrdersFilter, type FilterState } from "./OrdersFilter";
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  selectedOrderId?: number;
  getPlanStatus?: (orderId: number) => string;
  onSelectOrder?: (order: Order) => void;
}

const getPlanStatusBadge = (value = "") => {
  if (
    value === "Done" ||
    value === "OK" ||
    value === "DATE - OK" ||
    value === "Already plan"
  ) {
    return { label: "Done", className: "bg-success" };
  }

  if (value.includes("Partial") || value === "Have Partial") {
    return { label: "Partial", className: "bg-warning text-dark" };
  }

  return { label: "Pending", className: "bg-secondary" };
};

const getMaterialStatusBadge = (value = "") => {
  if (value === "DATE - OK" || value === "OK" || value === "Done") {
    return { label: "OK", className: "bg-success" };
  }

  if (value.includes("Partial")) {
    return { label: "Partial", className: "bg-warning text-dark" };
  }

  return { label: "Pending", className: "bg-secondary" };
};

export function OrdersTable({ selectedOrderId, getPlanStatus, onSelectOrder }: Props) {
  const [filters, setFilters] = useState<FilterState>({});

  const calculateEarliestStart = (data: Order) => {
    if (!data.eta) return null;

    const etaDate = new Date(data.eta);
    const daysToAdd = 15;
    etaDate.setDate(etaDate.getDate() + daysToAdd);
    return etaDate;
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by Season
      if (filters.season && order.season !== filters.season) {
        return false;
      }
      //Filter Styles
      if (filters.styles && order.style !== filters.styles) {
        return false;
      }

      // Filter by Buy
      if (filters.buy && order.buy !== filters.buy) {
        return false;
      }
      // Filter by Status
      if (filters.status && order.planStatus !== filters.status) {
        return false;
      }
      // Filter by Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !order.style.toLowerCase().includes(searchLower) &&
          !order.color.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="grid-container orders-table">
      <OrdersFilter onFilter={setFilters} />
      
      <DataGrid
        dataSource={filteredOrders}
        keyExpr="id"
        height={450}
        showBorders
        focusedRowEnabled={false}
        selectedRowKeys={selectedOrderId ? [selectedOrderId] : []}
        columnAutoWidth
        wordWrapEnabled
        onRowClick={(event) => onSelectOrder?.(event.data as Order)}
        onSelectionChanged={(event) => {
          const order = event.selectedRowsData[0] as Order | undefined;
          if (order) onSelectOrder?.(order);
        }}
      >
        <Editing mode="cell" allowUpdating={true} />
        <Scrolling mode="standard" showScrollbar="always" />
        <HeaderFilter visible={true} />
        <Selection mode="single" />

        <Column caption="THÔNG TIN ĐƠN HÀNG">
          <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
          <Column dataField="style" caption="Style" fixed width={140} allowEditing={false} />
          <Column dataField="buy" caption="Buy" width={90} allowEditing={false} />
          <Column dataField="color" caption="Color" width={90} allowEditing={false} />
          <Column dataField="firstCrd" caption="First CRD" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={false} />
          <Column dataField="qtyOrder" caption="Qty Order" dataType="number" format="#,##0" width={120} alignment="left" allowEditing={false} />
          <Column dataField="balQty" caption="Bal Qty" width={110} alignment="left" allowEditing={false} />
          <Column dataField="smv" caption="SMV" width={90} alignment="left" allowEditing={false} />
          <Column dataField="category" caption="Category" width={120} alignment="left" allowEditing={false} />
          <Column dataField="productType" caption="Product Type" width={160} alignment="left" allowEditing={false} />
        </Column>

        <Column caption="TÌNH TRẠNG NGUYÊN PHỤ LIỆU">
          <Column
            dataField="materialStatus"
            caption="Status Material"
            width={150}
            allowEditing={false}
            cellRender={(data: { value?: string }) => {
              const status = getMaterialStatusBadge(data.value);
              return (
                <span className={`badge status-badge ${status.className}`}>
                  {status.label}
                </span>
              );
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
          allowEditing={false}
          cellRender={(data: { value?: string }) => {
            const order = data as { data?: Order; value?: string };
            const statusValue = order.data
              ? getPlanStatus?.(order.data.id) ?? data.value
              : data.value;
            const status = getPlanStatusBadge(statusValue);
            return (
              <div className={`badge status-badge ${status.className}`}>
                {status.label}
              </div>
            );
          }}
        />
      </DataGrid>
    </div>
  );
}
