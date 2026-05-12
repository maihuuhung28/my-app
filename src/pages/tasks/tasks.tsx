import { useState } from 'react';
import './tasks.scss';
import { OrdersTable } from './components/OrdersTable';
import { LineSchedule } from './components/LineSchedule';
import { ProductionPlanDetail } from './components/ProductionPlanDetail';
import type { Order } from './data/order.data';

export function Tasks() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmedLines, setConfirmedLines] = useState<string[]>([]);

  const handleConfirmLines = (lineIds: string[], orderId?: number) => {
    if(!orderId) return;

  }
  return (
    <div className="tasks-page">
      <h2 className="page-title">LẬP KẾ HOẠCH SẢN XUẤT</h2>

      {/*Bảng 1 + bảng 2*/}
      <div className="two-column-layout">
        <div className="left-panel">
          <h5></h5>
          <OrdersTable onSelectOrder={setSelectedOrder} />  
        </div>

        <div className="right-panel">
          <h5></h5>
          <LineSchedule
            selectedOrder={selectedOrder}
            onConfirmLines={setConfirmedLines}
          />
        </div>
      </div>

      {/* Bảng 3, Điều kiện chọn confirm tại bảng 2 mới hiện bảng lên */}
      {confirmedLines.length > 0 && (
        <div className="section mt-4">
          <ProductionPlanDetail
           selectedLineIds={confirmedLines}/>
        </div>
      )}
      {confirmedLines.length === 0 && (
        <div className="alert alert-info mt-4 text-center p-4">
          Vui lòng chọn Line để nhập thông tin và bấm <strong>"Chọn"</strong>
        </div>
      )}
    </div>
  );
}
