//File cha của 2 bảng phụ
import { useEffect, useMemo, useState } from "react";

import { Modal } from "react-bootstrap";

import type { DataGridTypes } from "devextreme-react/data-grid";
import { efficiencyMockData } from "../../data/efficiency.mock";
import { GARMENT_GROUP_MOCK } from "../../data/garment-group.mock";
import type { EfficiencyRow } from "../../models/efficiency.model";
import type { GarmentGroupRow } from "../../models/garment-group.model";
import { EfficiencyTable } from "./EfficiencyTable";
import { GarmentGroupTable } from "./GarmentGroupTable";
import "./subtables-modal.scss";
import type {
  EditableEfficiencyRow,
  EditableGarmentGroupRow,
  TabKey,
  UserRole,
} from "./types";

interface SubTablesModalProps {
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const TAB_META: Record<TabKey, string> = {
  GARMENT_GROUP: "Bảng phụ 1",
  EFFICIENCY: "Bảng phụ 2",
};

// const TAB_HELPER: Record<TabKey, string> = {
//   GARMENT_GROUP: "Nhập nhóm cấu trúc, mã working number và loại sản phẩm.",
//   EFFICIENCY: "Nhập hiệu suất theo line cho nhóm đang chọn, hoặc upload file để đổ dữ liệu nhanh.",
// };

const ROLE_TAB_ACCESS: Record<UserRole, TabKey[]> = {
  ADMIN: ["GARMENT_GROUP", "EFFICIENCY"],
  DV: ["GARMENT_GROUP", "EFFICIENCY"],
  ME: ["GARMENT_GROUP", "EFFICIENCY"],
  PPIC: ["GARMENT_GROUP", "EFFICIENCY"],
};

const buildGroupRows = (
  garmentRows: GarmentGroupRow[],
  efficiencyRows: EfficiencyRow[]
): EditableGarmentGroupRow[] =>
  garmentRows.map((row) => ({
    ...row,
    efficiencyCount: efficiencyRows.filter((item) => item.garmentGroupId === row.id).length,
  }));

const createNextGarmentId = (rows: EditableGarmentGroupRow[]) =>
  rows.reduce((maxId, row) => Math.max(maxId, row.id), 0) + 1;

const createNextEfficiencyId = (rows: EditableEfficiencyRow[]) =>
  rows.reduce((maxId, row) => Math.max(maxId, row.id), 0) + 1;

const parseEfficiencyText = (text: string, garmentGroupId: number, nextId: number): EditableEfficiencyRow[] => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const delimiter = (lines[0] ?? "").includes("\t") ? "\t" : ",";

  return lines.map((line, index) => {
    const parts = line.split(delimiter).map((value) => value.trim());
    const prioritizeRaw = (parts[1] ?? "").toLowerCase();
    const prioritize =
      prioritizeRaw === "1st" ? 1 :
      prioritizeRaw === "2nd" ? 2 :
      prioritizeRaw === "3rd" ? 3 :
      Number(parts[1] ?? 0);
    const avgEff = Number(String(parts[3] ?? "0").replace("%", ""));

    return {
      id: nextId + index,
      garmentGroupId,
      line: parts[0] ?? "",
      prioritize: Number.isFinite(prioritize) ? prioritize : 0,
      productType: parts[2] ?? "",
      avgEff: Number.isFinite(avgEff) ? avgEff : 0,
    };
  });
};

export function SubTablesModal({ open, onClose, userRole }: SubTablesModalProps) {
  const allowedTabs = useMemo(() => ROLE_TAB_ACCESS[userRole], [userRole]);

  const [activeTab, setActiveTab] = useState<TabKey>(() => "GARMENT_GROUP");

  // DevExtreme overlay/positioning có thể crash khi render trước khi DOM mount.
  // Chỉ render Modal sau khi component đã mount.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // use rAF để đảm bảo DOM đã mount xong trước khi set state
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const [garmentRows, setGarmentRows] = useState<EditableGarmentGroupRow[]>(
    buildGroupRows(GARMENT_GROUP_MOCK, efficiencyMockData)
  );

  const [efficiencyRows, setEfficiencyRows] = useState<EditableEfficiencyRow[]>(efficiencyMockData);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(GARMENT_GROUP_MOCK[0]?.id ?? null);

  const selectedGroup = useMemo(
    () => garmentRows.find((row) => row.id === selectedGroupId) ?? null,
    [garmentRows, selectedGroupId]
  );

  const selectedEfficiencyRows = useMemo(
    () => efficiencyRows.filter((row) => row.garmentGroupId === selectedGroupId),
    [efficiencyRows, selectedGroupId]
  );

  const refreshGarmentRows = (nextGarmentRows: GarmentGroupRow[], nextEfficiencyRows: EfficiencyRow[]) => {
    setGarmentRows(buildGroupRows(nextGarmentRows, nextEfficiencyRows));
  };

  const handleResetAll = () => {
    setGarmentRows(buildGroupRows(GARMENT_GROUP_MOCK, efficiencyMockData));
    setEfficiencyRows(efficiencyMockData);
    setSelectedGroupId(GARMENT_GROUP_MOCK[0]?.id ?? null);
    setActiveTab("GARMENT_GROUP");
  };

  const handleSaveGarmentGroups = () => {

    console.log("Save garment groups:", garmentRows);

  };

  const handleSaveEfficiencyRows = () => {

    console.log("Save efficiency rows:", selectedEfficiencyRows);

  };

  const handleGarmentInserted = (
    event: DataGridTypes.RowInsertedEvent<EditableGarmentGroupRow, number>
  ) => {
    const insertedRow: GarmentGroupRow = {
      id: event.data.id || createNextGarmentId(garmentRows),
      grouping: event.data.grouping ?? "",
      workingNumberId: event.data.workingNumberId ?? "",
      productTypeCode: event.data.productTypeCode ?? "",
      productTypeDesc: event.data.productTypeDesc ?? "",
    };

    const nextRows = [...garmentRows, insertedRow];
    refreshGarmentRows(nextRows, efficiencyRows);
    setSelectedGroupId(insertedRow.id);
  };

  const handleGarmentUpdated = (
    event: DataGridTypes.RowUpdatedEvent<EditableGarmentGroupRow, number>
  ) => {
    const nextRows = garmentRows.map((row) =>
      row.id === event.data.id
        ? {
            ...row,
            grouping: event.data.grouping ?? row.grouping,
            workingNumberId: event.data.workingNumberId ?? row.workingNumberId,
            productTypeCode: event.data.productTypeCode ?? row.productTypeCode,
            productTypeDesc: event.data.productTypeDesc ?? row.productTypeDesc,
          }
        : row
    );

    refreshGarmentRows(nextRows, efficiencyRows);
  };

  const handleGarmentRemoved = (
    event: DataGridTypes.RowRemovedEvent<EditableGarmentGroupRow, number>
  ) => {
    const nextGarmentRows = garmentRows.filter((row) => row.id !== event.data.id);
    const nextEfficiencyRows = efficiencyRows.filter((row) => row.garmentGroupId !== event.data.id);
    refreshGarmentRows(nextGarmentRows, nextEfficiencyRows);
    setEfficiencyRows(nextEfficiencyRows);
    if (selectedGroupId === event.data.id) {
      setSelectedGroupId(nextGarmentRows[0]?.id ?? null);
    }
  };

  const handleEfficiencyInserted = (
    event: DataGridTypes.RowInsertedEvent<EditableEfficiencyRow, number>
  ) => {
    if (!selectedGroup) return;

    const insertedRow: EditableEfficiencyRow = {
      id: event.data.id || createNextEfficiencyId(efficiencyRows),
      garmentGroupId: selectedGroup.id,
      line: event.data.line ?? "",
      prioritize: Number(event.data.prioritize ?? 0),
      productType: event.data.productType ?? "",
      avgEff: Number(event.data.avgEff ?? 0),
    };

    const nextRows = [...efficiencyRows, insertedRow];
    setEfficiencyRows(nextRows);
    refreshGarmentRows(garmentRows, nextRows);
  };

  const handleEfficiencyUpdated = (
    event: DataGridTypes.RowUpdatedEvent<EditableEfficiencyRow, number>
  ) => {
    const nextRows = efficiencyRows.map((row) =>
      row.id === event.data.id
        ? {
            ...row,
            line: event.data.line ?? row.line,
            prioritize: Number(event.data.prioritize ?? row.prioritize),
            productType: event.data.productType ?? row.productType,
            avgEff: Number(event.data.avgEff ?? row.avgEff),
          }
        : row
    );

    setEfficiencyRows(nextRows);
    refreshGarmentRows(garmentRows, nextRows);
  };

  const handleEfficiencyRemoved = (
    event: DataGridTypes.RowRemovedEvent<EditableEfficiencyRow, number>
  ) => {
    const nextRows = efficiencyRows.filter((row) => row.id !== event.data.id);
    setEfficiencyRows(nextRows);
    refreshGarmentRows(garmentRows, nextRows);
  };

  const handleImportText = (text: string) => {
    if (!selectedGroup) return;

    const parsedRows = parseEfficiencyText(text, selectedGroup.id, createNextEfficiencyId(efficiencyRows));
    const nextRows = [...parsedRows, ...efficiencyRows];
    setEfficiencyRows(nextRows);
    refreshGarmentRows(garmentRows, nextRows);
  };

  return (
    <Modal
      show={open && mounted}
      onHide={onClose}
      size="xl"
      centered
      dialogClassName="subtables-modal"
      backdrop="static"
    >

      {/* <Modal.Header closeButton>
        <Modal.Title>Sub Table</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
        {/* <div className="subtables-intro">
          <strong>Khu vực nhập liệu</strong>
          <span>
            Chọn tab tương ứng, nhập trực tiếp trên bảng, sau đó nhấn <b>Save</b> để lưu.
          </span>
        </div> */}

        <ul className="nav nav-tabs subtables-tabs">
          {allowedTabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                type="button"
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_META[tab]}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          <div
            className={`tab-pane fade ${
              activeTab === "GARMENT_GROUP" ? "show active" : ""
            }`}
          >
            <GarmentGroupTable
              rows={garmentRows}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onSave={handleSaveGarmentGroups}
              onReset={handleResetAll}
              onRowInserted={handleGarmentInserted}
              onRowUpdated={handleGarmentUpdated}
              onRowRemoved={handleGarmentRemoved}
            />
          </div>

          <div
            className={`tab-pane fade ${
              activeTab === "EFFICIENCY" ? "show active" : ""
            }`}
          >
            <EfficiencyTable
              selectedGroup={selectedGroup}
              rows={selectedEfficiencyRows}
              onSave={handleSaveEfficiencyRows}
              onUploadText={handleImportText}
              onReset={handleResetAll}
              onRowInserted={handleEfficiencyInserted}
              onRowUpdated={handleEfficiencyUpdated}
              onRowRemoved={handleEfficiencyRemoved}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline-secondary" onClick={handleResetAll}>
          Reset
        </button>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
}
