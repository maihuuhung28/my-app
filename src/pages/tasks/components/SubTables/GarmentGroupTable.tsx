import DataGrid, {
  Column,
  Editing,
  Paging,
  Scrolling,
  Selection,
  type DataGridTypes,
} from "devextreme-react/data-grid";

import type { EditableGarmentGroupRow } from "./types";

interface GarmentGroupTableProps {
  rows: EditableGarmentGroupRow[];
  selectedGroupId: number | null;
  onSelectGroup: (groupId: number) => void;
  onSave: () => void;
  onReset: () => void;
  onRowInserted: (event: DataGridTypes.RowInsertedEvent<EditableGarmentGroupRow, number>) => void;
  onRowUpdated: (event: DataGridTypes.RowUpdatedEvent<EditableGarmentGroupRow, number>) => void;
  onRowRemoved: (event: DataGridTypes.RowRemovedEvent<EditableGarmentGroupRow, number>) => void;
}

export function GarmentGroupTable({
  rows,
  selectedGroupId,
  onSelectGroup,
  onSave,
  onReset,
  onRowInserted,
  onRowUpdated,
  onRowRemoved,
}: GarmentGroupTableProps) {
  return (
    <div className="subtables-grid-panel">
      <div className="subtables-grid-toolbar">
        <button type="button" className="btn btn-success btn-sm" onClick={onSave}>
          Lưu
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onReset}>
          Làm mới
        </button>
      </div>


      <DataGrid
        dataSource={rows}
        keyExpr="id"
        selectedRowKeys={selectedGroupId ? [selectedGroupId] : []}
        showBorders
        showColumnLines
        showRowLines
        rowAlternationEnabled={false}
        columnAutoWidth
        wordWrapEnabled
        height={480}
        hoverStateEnabled
        onRowClick={(event) => {
          const row = event.data as EditableGarmentGroupRow | undefined;
          if (row) onSelectGroup(row.id);
        }}
        onSelectionChanged={(event) => {
          const row = event.selectedRowsData[0] as EditableGarmentGroupRow | undefined;
          if (row) onSelectGroup(row.id);
        }}
        onRowInserted={onRowInserted}
        onRowUpdated={onRowUpdated}
        onRowRemoved={onRowRemoved}
        
      >
        <Editing mode="row" allowAdding allowUpdating allowDeleting useIcons />
        <Paging enabled={false} />
        <Scrolling mode="virtual" showScrollbar="always" />
        <Selection mode="single" />
        
        <Column dataField="grouping" caption="Grouping" width={150} />
        <Column dataField="workingNumberId" caption="Working Number ID" width={180} />
        <Column dataField="productTypeCode" caption="Product Type Code" width={150} />
        <Column dataField="productTypeDesc" caption="Product Type DESC" width={180} />
      </DataGrid>
    </div>
  );
}
