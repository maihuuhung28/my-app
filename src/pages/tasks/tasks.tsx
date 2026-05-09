import { useState } from 'react';
import './tasks.scss';
import { OrdersTable } from './components/OrdersTable';
import { LineSchedule } from './components/LineSchedule';
import { ProductionPlanDetail } from './components/ProductionPlanDetail';
import './tasks.scss';

export function Tasks() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);

  return (
    <div className="tasks-page">
      <h2 className="page-title">CÔNG CỤ KẾ HOẠCH SẢN XUẤT (UI TEST)</h2>

      {/* Bảng 1 + Bảng 2 */}
      <div className="two-column-layout">
        <div className="left-panel">
          <OrdersTable onSelectOrder={setSelectedOrder} />
        </div>

        <div className="right-panel">
          <LineSchedule
            selectedOrder={selectedOrder}
            onLineChange={(lineId) =>
              setSelectedLineIds((prev) => {
                if (!lineId) return [];
                const has = prev.includes(lineId);
                return has ? prev.filter((x) => x !== lineId) : [...prev, lineId];
              })
            }

          />
        </div>
      </div>

      {/* Bảng 3: ProductionPlanDetail */}
      <div className="section">
        <ProductionPlanDetail selectedLineIds={selectedLineIds} />
      </div>
    </div>
  );
}