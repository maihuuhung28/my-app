// import { useMemo, useState } from "react";
// import DataGrid, {
//   Column,
//   Editing,
//   HeaderFilter,
//   Paging,
//   Scrolling,
//   Selection,
// } from "devextreme-react/data-grid";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button, Modal } from "react-bootstrap";
// import { orders, type Order } from "../data/order.data";
// import { OrdersFilter, type FilterState } from "./OrdersFilter";

// interface Props {
//   selectedOrderId?: number;
//   getPlanStatus?: (orderId: number) => string;
//   onSelectOrder?: (order: Order) => void;
// }

// interface TechpackImage {
//   dataUrl: string;
//   fileName: string;
//   fileSize: number;
//   uploadedAt: string;
// }

// const getPlanStatusBadge = (value = "") => {
//   if (value === "Already plan") {
//     return { label: "Done", className: "bg-success" };
//   }

//   if (value === "Plan Partial") {
//     return { label: "Plan Partial", className: "bg-warning text-dark" };
//   }

//   return { label: "Pending", className: "bg-secondary" };
// };

// const getMaterialStatusBadge = (value = "") => {
//   if (value === "Arrived OK") {
//     return { label: "Arrived OK", className: "bg-success" };
//   }

//   if (value === "Partial Arrive" || value === "Multiple batches") {
//     return { label: value, className: "bg-warning text-dark" };
//   }

//   return { label: value || "Not yet Arrived", className: "bg-secondary" };
// };

// export function OrdersTable({
//   selectedOrderId,
//   getPlanStatus,
//   onSelectOrder,
// }: Props) {
//   const [filters, setFilters] = useState<FilterState>({});
//   const [techpacks, setTechpacks] = useState<Record<number, TechpackImage>>({});
//   const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

//   const filterOptions = useMemo(() => {
//     const unique = (values: string[]) => Array.from(new Set(values)).sort();

//     return {
//       seasons: unique(orders.map((order) => order.season)),
//       styles: unique(orders.map((order) => order.style)),
//       buys: unique(orders.map((order) => order.buy)),
//     };
//   }, []);

//   const filteredOrders = useMemo(
//     () =>
//       orders.filter((order) => {
//         if (filters.season && order.season !== filters.season) return false;
//         if (filters.styles && order.style !== filters.styles) return false;
//         if (filters.buy && order.buy !== filters.buy) return false;

//         const planStatus = getPlanStatus?.(order.id) ?? order.planStatus;
//         if (filters.status && planStatus !== filters.status) return false;

//         if (filters.search) {
//           const searchText = filters.search.toLowerCase();
//           const matches =
//             order.style.toLowerCase().includes(searchText) ||
//             order.buy.toLowerCase().includes(searchText) ||
//             order.productType.toLowerCase().includes(searchText);

//           if (!matches) return false;
//         }

//         return true;
//       }),
//     [filters, getPlanStatus]
//   );

//   // const previewTechpack = previewOrder ? techpacks[previewOrder.id] : null;

//   // const handleTechpackUpload = (
//   //   order: Order,
//   //   file: File | undefined
//   // ) => {
//   //   if (!file || !file.type.startsWith("image/")) return;

//   //   const reader = new FileReader();
//   //   reader.onload = () => {
//   //     if (typeof reader.result !== "string") return;
//   //     const dataUrl = reader.result;

//   //     setTechpacks((current) => ({
//   //       ...current,
//   //       [order.id]: {
//   //         dataUrl,
//   //         fileName: file.name,
//   //         fileSize: file.size,
//   //         uploadedAt: new Date().toISOString(),
//   //       },
//   //     }));
//   //   };
//   //   reader.readAsDataURL(file);
//   // };

//   // const handleRemoveTechpack = () => {
//   //   if (!previewOrder) return;

//   //   setTechpacks((current) => {
//   //     const next = { ...current };
//   //     delete next[previewOrder.id];
//   //     return next;
//   //   });
//   //   setPreviewOrder(null);
//   // };

//   // const renderTechpackCell = (cell: { data?: Order }) => {
//   //   const order = cell.data;
//   //   if (!order) return null;

//   //   const techpack = techpacks[order.id];
//   //   const inputId = `techpack-upload-${order.id}`;

//   //   return (
//   //     <div
//   //       className="techpack-cell"
//   //       onClick={(event) => event.stopPropagation()}
//   //     >
//   //       <input
//   //         id={inputId}
//   //         className="techpack-cell__input"
//   //         type="file"
//   //         accept="image/*"
//   //         onChange={(event) => {
//   //           handleTechpackUpload(order, event.target.files?.[0]);
//   //           event.target.value = "";
//   //         }}
//   //       />

//   //       {techpack ? (
//   //         <>
//   //           <button
//   //             type="button"
//   //             className="techpack-cell__preview"
//   //             title="View techpack"
//   //             onClick={() => setPreviewOrder(order)}
//   //           >
//   //             <img src={techpack.dataUrl} alt={`${order.style} techpack`} />
//   //           </button>
//   //           <label className="techpack-cell__replace" htmlFor={inputId}>
//   //             Replace
//   //           </label>
//   //         </>
//   //       ) : (
//   //         <label className="techpack-cell__upload" htmlFor={inputId}>
//   //           Upload
//   //         </label>
//   //       )}
//   //     </div>
//   //   );
//   // };

//   return (
//     <div className="grid-container orders-table">
//       <div className="orders-table__head">
//         <div>
//         </div>
//       </div>

//       <OrdersFilter
//         seasons={filterOptions.seasons}
//         styles={filterOptions.styles}
//         buys={filterOptions.buys}
//         onFilter={setFilters}
//       />

//       <DataGrid
//         dataSource={filteredOrders}
//         keyExpr="id"
//         height={390}
//         showBorders
//         showColumnLines={false}
//         showRowLines
//         rowAlternationEnabled
//         focusedRowEnabled={false}
//         selectedRowKeys={selectedOrderId ? [selectedOrderId] : []}
//         columnAutoWidth
//         wordWrapEnabled
//         onRowClick={(event) => onSelectOrder?.(event.data as Order)}
//         onSelectionChanged={(event) => {
//           const order = event.selectedRowsData[0] as Order | undefined;
//           if (order) onSelectOrder?.(order);
//         }}
//       >
//         <Editing mode="cell" allowUpdating />
//         <Scrolling mode="virtual" showScrollbar="always" />
//         <Paging enabled={false} />
//         <Selection mode="single" />

//         <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
//         <Column dataField="style" caption="Style" fixed width={155} allowEditing={false} />
//         <Column dataField="buy" caption="Buy" width={100} allowEditing={false} />
//         <Column dataField="qtyOrder" caption="Order Qty" dataType="number" format="#,##0" width={120} allowEditing={false}  alignment="left"/>
//         <Column dataField="balQty" caption="Bal Qty" dataType="number" format="#,##0" width={110} allowEditing={false} alignment="left" />
//         <Column dataField="firstCrd" caption="First CRD" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={false} />
//         <Column dataField="groupedBy" caption="Grouped by Garment Construction" width={160} allowEditing={false} />
//         {/* Phần lấy data từ bên DV */}
//         <Column
//           dataField="techpack"
//           caption="Techpack"
//           width={90}
//           allowEditing={false}
//           // cellRender={renderTechpackCell}
//         />
//         <Column dataField="productType" caption="Product Type" width={175} allowEditing={false} />
//         <Column dataField="category" caption="Category" width={175} allowEditing={true} />
//         <Column
//           dataField="materialStatus"
//           caption="Status Material"
//           width={180}
//           allowEditing={false}
//           cellRender={(data: { value?: string }) => {
//             const status = getMaterialStatusBadge(data.value);
//             return (
//               <span className={`badge status-badge ${status.className}`}>
//                 {status.label}
//               </span>
//             );
//           }}
//         />

//         <Column dataField="earliestStartDate" caption="Earliest Start" dataType="date" format="dd/MM/yyyy" width={125} allowEditing={false} />
//         <Column dataField="sewingLineType" caption="Line Type" width={135} allowEditing={false} />
//         <Column dataField="target" caption="Target" dataType="number" format="#,##0" width={95} allowEditing={false} alignment="left" />

//         <Column
//           dataField="planStatus"
//           caption="Plan Status"
//           fixed
//           fixedPosition="right"
//           width={110}
//           allowEditing={false}
//           cellRender={(data: { data?: Order; value?: string }) => {
//             const statusValue = data.data
//               ? getPlanStatus?.(data.data.id) ?? data.value
//               : data.value;
//             const status = getPlanStatusBadge(statusValue);
//             return <div className={`badge status-badge ${status.className}`}>{status.label}</div>;
//           }}
//         />
//       </DataGrid>

//       {/* <Modal
//         show={Boolean(previewOrder && previewTechpack)}
//         onHide={() => setPreviewOrder(null)}
//         size="lg"
//         centered
//         className="techpack-preview-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             Techpack - {previewOrder?.style}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {previewTechpack && (
//             <div className="techpack-preview">
//               <div className="techpack-preview__meta">
//                 <span>{previewOrder?.season}</span>
//                 <strong>{previewOrder?.buy}</strong>
//                 <span>{previewTechpack.fileName}</span>
//               </div>
//               <img
//                 src={previewTechpack.dataUrl}
//                 alt={`${previewOrder?.style || "Order"} techpack preview`}
//               />
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-danger" onClick={handleRemoveTechpack}>
//             Remove
//           </Button>
//           <Button variant="secondary" onClick={() => setPreviewOrder(null)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal> */}
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import DataGrid, {
  Column,
  Editing,
  HeaderFilter,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { orders, type Order } from "../data/order.data";
import { OrdersFilter, type FilterState } from "./OrdersFilter";

interface Props {
  selectedOrderId?: number;
  getPlanStatus?: (orderId: number) => string;
  onSelectOrder?: (order: Order) => void;
}

export function OrdersTable({
  selectedOrderId,
  getPlanStatus,
  onSelectOrder,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({});

  const filterOptions = useMemo(() => {
    const unique = (values: string[]) => Array.from(new Set(values)).sort();

    return {
      seasons: unique(orders.map((order) => order.season)),
      styles: unique(orders.map((order) => order.style)),
      buys: unique(orders.map((order) => order.buy)),
    };
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (filters.season && order.season !== filters.season) return false;
        if (filters.styles && order.style !== filters.styles) return false;
        if (filters.buy && order.buy !== filters.buy) return false;

        const planStatus = getPlanStatus?.(order.id) ?? order.planStatus;
        if (filters.status && planStatus !== filters.status) return false;

        if (filters.search) {
          const searchText = filters.search.toLowerCase();
          const matches =
            order.style.toLowerCase().includes(searchText) ||
            order.buy.toLowerCase().includes(searchText) ||
            order.productType.toLowerCase().includes(searchText);

          if (!matches) return false;
        }

        return true;
      }),
    [filters, getPlanStatus]
  );

  return (
    <div className="grid-container orders-table">
      <div className="orders-table__head">
        <div></div>
      </div>

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
        <Editing mode="cell" allowUpdating />
        <Scrolling mode="virtual" showScrollbar="always" />
        <Paging enabled={false} />
        <Selection mode="single" />

        <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
        <Column dataField="style" caption="Style" fixed width={155} allowEditing={false} />
        <Column dataField="buy" caption="Buy" width={100} allowEditing={false} />
        <Column dataField="qtyOrder" caption="Order Qty" dataType="number" format="#,##0" width={120} allowEditing={false} alignment="left"/>
        <Column dataField="balQty" caption="Bal Qty" dataType="number" format="#,##0" width={110} allowEditing={false} alignment="left" />
        <Column dataField="firstCrd" caption="First CRD" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={false} />
        <Column dataField="groupedBy" caption="Grouped by Garment Construction" width={160} allowEditing={false} />

      <Column
      dataField="techpack"
      caption="Techpack"
      width={110}
      allowEditing={false}
      cellRender={(cell) => (
        <Button
        variant="primary"
        size="sm"
        className="techpack-btn"
        style={{fontSize: '0.8rem', fontWeight: 500}}
        onClick={(e) => {
        e.stopPropagation();
        console.log(`View techpack for order ${cell.data?.id}`);
      }}
    >
      View
    </Button>
  )}
/>

        <Column dataField="productType" caption="Product Type" width={175} allowEditing={false} />
        <Column dataField="category" caption="Category" width={175} allowEditing={true} />
        <Column
          dataField="materialStatus"
          caption="Status Material"
          width={180}
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

        <Column dataField="earliestStartDate" caption="Earliest Start" dataType="date" format="dd/MM/yyyy" width={125} allowEditing={false} />
        <Column dataField="sewingLineType" caption="Line Type" width={135} allowEditing={false} />
        <Column dataField="target" caption="Target" dataType="number" format="#,##0" width={95} allowEditing={false} alignment="left" />

        <Column
          dataField="planStatus"
          caption="Plan Status"
          fixed
          fixedPosition="right"
          width={110}
          allowEditing={false}
          cellRender={(data: { data?: Order; value?: string }) => {
            const statusValue = data.data
              ? getPlanStatus?.(data.data.id) ?? data.value
              : data.value;
            const status = getPlanStatusBadge(statusValue);
            return <div className={`badge status-badge ${status.className}`}>{status.label}</div>;
          }}
        />
      </DataGrid>
    </div>
  );
}

const getPlanStatusBadge = (value = "") => {
  if (value === "Already plan") {
    return { label: "Done", className: "bg-success" };
  }
  if (value === "Plan Partial") {
    return { label: "Plan Partial", className: "bg-warning text-dark" };
  }
  return { label: "Pending", className: "bg-secondary" };
};

const getMaterialStatusBadge = (value = "") => {
  if (value === "Arrived OK") {
    return { label: "Arrived OK", className: "bg-success" };
  }
  if (value === "Partial Arrive" || value === "Multiple batches") {
    return { label: value, className: "bg-warning text-dark" };
  }
  return { label: value || "Not yet Arrived", className: "bg-secondary" };
};