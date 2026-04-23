import React, { useState } from 'react';
import './tasks.scss';

import { OrdersTable } from './components/OrdersTable';
import { LineSchedule } from './components/LineSchedule';
import { ProductionPlanDetail } from './components/ProductionPlanDetail';

export function Tasks() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="tasks-page">
      <h2 className="page-title">CÔNG CỤ KẾ HOẠCH SẢN XUẤT (UI TEST)</h2>

      {/* Bảng 1 + Bảng 2 */}
      <div className="two-column-layout">
        <div className="left-panel">
          <OrdersTable onSelectOrder={setSelectedOrder} />
        </div>

        <div className="right-panel">
          <LineSchedule selectedOrder={selectedOrder} />
        </div>
      </div>

      {/* Bảng 3 */}
      <div className="section">
        <ProductionPlanDetail />
      </div>
    </div>
  );
}