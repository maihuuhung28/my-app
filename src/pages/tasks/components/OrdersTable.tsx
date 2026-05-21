import { useMemo, useState } from "react";
import DataGrid, {
  Column,
  Editing,
  HeaderFilter,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { orders, type Order } from "../data/order.data";
import { OrdersFilter, type FilterState } from "./OrdersFilter";

interface Props {
  selectedOrderId?: number;
  getPlanStatus?: (orderId: number) => string;
  onSelectOrder?: (order: Order) => void;
}

interface TechpackImage {
  dataUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
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

export function OrdersTable({
  selectedOrderId,
  getPlanStatus,
  onSelectOrder,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({});
  const [techpacks, setTechpacks] = useState<Record<number, TechpackImage>>({});
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

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

  const previewTechpack = previewOrder ? techpacks[previewOrder.id] : null;

  const handleTechpackUpload = (
    order: Order,
    file: File | undefined
  ) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const dataUrl = reader.result;

      setTechpacks((current) => ({
        ...current,
        [order.id]: {
          dataUrl,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTechpack = () => {
    if (!previewOrder) return;

    setTechpacks((current) => {
      const next = { ...current };
      delete next[previewOrder.id];
      return next;
    });
    setPreviewOrder(null);
  };

  const renderTechpackCell = (cell: { data?: Order }) => {
    const order = cell.data;
    if (!order) return null;

    const techpack = techpacks[order.id];
    const inputId = `techpack-upload-${order.id}`;

    return (
      <div
        className="techpack-cell"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          id={inputId}
          className="techpack-cell__input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            handleTechpackUpload(order, event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        {techpack ? (
          <>
            <button
              type="button"
              className="techpack-cell__preview"
              title="View techpack"
              onClick={() => setPreviewOrder(order)}
            >
              <img src={techpack.dataUrl} alt={`${order.style} techpack`} />
            </button>
            <label className="techpack-cell__replace" htmlFor={inputId}>
              Replace
            </label>
          </>
        ) : (
          <label className="techpack-cell__upload" htmlFor={inputId}>
            Upload
          </label>
        )}
      </div>
    );
  };

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
        <Editing mode="cell" allowUpdating />
        <Scrolling mode="standard" showScrollbar="always" />
        <HeaderFilter visible />
        <Selection mode="single" />

        <Column dataField="season" caption="Season" fixed width={90} allowEditing={false} />
        <Column dataField="style" caption="Style" fixed width={140} allowEditing={false} />
        <Column dataField="buy" caption="Buy" width={100} allowEditing={false} />
        <Column dataField="qtyOrder" caption="Order Qty" dataType="number" format="#,##0" width={120} allowEditing={false}  alignment="left"/>
        <Column dataField="balqtyoutput" caption="Bal Qty Output" width={180} allowEditing={true}/>
        <Column dataField="firstCrd" caption="First CRD" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={false} />
        <Column dataField="groupedBy" caption="Grouped by Garment Construction" width={260} allowEditing={false} />
        <Column
          dataField="techpack"
          caption="Techpack"
          width={145}
          allowEditing={false}
          cellRender={renderTechpackCell}
        />
        <Column dataField="productType" caption="Product Type" width={180} allowEditing={false} />
        <Column dataField="category" caption="Category" width={120} allowEditing={false} />

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

        <Column dataField="eta" caption="ETA" dataType="date" format="dd/MM/yyyy" width={120} allowEditing={false} />
        <Column dataField="earliestStartDate" caption="Earliest Line Start Date" dataType="date" format="dd/MM/yyyy" width={170} allowEditing={false} />
        <Column dataField="sewingLineType" caption="Sewing Line Type" width={150} allowEditing={true} />
        <Column dataField="target" caption="Target" dataType="number" format="#,##0" width={110} allowEditing={false} alignment="left" />

        <Column
          dataField="planStatus"
          caption="Plan Status"
          fixed
          fixedPosition="right"
          width={130}
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

      <Modal
        show={Boolean(previewOrder && previewTechpack)}
        onHide={() => setPreviewOrder(null)}
        size="lg"
        centered
        className="techpack-preview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Techpack - {previewOrder?.style}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewTechpack && (
            <div className="techpack-preview">
              <div className="techpack-preview__meta">
                <span>{previewOrder?.season}</span>
                <strong>{previewOrder?.buy}</strong>
                <span>{previewTechpack.fileName}</span>
              </div>
              <img
                src={previewTechpack.dataUrl}
                alt={`${previewOrder?.style || "Order"} techpack preview`}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleRemoveTechpack}>
            Remove
          </Button>
          <Button variant="secondary" onClick={() => setPreviewOrder(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
