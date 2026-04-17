import React, { useState } from 'react';
import './tasks.scss';
import { OrdersTable } from './components/OrdersTable';
//import { LineSchedule } from './components/LineSchedule/LineSchedule'; 

export function Tasks() {

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="tasks-page">
      <h2 className="page-title">CÔNG CỤ KẾ HOẠCH SẢN XUẤT</h2>

      {/* ===== BẢNG 1: ORDER LIST ===== */}
      <div className="grid-container">
        <OrdersTable onSelectOrder={setSelectedOrder} />
      </div>


      </div>
    
  );
}