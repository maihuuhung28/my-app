// import {useState} from 'react';
// import DataGrid, {
//   Column,
//   Editing,
//   HeaderFilter, 
//   Scrolling,
// } from "devextreme-react/data-grid";
// import { Button } from "devextreme-react";
// import type { ProductionPlan } from "../types/productionPlan.types";
// import type { Order } from "../data/order.data";
// import {
//   calculateEstOfflineDate,
//   calculateInlineDays,
//   isEstOfflineOverdue,
// } from "../utils/productionPlan.utils";

// interface ProductionPlanDetailProps {
//   plans: ProductionPlan[];
//   selectedOrder?: Order | null;
//   onUpdate?: (updatedPlan: ProductionPlan) => void;
//   onDelete?: (planId: string) => void;
//   onConfirm?: () => void;
//   onCancel?: () => void;
// }

// export function ProductionPlanDetail({
//   plans = [],
//   selectedOrder,
//   onUpdate,
//   onDelete,
//   onConfirm,
//   onCancel,
// }: ProductionPlanDetailProps) {
//   if (plans.length === 0) return null;

//   const allPlansConfirmed = plans.every((plan) => plan.status === "Confirmed");

//   // Hàm để render cell với cảnh báo màu đỏ nếu Est. Offline > QVT
//   const estOfflineCellRender = (data: any) => {
//     const plan = data.data as ProductionPlan;
//     const isOverdue = selectedOrder && isEstOfflineOverdue(plan, selectedOrder);
    
//     return (
//       <div className={isOverdue ? "cell-danger-warning" : ""}>
//         {data.text}
//       </div>
//     );
//   };

//   return (
//     <div className="production-plan-detail">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h5 className="mb-1">PRODUCTION PLAN DETAIL</h5>
//           <span className={`badge ${allPlansConfirmed ? "bg-success" : "bg-secondary"}`}>
//             {allPlansConfirmed ? "Confirmed" : "Draft"}
//           </span>
//         </div>

//         <div>
//           <Button
//             text="Back"
//             type="normal"
//             stylingMode="outlined"
//             className="me-2"
//             onClick={onCancel}
//           />
//           <Button
//             text={allPlansConfirmed ? "Confirmed" : "Confirm Plan"}
//             type="success"
//             stylingMode="contained"
//             disabled={allPlansConfirmed}
//             onClick={onConfirm}
//           />
//         </div>
//       </div>

//       <DataGrid
//         dataSource={plans}
//         keyExpr="id"
//         height={480}
//         showBorders={true}
//         showRowLines={true}
//         showColumnLines={true}
//         rowAlternationEnabled={true}
//         columnAutoWidth
//         wordWrapEnabled
//         onRowUpdated={(event) => onUpdate?.(event.data as ProductionPlan)}
//         onRowRemoved={(event) => {
//           const removedPlan = event.data as ProductionPlan | undefined;
//           if (removedPlan) onDelete?.(removedPlan.id);
//         }}
//       >

//         <Scrolling mode="standard" showScrollbar="always" />
//         <HeaderFilter visible />
//         <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
        
//         <Column dataField="season" caption="Season" width={100} allowEditing={false} />
//         <Column dataField="style" caption="Style" width={160} allowEditing={false} />
//         <Column dataField="buy" caption="BUY" width={120} allowEditing={false} />
//         <Column 
//           dataField="orderQty" 
//           caption="Order Qty" 
//           dataType="number" 
//           format="#,##0" 
//           width={130} 
//           allowEditing={false} 
//         />
//         <Column 
//           dataField="target" 
//           caption="Target" 
//           dataType="number" 
//           format="#,##0" 
//           width={110} 
//         />
//         <Column dataField="category" caption="Category Line" width={140} allowEditing={true} />
//         <Column 
//           dataField="dutyQty" 
//           caption="Duty Qty" 
//           dataType="number" 
//           format="#,##0" 
//           width={130} 
//         />
//         <Column 
//           dataField="productionDays" 
//           caption="Production Days" 
//           dataType="number" 
//           width={180} 
//           allowEditing={false} 
//           calculateCellValue={calculateInlineDays} 
//         />
//         <Column dataField="conversionTime" caption="Conversion Time" width={155} />
//         <Column 
//           dataField="inlineDate" 
//           caption="Inline Date" 
//           dataType="date" 
//           format="dd/MM/yyyy" 
//           width={130} 
//         />
//         <Column 
//           dataField="estOfflineDate" 
//           caption="Est. Offline Date" 
//           dataType="date" 
//           format="dd/MM/yyyy" 
//           width={130} 
//           allowEditing={false} 
//           calculateCellValue={calculateEstOfflineDate}
//           cellRender={estOfflineCellRender}
//         />
//         <Column
//           dataField="actualOfflineDate" 
//           caption="Actual Offline Date" 
//           dataType="date" 
//           format="dd/MM/yyyy" 
//           width={140} 
//         />
//         <Column dataField="crd" caption="QVT Date" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={true} />
//       </DataGrid>
//     </div>
//   );
// } 
import { useState } from "react";
import DataGrid, {
  Column,
  Editing,
  HeaderFilter,
  Scrolling,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";

import type { ProductionPlan } from "../types/productionPlan.types";
import type { Order } from "../data/order.data";

import {
  calculateEstOfflineDate,
  calculateInlineDays,
  isEstOfflineOverdue,
} from "../utils/productionPlan.utils";

import { AuditLog } from "./audit-log/AuditLog";
import type { AuditLogItem } from "./audit-log/AuditLog";

interface ProductionPlanDetailProps {
  plans: ProductionPlan[];
  selectedOrder?: Order | null;
  onUpdate?: (updatedPlan: ProductionPlan) => void;
  onDelete?: (planId: string) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/** 🔹 Chỉ audit field nghiệp vụ */
const AUDIT_FIELDS: (keyof ProductionPlan)[] = [
  "target",
  "category",
  "dutyQty",
  "conversionTime",
  "inlineDate",
  "actualOfflineDate",
  "crd",
];

export function ProductionPlanDetail({
  plans = [],
  selectedOrder,
  onUpdate,
  onDelete,
  onConfirm,
  onCancel,
}: ProductionPlanDetailProps) {
  if (plans.length === 0) return null;

  const allPlansConfirmed = plans.every(
    (plan) => plan.status === "Confirmed"
  );

  /** 🔹 AUDIT LOG STATE */
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [openAudit, setOpenAudit] = useState(false);

  /** 🔹 MOCK USER (sau này gắn auth) */
  const currentUser = {
    name: "Planner A",
    role: "Planner",
  };

  /** 🔹 CONFIRM PLAN */
  const handleConfirm = () => {
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleString(),
        user: currentUser.name,
        role: currentUser.role,
        action: "CONFIRM",
        line: "-",
        field: "Production Plan",
        oldValue: "Draft",
        newValue: "Confirmed",
      },
      ...prev,
    ]);

    onConfirm?.();
  };

  /** 🔹 Warning cell */
  const estOfflineCellRender = (data: any) => {
    const plan = data.data as ProductionPlan;
    const isOverdue =
      selectedOrder && isEstOfflineOverdue(plan, selectedOrder);

    return (
      <div className={isOverdue ? "cell-danger-warning" : ""}>
        {data.text}
      </div>
    );
  };

  return (
    <div className="production-plan-detail">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">PRODUCTION PLAN DETAIL</h5>
          <span
            className={`badge ${
              allPlansConfirmed ? "bg-success" : "bg-secondary"
            }`}
          >
            {allPlansConfirmed ? "Confirmed" : "Draft"}
          </span>
        </div>

        <div>
          <Button
            text="Back"
            type="normal"
            stylingMode="outlined"
            className="me-2"
            onClick={onCancel}
          />

          <Button
            text="View History"
            icon="clock"
            type="normal"
            stylingMode="outlined"
            className="me-2"
            onClick={() => setOpenAudit(true)}
          />

          <Button
            text={allPlansConfirmed ? "Confirmed" : "Confirm Plan"}
            type="success"
            stylingMode="contained"
            disabled={allPlansConfirmed}
            onClick={handleConfirm}
          />
        </div>
      </div>

      {/* DATA GRID */}
      <DataGrid
        dataSource={plans}
        keyExpr="id"
        height={480}
        showBorders
        showRowLines
        showColumnLines
        rowAlternationEnabled
        columnAutoWidth
        wordWrapEnabled

        /** ✅ ĐÚNG EVENT CHO AUDIT */
        onRowUpdating={(e) => {
          const { oldData, newData, key } = e;

          const changedFields = AUDIT_FIELDS.filter(
            (field) => oldData[field] !== newData[field]
          );

          if (changedFields.length > 0) {
            changedFields.forEach((field) => {
              const log: AuditLogItem = {
                id: Date.now() + Math.random(),
                time: new Date().toLocaleString(),
                user: currentUser.name,
                role: currentUser.role,
                action: "UPDATE",
                line: oldData.line,
                field: String(field),
                oldValue: String(oldData[field] ?? "-"),
                newValue: String(newData[field] ?? "-"),
              };

              setAuditLogs((prev) => [log, ...prev]);
            });
          }
        }}

        /** Sau khi update xong */
        onRowUpdated={(e) => {
          onUpdate?.(e.data as ProductionPlan);
        }}

        onRowRemoved={(e) => {
          const removedPlan = e.data as ProductionPlan;
          if (!removedPlan) return;

          setAuditLogs((prev) => [
            {
              id: Date.now(),
              time: new Date().toLocaleString(),
              user: currentUser.name,
              role: currentUser.role,
              action: "DELETE",
              line: removedPlan.line,
              field: "Production Plan",
              oldValue: removedPlan.style,
              newValue: "-",
            },
            ...prev,
          ]);

          onDelete?.(removedPlan.id);
        }}
      >
        <Scrolling mode="standard" showScrollbar="always" />
        <HeaderFilter visible />
        <Editing mode="cell" allowUpdating allowDeleting />

        <Column dataField="season" caption="Season" width={100} allowEditing={false} />
        <Column dataField="style" caption="Style" width={160} allowEditing={false} />
        <Column dataField="buy" caption="BUY" width={120} allowEditing={false} />
        <Column dataField="orderQty" caption="Order Qty" dataType="number" format="#,##0" width={130} allowEditing={false} />
        <Column dataField="target" caption="Target" dataType="number" width={110} />
        <Column dataField="category" caption="Category Line" width={140} />
        <Column dataField="dutyQty" caption="Duty Qty" dataType="number" width={130} />

        <Column
          dataField="productionDays"
          caption="Production Days"
          width={180}
          allowEditing={false}
          calculateCellValue={calculateInlineDays}
        />

        <Column dataField="conversionTime" caption="Conversion Time" width={155} />
        <Column dataField="inlineDate" caption="Inline Date" dataType="date" format="dd/MM/yyyy" width={130} />

        <Column
          dataField="estOfflineDate"
          caption="Est. Offline Date"
          dataType="date"
          format="dd/MM/yyyy"
          width={130}
          allowEditing={false}
          calculateCellValue={calculateEstOfflineDate}
          cellRender={estOfflineCellRender}
        />

        <Column dataField="actualOfflineDate" caption="Actual Offline Date" dataType="date" format="dd/MM/yyyy" width={140} />
        <Column dataField="crd" caption="QVT Date" dataType="date" format="dd/MM/yyyy" width={120} />
      </DataGrid>

      {/* AUDIT LOG POPUP */}
      <AuditLog
        show={openAudit}
        onClose={() => setOpenAudit(false)}
        logs={auditLogs}
      />
    </div>
  );
}
