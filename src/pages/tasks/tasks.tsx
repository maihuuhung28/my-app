import { useMemo, useState } from "react";
import "./tasks.scss";
import { OrdersTable } from "./components/OrdersTable";
import { LineSchedule } from "./components/LineSchedule";
import { ProductionPlanDetail } from "./components/ProductionPlanDetail";
import type { Order } from "./data/order.data";
import type { ProductionCategory, ProductionPlan } from "./types/productionPlan.types";
import {
  calculateInlineDays,
  getNextInlineDateForLine,
  getOrderPlanStatus,
} from "./utils/productionPlan.utils";

const createPlanId = (orderId: number, line: string) => `${orderId}-${line}`;

const normalizeCategory = (category: string): ProductionCategory => {
  if (category === "DUP" || category === "BTP") return category;
  if (category === "BTN") return "BTP";
  return "TP";
};

function buildPlansFromOrder(
  order: Order,
  lineIds: string[],
  existingPlans: ProductionPlan[]
): ProductionPlan[] {
  const baseDutyQty = Math.floor(order.qtyOrder / lineIds.length);
  const remainder = order.qtyOrder % lineIds.length;

  return lineIds.map((line, index) => {
    const draftPlan: ProductionPlan = {
      id: createPlanId(order.id, line),
      line,
      orderId: order.id,
      season: order.season,
      style: order.style,
      buy: order.buy || "",
      orderQty: order.qtyOrder,
      crd: order.firstCrd,
      category: normalizeCategory(order.category),
      dutyQty: baseDutyQty + (index < remainder ? 1 : 0),
      target: 280,
      conversionTime: "",
      inlineDate: getNextInlineDateForLine(line, existingPlans),
      actualOfflineDate: null,
      status: "Draft",
    };

    return {
      ...draftPlan,
      inlineDays: calculateInlineDays(draftPlan),
    };
  });
}

export function Tasks() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);

  const currentPlans = useMemo(
    () =>
      selectedOrder
        ? plans.filter((plan) => plan.orderId === selectedOrder.id)
        : [],
    [plans, selectedOrder]
  );

  const handleConfirmLines = (lineIds: string[]) => {
    if (!selectedOrder || lineIds.length === 0) return;

    const plansOutsideCurrentOrder = plans.filter(
      (plan) => plan.orderId !== selectedOrder.id
    );
    const newPlans = buildPlansFromOrder(
      selectedOrder,
      lineIds,
      plansOutsideCurrentOrder
    );
    setPlans((previousPlans) => [
      ...previousPlans.filter((plan) => plan.orderId !== selectedOrder.id),
      ...newPlans,
    ]);
  };

  const handleUpdatePlan = (updatedPlan: ProductionPlan) => {
    const normalizedPlan = {
      ...updatedPlan,
      inlineDays: calculateInlineDays(updatedPlan),
    };

    setPlans((previousPlans) =>
      previousPlans.map((plan) =>
        plan.id === normalizedPlan.id ? normalizedPlan : plan
      )
    );
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((previousPlans) =>
      previousPlans.filter((plan) => plan.id !== planId)
    );
  };

  const handleConfirmPlan = () => {
    if (!selectedOrder) return;

    setPlans((previousPlans) =>
      previousPlans.map((plan) =>
        plan.orderId === selectedOrder.id
          ? { ...plan, status: "Confirmed" }
          : plan
      )
    );
  };

  const handleCancelPlan = () => {
    if (!selectedOrder) return;

    setPlans((previousPlans) =>
      previousPlans.filter((plan) => plan.orderId !== selectedOrder.id)
    );
  };

  return (
    <div className="tasks-page">
      <h2 className="page-title">BẢNG LẬP KẾT HOẠCH SẢN XUẤT</h2>

      <div className="two-column-layout">
        <div className="left-panel">
          <OrdersTable
            selectedOrderId={selectedOrder?.id}
            onSelectOrder={setSelectedOrder}
            getPlanStatus={(orderId) => getOrderPlanStatus(orderId, plans)}
          />
        </div>

        <div className="right-panel">
          <LineSchedule
            selectedOrder={selectedOrder}
            plans={plans}
            onConfirmLines={handleConfirmLines}
            onDeletePlan={handleDeletePlan}
          />
        </div>
      </div>

      {currentPlans.length > 0 && (
        <div className="section mt-4">
          <ProductionPlanDetail
            plans={currentPlans}
            onUpdate={handleUpdatePlan}
            onDelete={handleDeletePlan}
            onConfirm={handleConfirmPlan}
            onCancel={handleCancelPlan}
          />
        </div>
      )}

      {currentPlans.length === 0 && selectedOrder && (
        <div className="alert alert-info mt-4 text-center p-4">
          Sau khi chọn chuyền. Nhấn vào <strong>"Chọn"</strong> để lập kế hoạch cho mã hàng <strong>{selectedOrder.style}</strong>.
        </div>
      )}
    </div>
  );
}
