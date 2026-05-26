import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import type { GarmentGroupRow } from '../../models/garment-group.model';

interface GarmentGroupTableProps {
  data: GarmentGroupRow[];
  onSelect: (id: number | null) => void;
}

type DraftRow = GarmentGroupRow & { __isNew?: boolean };

const GarmentGroupTable: React.FC<GarmentGroupTableProps> = ({ data, onSelect }) => {
  const initialRows = useMemo(() => data, [data]);
  const [rows, setRows] = useState<DraftRow[]>(initialRows);
  const [dirty, setDirty] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftRow | null>(null);

  const markDirty = useCallback(() => setDirty(true), []);

  const resetEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const groupedRows = useMemo(() => {
    const map = new Map<string, DraftRow[]>();
    rows.forEach((row) => {
      if (!map.has(row.grouping)) map.set(row.grouping, []);
      map.get(row.grouping)!.push(row);
    });
    return Array.from(map.entries());
  }, [rows]);

  const handleAdd = () => {
    const maxId = rows.reduce((acc, r) => Math.max(acc, r.id), 0);
    const newRow: DraftRow = {
      id: maxId + 1,
      grouping: '',
      workingNumberId: '',
      productTypeCode: '',
      productTypeDesc: '',
      __isNew: true,
    };

    setRows((prev) => [newRow, ...prev]);
    setEditingId(newRow.id);
    setDraft(newRow);
    markDirty();
  };

  const handleEdit = (row: DraftRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    resetEdit();
    markDirty();
    onSelect(null);
  };

  const commitRow = () => {
    if (!draft) return;
    setRows((prev) => prev.map((r) => (r.id === draft.id ? draft : r)));
    resetEdit();
    markDirty();
  };

  const handleSaveAll = () => {
    console.log('Save data:', rows);
    setDirty(false);
    resetEdit();
  };

  const handleCancelAll = () => {
    setRows(initialRows);
    setDirty(false);
    resetEdit();
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-success" size="sm" onClick={handleAdd}>
          Add +
        </Button>

        <div>
          <Button
            variant="success"
            size="sm"
            className="me-2"
            disabled={!dirty}
            onClick={handleSaveAll}
          >
            Lưu
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!dirty}
            onClick={handleCancelAll}
          >
            Hủy
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ maxHeight: 400 }}>
        <table className="table table-sm table-bordered table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 120 }} className="text-center">Grouping</th>
              <th style={{ width: 120 }} className="text-center">Working Number ID</th>
              <th style={{ width: 120 }} className="text-center">Product Type Code</th>
              <th style={{ width: 150 }} className="text-center">Product Type Desc</th>
              <th style={{ width: 140 }} className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {groupedRows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">No data</td>
              </tr>
            )}

            {groupedRows.map(([grouping, groupRows]) =>
              groupRows.map((row, index) => {
                const isEditing = editingId === row.id;
                const current = isEditing ? draft : row;

                return (  
                  <tr key={row.id}>
                    {index === 0 && (
                      <td
                        rowSpan={groupRows.length}
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            fontWeight: 600,
                          }}
                        >
                          {grouping}
                        </div>
                      </td>
                    )}

                    <td>
                      {isEditing ? (
                        <input
                          className="form-control form-control-sm"
                          value={current?.workingNumberId ?? ''}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev ? { ...prev, workingNumberId: e.target.value } : prev
                            )
                          }
                        />
                      ) : (
                        row.workingNumberId
                      )}
                    </td>

                    <td>{row.productTypeCode}</td>
                    <td>{row.productTypeDesc}</td>

                    <td className="text-center">
                      {!isEditing ? (
                        <>
                          <Button size="sm" className="me-1" onClick={() => handleEdit(row)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-1"
                            onClick={commitRow}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="secondary" onClick={resetEdit}>
                            Cancel
                          </Button>
                        </>
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

export default GarmentGroupTable;