import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';

import GarmentGroupTable from './GarmentGroupTable';
import EfficiencyTable from './EfficiencyTable';

import { GARMENT_GROUP_MOCK } from '../../data/garment-group.mock';
import { efficiencyMockData } from '../../data/efficiency.mock';

export type UserRole = 'DV' | 'ME' | 'PPIC' | 'ADMIN';

type TabKey = 'GARMENT_GROUP' | 'EFFICIENCY';

interface SubTablesModalProps {
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const TAB_META: Record<TabKey, { label: string }> = {
  GARMENT_GROUP: { label: 'Bảng phụ 1 (DV)' },
  EFFICIENCY: { label: 'Bảng phụ 2 (ME)' },
};

const ROLE_TAB_ACCESS: Record<UserRole, TabKey[]> = {
  DV: ['GARMENT_GROUP'],
  PPIC: ['GARMENT_GROUP'],
  ME: ['EFFICIENCY'],
  ADMIN: ['GARMENT_GROUP', 'EFFICIENCY'],
};

const SubTablesModal: React.FC<SubTablesModalProps> = ({
  open,
  onClose,
  userRole,
}) => {
  /** Tabs được phép hiển thị theo role */
  const allowedTabs = ROLE_TAB_ACCESS[userRole];

  /** Tab đang active */
  const [activeTab, setActiveTab] = useState<TabKey>(allowedTabs[0]);

  /** Id nhóm sản phẩm được chọn (dùng cho bảng Efficiency) */
  const [selectedGarmentGroupId, setSelectedGarmentGroupId] =
    useState<number | null>(null);

  const visibleTabs = useMemo(
    () =>
      allowedTabs.map((key) => ({
        key,
        label: TAB_META[key].label,
      })),
    [allowedTabs]
  );

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [allowedTabs, activeTab]);

  useEffect(() => {
    if (activeTab !== 'EFFICIENCY') {
      setSelectedGarmentGroupId(null);
    }
  }, [activeTab]);

  return (
    <Modal show={open} onHide={onClose} size="xl" backdrop="static">
      <Modal.Body>
        {/* ===== TAB HEADER ===== */}
        <ul className="nav nav-tabs mb-3">
          {visibleTabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${
                  activeTab === tab.key ? 'active' : ''
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/*  TAB CONTENT */}
        {activeTab === 'GARMENT_GROUP' && (
          <GarmentGroupTable
            data={GARMENT_GROUP_MOCK}
            onSelect={setSelectedGarmentGroupId}
          />
        )}

        {activeTab === 'EFFICIENCY' && (
          <EfficiencyTable
            selectedGarmentGroupId={selectedGarmentGroupId}
            data={efficiencyMockData}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubTablesModal;