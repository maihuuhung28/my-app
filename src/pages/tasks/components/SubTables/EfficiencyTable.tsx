import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import type { EfficiencyRow } from '../../models/efficiency.model';

interface EfficiencyTableProps {
  selectedGarmentGroupId?: number | null;
  data: EfficiencyRow[];
}

type DraftRow = EfficiencyRow & { __isNew?: boolean };

const EfficiencyTable: React.FC<EfficiencyTableProps> = ({
  selectedGarmentGroupId,
  data,
}) => {
  const initialRows = useMemo(() => data, [data]);
  const [rows, setRows] = useState<DraftRow[]>(initialRows);
  const [dirty, setDirty] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftRow | null>(null);

  const filteredRows = useMemo(() => {
    if (!selectedGarmentGroupId) return [];
    return rows.filter((r) => r.garmentGroupId === selectedGarmentGroupId);
  }, [rows, selectedGarmentGroupId]);

  const handleUploadExcel = () => {
    console.log('Upload Excel clicked');
  };

  const markDirty = useCallback(() => setDirty(true), []);

  const beginEdit = useCallback((row: DraftRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setDraft(null);
  }, []);

  const handleSave = () => {
    console.log('Save data:', rows);
    setDirty(false);
    cancelEdit();
  };

  const handleCancel = () => {
    setRows(initialRows);
    setDirty(false);
    cancelEdit();
  };

  const handleAdd = () => {
    if (!selectedGarmentGroupId) return;

    const maxId = rows.reduce((acc, r) => Math.max(acc, r.id), 0);
    const newRow: DraftRow = {
      id: maxId + 1,
      garmentGroupId: selectedGarmentGroupId,
      line: '',
      prioritize: 0,
      productType: '',
      avgEff: 0,
      __isNew: true,
    };

    setRows((prev) => [newRow, ...prev]);
    markDirty();
    beginEdit(newRow);
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) cancelEdit();
    markDirty();
  };

  const commitRow = () => {
    if (!draft) return;
    setRows((prev) => prev.map((r) => (r.id === draft.id ? draft : r)));
    markDirty();
    setEditingId(null);
    setDraft(null);
  };

  if (!selectedGarmentGroupId) {
    return (
      <div style={{ padding: 16, color: '#888' }}>
        Chọn Garment Group để xem Efficiency
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={handleUploadExcel}>
            Upload Excel
          </Button>
          <Button variant="outline-success" size="sm" onClick={handleAdd}>
            Add
          </Button>
        </div>

        <div>
          <Button
            variant="success"
            size="sm"
            className="me-2"
            disabled={!dirty}
            onClick={handleSave}
          >
            Lưu
          </Button>
          <Button variant="secondary" size="sm" disabled={!dirty} onClick={handleCancel}>
            Hủy
          </Button>
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: 350, overflow: 'auto' }}>
        <table className="table table-sm table-bordered table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Line</th>
              <th style={{ width: 120 }}>Prioritize</th>
              <th>Product Type</th>
              <th style={{ width: 150 }}>Avg %EFF</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No data
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isEditing = editingId === row.id;
                const current = isEditing ? draft : row;
                const avgEffFormatted = (() => {
                  const val = current?.avgEff ?? 0;
                  const num = typeof val === 'number' ? val : Number(val);
                  return `${num.toFixed(2).replace(/\.00$/, '')}%`;
                })();

                return (
                  <tr
                    key={row.id}
                    className={isEditing ? 'table-warning' : 'table-row-default'}
                  >
                    <td>{row.id}</td>

                    <td>
                      {isEditing ? (
                        <input
                          className="form-control form-control-sm"
                          value={current?.line ?? ''}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev ? { ...prev, line: e.target.value } : prev
                            )
                          }
                        />
                      ) : (
                        row.line
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          className="form-control form-control-sm"
                          type="number"
                          value={current?.prioritize ?? 0}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev
                                ? { ...prev, prioritize: Number(e.target.value) }
                                : prev
                            )
                          }
                        />
                      ) : (
                        row.prioritize
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          className="form-control form-control-sm"
                          value={current?.productType ?? ''}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev
                                ? { ...prev, productType: e.target.value }
                                : prev
                            )
                          }
                        />
                      ) : (
                        row.productType
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {isEditing ? (
                        <input
                          className="form-control form-control-sm text-end"
                          type="number"
                          value={current?.avgEff ?? 0}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev ? { ...prev, avgEff: Number(e.target.value) } : prev
                            )
                          }
                        />
                      ) : (
                        avgEffFormatted
                      )}
                    </td>

                    <td>
                      {!isEditing ? (
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => beginEdit(row)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <Button variant="success" size="sm" onClick={commitRow}>
                            Save
                          </Button>
                          <Button variant="secondary" size="sm" onClick={cancelEdit}>
                            Cancel
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EfficiencyTable;

