// // import { useMemo, useState, useCallback, memo } from "react";
// // import DataGrid, {
// //   Column,
// //   Scrolling,
// //   Selection,
// //   type DataGridRef,
// // } from "devextreme-react/data-grid";
// // import type { RowClickEvent } from "devextreme/ui/data_grid"; // Type chính thức từ DevExtreme

// // import "bootstrap/dist/css/bootstrap.min.css";
// // import { Button } from "react-bootstrap";

// // import { orders, type Order } from "../data/order.data";
// // import { OrdersFilter, type FilterState } from "./OrdersFilter";
// // import { calculateBalQty } from "../utils/order.utils";

// // const getPlanStatusBadge = (value: string = "") => {
// //   if (value === "Already plan") return { label: "Done", className: "bg-success" };
// //   if (value === "Plan Partial") return { label: "Plan Partial", className: "bg-warning text-dark" };
// //   return { label: "Pending", className: "bg-secondary" };
// // };

// // const getMaterialStatusBadge = (value: string = "") => {
// //   if (value === "Arrived OK") return { label: "Arrived OK", className: "bg-success" };
// //   if (value === "Partial Arrive" || value === "Multiple batches") {
// //     return { label: value, className: "bg-warning text-dark" };
// //   }
// //   return { label: value || "Not yet Arrived", className: "bg-secondary" };
// // };

// // //MEMOIZED CELL COMPONENTS 
// // const TechpackCell = memo(({ data, onClick }: { 
// //   data: Order; 
// //   onClick: (order: Order) => void;
// // }) => (
// //   <Button
// //     variant="outline-secondary"
// //     size="sm"
// //     onClick={(e) => {
// //       e.stopPropagation();
// //       onClick(data);
// //     }}
// //   >
// //     View
// //   </Button>
// // ));

// // const MaterialStatusCell = memo(({ value }: { value: string }) => {
// //   const status = getMaterialStatusBadge(value);
// //   return <span className={`badge status-badge ${status.className}`}>{status.label}</span>;
// // });

// // const PlanStatusCell = memo(({ 
// //   data, 
// //   getPlanStatus 
// // }: { 
// //   data: Order; 
// //   getPlanStatus?: (orderId: number) => string;
// // }) => {
// //   const statusValue = getPlanStatus?.(data.id) ?? data.planStatus ?? "";
// //   const status = getPlanStatusBadge(statusValue);
// //   return <span className={`badge status-badge ${status.className}`}>{status.label}</span>;
// // });

// // // PROPS
// // interface Props {
// //   selectedOrderId?: number;
// //   getPlanStatus?: (orderId: number) => string;
// //   onSelectOrder?: (order: Order) => void;
// //   onTechpackOpen?: (order: Order) => void;   // Lifted state lên parent
// // }

// // export function OrdersTable({
// //   selectedOrderId,
// //   getPlanStatus,
// //   onSelectOrder,
// //   onTechpackOpen,
// // }: Props) {
// //   const [filters, setFilters] = useState<FilterState>({});

// //   const filterOptions = useMemo(() => {
// //     const unique = (values: string[]) => Array.from(new Set(values)).sort();
// //     return {
// //       seasons: unique(orders.map((o) => o.season)),
// //       styles: unique(orders.map((o) => o.style)),
// //       buys: unique(orders.map((o) => o.buy)),
// //     };
// //   }, []);

// //   const filteredOrders = useMemo(() => {
// //     return orders.filter((order) => {
// //       if (filters.season && order.season !== filters.season) return false;
// //       if (filters.styles && order.style !== filters.styles) return false;
// //       if (filters.buy && order.buy !== filters.buy) return false;

// //       const planStatus = getPlanStatus?.(order.id) ?? order.planStatus ?? "";
// //       if (filters.status && planStatus !== filters.status) return false;

// //       if (filters.search?.trim()) {
// //         const txt = filters.search.toLowerCase().trim();
// //         return (
// //           order.style.toLowerCase().includes(txt) ||
// //           order.buy.toLowerCase().includes(txt) ||
// //           order.productType.toLowerCase().includes(txt)
// //         );
// //       }
// //       return true;
// //     });
// //   }, [filters, getPlanStatus, orders]);

// //   const handleRowClick = useCallback((e: RowClickEvent) => {
// //     onSelectOrder?.(e.data as Order);
// //   }, [onSelectOrder]);

// //   const handleTechpackClick = useCallback((order: Order) => {
// //     onTechpackOpen?.(order);
// //   }, [onTechpackOpen]);

// //   return (
// //     <div className="grid-container orders-table">
// //       <OrdersFilter {...filterOptions} onFilter={setFilters} />

// //       <DataGrid
// //         dataSource={filteredOrders}
// //         keyExpr="id"
// //         height="calc(100vh - 280px)"
// //         showBorders
// //         showColumnLines={false}
// //         showRowLines
// //         rowAlternationEnabled
// //         selectedRowKeys={selectedOrderId ? [selectedOrderId] : []}
// //         columnAutoWidth
// //         wordWrapEnabled
// //         repaintChangesOnly={true}
// //         onRowClick={handleRowClick}
// //       >
// //         <Scrolling mode="virtual" showScrollbar="always" />
// //         <Selection mode="single" />

// //         {/* COLUMNS */}
// //         <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
// //         <Column dataField="style" caption="Style" fixed width={125} allowEditing={false} />
// //         <Column dataField="buy" caption="Buy" width={100} allowEditing={false} />

// //         <Column
// //           dataField="qtyOrder"
// //           caption="Order Qty"
// //           dataType="number"
// //           width={120}
// //           allowEditing={false}
// //           alignment="right"
// //         />

// //         <Column
// //           caption="Bal Qty"
// //           dataType="number"
// //           width={110}
// //           allowEditing={false}
// //           alignment="right"
// //           calculateCellValue={(row: Order) =>
// //             calculateBalQty(row.qtyOrder ?? 0, row.completedQty ?? 0)
// //           }
// //         />

// //         <Column
// //           dataField="firstCrd"
// //           caption="First CRD"
// //           dataType="date"
// //           format="dd/MM/yyyy"
// //           width={120}
// //           allowEditing={false}
// //         />

// //         <Column dataField="garmentconst" caption="Garment Const." width={120} allowEditing={false} />

// //         <Column
// //           caption="Techpack"
// //           width={90}
// //           allowEditing={false}
// //           cellRender={({ data }) => (
// //             <TechpackCell data={data as Order} onClick={handleTechpackClick} />
// //           )}
// //         />

// //         <Column dataField="productType" caption="Product Type" width={175} allowEditing={false} />
// //         <Column dataField="category" caption="Category" width={90} allowEditing />

// //         <Column
// //           dataField="materialStatus"
// //           caption="Status Material"
// //           width={128}
// //           allowEditing={false}
// //           cellRender={({ value }) => <MaterialStatusCell value={value as string} />}
// //         />

// //         <Column
// //           dataField="planstatus"
// //           caption="Plan Status"
// //           fixed
// //           fixedPosition="right"
// //           width={110}
// //           allowEditing={false}
// //           cellRender={({ data }) => (
// //             <PlanStatusCell data={data as Order} getPlanStatus={getPlanStatus} />
// //           )}
// //         />
// //       </DataGrid>
// //     </div>
// //   );
// // }


// import { useMemo, useState, useCallback, memo } from "react";
// import DataGrid, {
//   Column,
//   Scrolling,
//   Selection,
// } from "devextreme-react/data-grid";
// import type { RowClickEvent } from "devextreme/ui/data_grid";

// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button } from "react-bootstrap";

// import { orders, type Order } from "../data/order.data";
// import { OrdersFilter, type FilterState } from "./OrdersFilter";
// import { calculateBalQty } from "../utils/order.utils";

// // ==================== STATUS HELPERS ====================
// const getPlanStatusBadge = (value: string = "") => {
//   if (value === "Already plan") return { label: "Done", className: "bg-success" };
//   if (value === "Plan Partial") return { label: "Plan Partial", className: "bg-warning text-dark" };
//   return { label: "Pending", className: "bg-secondary" };
// };

// const getMaterialStatusBadge = (value: string = "") => {
//   if (value === "Arrived OK") return { label: "Arrived OK", className: "bg-success" };
//   if (value === "Partial Arrive" || value === "Multiple batches") {
//     return { label: value, className: "bg-warning text-dark" };
//   }
//   return { label: value || "Not yet Arrived", className: "bg-secondary" };
// };

// // ==================== TECHPACK CELL ====================
// const TechpackCell = memo(({ 
//   data, 
//   onViewTechpack 
// }: { 
//   data: Order; 
//   onViewTechpack: (order: Order) => void;
// }) => (
//   <Button
//     variant="outline-secondary"
//     size="sm"
//     onClick={(e) => {
//       e.stopPropagation();           // Ngăn không cho trigger chọn row
//       onViewTechpack(data);          // Mở TechpackPanel
//     }}
//   >
//     View
//   </Button>
// ));

// // ==================== OTHER CELLS ====================
// const MaterialStatusCell = memo(({ value }: { value: string }) => {
//   const status = getMaterialStatusBadge(value);
//   return <span className={`badge status-badge ${status.className}`}>{status.label}</span>;
// });

// const PlanStatusCell = memo(({ 
//   data, 
//   getPlanStatus 
// }: { 
//   data: Order; 
//   getPlanStatus?: (orderId: number) => string;
// }) => {
//   const statusValue = getPlanStatus?.(data.id) ?? data.planStatus ?? "";
//   const status = getPlanStatusBadge(statusValue);
//   return <span className={`badge status-badge ${status.className}`}>{status.label}</span>;
// });

// // ==================== PROPS ====================
// interface Props {
//   selectedOrderId?: number;
//   getPlanStatus?: (orderId: number) => string;
//   onSelectOrder?: (order: Order) => void;
//   onViewTechpack?: (order: Order) => void;     // ← Prop dùng để mở Techpack
// }

// export function OrdersTable({
//   selectedOrderId,
//   getPlanStatus,
//   onSelectOrder,
//   onViewTechpack,
// }: Props) {
//   const [filters, setFilters] = useState<FilterState>({});

//   const filterOptions = useMemo(() => {
//     const unique = (values: string[]) => Array.from(new Set(values)).sort();
//     return {
//       seasons: unique(orders.map((o) => o.season)),
//       styles: unique(orders.map((o) => o.style)),
//       buys: unique(orders.map((o) => o.buy)),
//     };
//   }, []);

//   const filteredOrders = useMemo(() => {
//     return orders.filter((order) => {
//       if (filters.season && order.season !== filters.season) return false;
//       if (filters.styles && order.style !== filters.styles) return false;
//       if (filters.buy && order.buy !== filters.buy) return false;

//       const planStatus = getPlanStatus?.(order.id) ?? order.planStatus ?? "";
//       if (filters.status && planStatus !== filters.status) return false;

//       if (filters.search?.trim()) {
//         const txt = filters.search.toLowerCase().trim();
//         return (
//           order.style.toLowerCase().includes(txt) ||
//           order.buy.toLowerCase().includes(txt) ||
//           order.productType.toLowerCase().includes(txt)
//         );
//       }
//       return true;
//     });
//   }, [filters, getPlanStatus, orders]);

//   const handleRowClick = useCallback((e: RowClickEvent) => {
//     onSelectOrder?.(e.data as Order);
//   }, [onSelectOrder]);

//   const handleViewTechpack = useCallback((order: Order) => {
//     onViewTechpack?.(order);
//   }, [onViewTechpack]);

//   return (
//     <div className="grid-container orders-table">
//       <OrdersFilter {...filterOptions} onFilter={setFilters} />

//       <DataGrid
//         dataSource={filteredOrders}
//         keyExpr="id"
//         height="calc(100vh - 280px)"
//         showBorders
//         showColumnLines={false}
//         showRowLines
//         rowAlternationEnabled
//         selectedRowKeys={selectedOrderId ? [selectedOrderId] : []}
//         columnAutoWidth
//         wordWrapEnabled
//         repaintChangesOnly={true}
//         onRowClick={handleRowClick}
//       >
//         <Scrolling mode="virtual" showScrollbar="always" />
//         <Selection mode="single" />

//         {/* COLUMNS */}
//         <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
//         <Column dataField="style" caption="Style" fixed width={125} allowEditing={false} />
//         <Column dataField="buy" caption="Buy" width={100} allowEditing={false} />

//         <Column
//           dataField="qtyOrder"
//           caption="Order Qty"
//           dataType="number"
//           width={120}
//           allowEditing={false}
//           alignment="right"
//         />

//         <Column
//           caption="Bal Qty"
//           dataType="number"
//           width={110}
//           allowEditing={false}
//           alignment="right"
//           calculateCellValue={(row: Order) =>
//             calculateBalQty(row.qtyOrder ?? 0, row.completedQty ?? 0)
//           }
//         />

//         <Column
//           dataField="firstCrd"
//           caption="First CRD"
//           dataType="date"
//           format="dd/MM/yyyy"
//           width={120}
//           allowEditing={false}
//         />

//         <Column dataField="garmentconst" caption="Garment Const." width={120} allowEditing={false} />

//         {/* NÚT VIEW TECHPACK */}
//         <Column
//           caption="Techpack"
//           width={90}
//           allowEditing={false}
//           cellRender={({ data }) => (
//             <TechpackCell 
//               data={data as Order} 
//               onViewTechpack={handleViewTechpack} 
//             />
//           )}
//         />

//         <Column dataField="productType" caption="Product Type" width={175} allowEditing={false} />
//         <Column dataField="category" caption="Category" width={90} allowEditing />

//         <Column
//           dataField="materialStatus"
//           caption="Status Material"
//           width={128}
//           allowEditing={false}
//           cellRender={({ value }) => <MaterialStatusCell value={value as string} />}
//         />

//         <Column
//           dataField="planstatus"
//           caption="Plan Status"
//           fixed
//           fixedPosition="right"
//           width={110}
//           allowEditing={false}
//           cellRender={({ data }) => (
//             <PlanStatusCell data={data as Order} getPlanStatus={getPlanStatus} />
//           )}
//         />
//       </DataGrid>
//     </div>
//   );
// }
import { useMemo, useState, lazy, Suspense } from "react";
import DataGrid, { Column, Editing, Scrolling, Selection } from "devextreme-react/data-grid";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

import { orders, type Order } from "../data/order.data";
import { OrdersFilter, type FilterState } from "./OrdersFilter";
import { calculateBalQty } from "../utils/order.utils";

// Lazy load TechpackPanel để giảm bundle size ban đầu
// Chỉ load khi người dùng mở xem Techpack
const TechpackPanel = lazy(() =>
  import("./Techpack/TechpackPanel").then((m) => ({ default: m.TechpackPanel }))
);

// Props của bảng Orders
// selectedOrderId: order đang được chọn từ bên ngoài
// getPlanStatus: callback lấy trạng thái plan theo orderId
// onSelectOrder: callback thông báo order được chọn
interface Props {
  selectedOrderId?: number;
  getPlanStatus?: (orderId: number) => string;
  onSelectOrder?: (order: Order) => void;
}

// Mapping trạng thái kế hoạch sang badge UI
const getPlanStatusBadge = (value: string = "") => {
  if (value === "Already plan") return { label: "Done", className: "bg-success" };
  if (value === "Plan Partial")
    return { label: "Plan Partial", className: "bg-warning text-dark" };
  return { label: "Pending", className: "bg-secondary" };
};

// Mapping trạng thái nguyên phụ liệu sang badge UI
const getMaterialStatusBadge = (value: string = "") => {
  if (value === "Arrived OK") return { label: "Arrived OK", className: "bg-success" };
  if (value === "Partial Arrive" || value === "Multiple batches")
    return { label: value, className: "bg-warning text-dark" };
  return { label: value || "Not yet Arrived", className: "bg-secondary" };
};

export function OrdersTable({ selectedOrderId, getPlanStatus, onSelectOrder }: Props) {
  // State lưu điều kiện filter hiện tại
  const [filters, setFilters] = useState<FilterState>({});

  // State điều khiển vi ệc mở / đóng Techpack modal
  const [showTechpack, setShowTechpack] = useState(false);

  // Lưu order đang được xem Techpack
  const [selectedTechpackOrder, setSelectedTechpackOrder] = useState<Order | null>(null);

  // Tính toán danh sách option cho filter (season, style, buy)
  // Chỉ tính 1 lần vì orders là dữ liệu tĩnh
  const filterOptions = useMemo(() => {
    const unique = (values: string[]) => Array.from(new Set(values)).sort();
    return {
      seasons: unique(orders.map((o) => o.season)),
      styles: unique(orders.map((o) => o.style)),
      buys: unique(orders.map((o) => o.buy)),
    };
  }, []);

  // Danh sách order sau khi áp dụng toàn bộ filter
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        // Filter theo season
        if (filters.season && order.season !== filters.season) return false;

        // Filter theo style
        if (filters.styles && order.style !== filters.styles) return false;

        // Filter theo buy
        if (filters.buy && order.buy !== filters.buy) return false;

        // Lấy trạng thái plan (ưu tiên từ callback bên ngoài)
        const planStatus = getPlanStatus?.(order.id) ?? order.planStatus;
        if (filters.status && planStatus !== filters.status) return false;

        // Filter theo text search (style / buy / productType)
        if (filters.search) {
          const txt = filters.search.toLowerCase();
          if (
            !order.style.toLowerCase().includes(txt) &&
            !order.buy.toLowerCase().includes(txt) &&
            !order.productType.toLowerCase().includes(txt)
          ) {
            return false;
          }
        }

        return true;
      }),
    [filters, getPlanStatus]
  );

  // Khi click nút View Techpack
  // Set order hiện tại và mở modal
  const handleTechpackClick = (order: Order) => {
    setSelectedTechpackOrder(order);
    setShowTechpack(true);
  };

  return (
    <div className="grid-container orders-table">
      {/* Bộ filter phía trên bảng */}
      <OrdersFilter
        seasons={filterOptions.seasons}
        styles={filterOptions.styles}
        buys={filterOptions.buys}
        onFilter={setFilters}
      />

      <DataGrid
        dataSource={filteredOrders}
        keyExpr="id"
        height={390}
        showBorders
        showColumnLines={false}
        showRowLines
        rowAlternationEnabled
        // Đồng bộ row được chọn từ bên ngoài
        selectedRowKeys={selectedOrderId ? [selectedOrderId] : []}
        columnAutoWidth
        wordWrapEnabled
        // Click vào row để chọn order
        onRowClick={(e) => onSelectOrder?.(e.data as Order)}
        // Bắt sự kiện selection thay đổi (khi click checkbox / row)
        onSelectionChanged={(e) => {
          const order = e.selectedRowsData[0] as Order;
          if (order) onSelectOrder?.(order);
        }}
      >
        {/* Cho phép edit trực tiếp một số cell */}
        <Editing mode="cell" allowUpdating />

        {/* Virtual scroll để tối ưu performance */}
        <Scrolling mode="virtual" showScrollbar="always" />

        {/* Chỉ cho phép chọn 1 order tại 1 thời điểm */}
        <Selection mode="single" />

        <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
        <Column dataField="style" caption="Style" fixed width={125} allowEditing={false} />
        <Column dataField="buy" caption="Buy" width={100} allowEditing={false} />

        <Column
          dataField="qtyOrder"
          caption="Order Qty"
          dataType="number"
          width={120}
          allowEditing={false}
          alignment="left"
        />

        {/* Bal Qty được tính động từ Order Qty và Completed Qty */}
        <Column
          caption="Bal Qty"
          dataType="number"
          width={110}
          allowEditing={false}
          alignment="left"
          calculateCellValue={(row) =>
            calculateBalQty(row.qtyOrder ?? 0, row.completedQty ?? 0)
          }
        />

        <Column
          dataField="firstCrd"
          caption="First CRD"
          dataType="date"
          format="dd/MM/yyyy"
          width={120}
          allowEditing={false}
        />

        <Column dataField="garmentconst" caption="Garment Const." width={120} allowEditing={false} />

        {/* Cột Techpack với nút View */}
        <Column
          dataField="techpack"
          caption="Techpack"
          width={90}
          allowEditing={false}
          cellRender={(cell) => (
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ fontSize: "0.876rem" }}
              onClick={(e) => {
                // Ngăn không cho click lan lên row
                e.stopPropagation();
                handleTechpackClick(cell.data as Order);
              }}
            >
              View
            </Button>
          )}
        />

        <Column dataField="productType" caption="Product Type" width={175} allowEditing={false} />
        <Column dataField="category" caption="Category" width={90} allowEditing />

        {/* Hiển thị trạng thái nguyên phụ liệu */}
        <Column
          dataField="materialStatus"
          caption="Status Material"
          width={128}
          allowEditing={false}
          cellRender={(data) => {
            const status = getMaterialStatusBadge(data.value);
            return (
              <span className={`badge status-badge ${status.className}`}>
                {status.label}
              </span>
            );
          }}
        />

        <Column
          dataField="eta"
          caption="ETA"
          width={90}
          dataType="date"
          format="dd/MM/yyyy"
          allowEditing
        />

        <Column
          dataField="earliestStartDate"
          caption="Earliest Start"
          dataType="date"
          format="dd/MM/yyyy"
          width={125}
          allowEditing={false}
        />

        <Column dataField="sewingLineType" caption="Line Type" width={135} allowEditing={false} />

        <Column
          dataField="target"
          caption="Target"
          dataType="number"
          width={95}
          allowEditing={false}
          alignment="left"
        />

        {/* Cột Plan Status*/}
        <Column
          dataField="planstatus"
          caption="Plan Status"
          fixed
          fixedPosition="right"
          width={110}
          allowEditing={false}
          cellRender={(data) => {
            const statusValue = data.data
              ? getPlanStatus?.(data.data.id) ?? data.value
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

      {/* Lazy load TechpackPanel + loading UI */}
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-3"
                style={{ width: "3rem", height: "3rem" }}
              />
              <div className="progress" style={{ width: "250px", height: "8px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="mt-3 mb-0 text-muted">Đang tải...</p>
            </div>
          </div>
        }
      >
        {showTechpack && (
          <TechpackPanel
            show={showTechpack}
            onClose={() => setShowTechpack(false)}
            order={selectedTechpackOrder}
          />
        )}
      </Suspense>
    </div>
  );
}