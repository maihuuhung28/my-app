// src/pages/tasks/Tasks.tsx
import React, { useState } from 'react';
import './tasks.scss';

import { OrdersTable } from './components/OrdersTable';
import { PlanningTable } from './components/PlanningTable';

export function Tasks() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="tasks-page">
      <h2 className="page-title">Mô phỏng công cụ kế hoạch sản xuất</h2>

      {/* ===== BẢNG 1 ===== */}
      <div className="tasks-section">
        <OrdersTable onSelectOrder={setSelectedOrder} />
      </div>

      {/* ===== BẢNG 2 ===== */}
      <div className="tasks-section">
        <PlanningTable selectedOrder={selectedOrder} />
      </div>
    </div>
  );
}