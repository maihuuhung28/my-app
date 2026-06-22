// Audit Log – Lịch sử thay đổi
// Component hiển thị lịch sử thao tác của người dùng ở bảng 3 (Production Plan)
import { useMemo } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AuditLogItem } from "../../types/audit.types";

interface AuditLogProps {
  show: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
}

// Model dữ liệu đã chuẩn hóa cho UI
type NormalizedAuditLog = {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: AuditLogItem["action"];
  line?: string;
  style?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
};

// Hàm format thời gian an toàn
function formatTimestampSafe(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Chuẩn hóa dữ liệu audit log
// Hỗ trợ cả dữ liệu mới và dữ liệu legacy
function normalizeAuditLog(log: AuditLogItem): NormalizedAuditLog {
  const legacy = log as any;

  return {
    id: log.id,

    // Ưu tiên timestamp mới, fallback sang legacy hoặc thời gian hiện tại
    timestamp:
      log.timestamp ??
      legacy.time ??
      new Date().toISOString(),

    // Lấy tên user từ actor hoặc legacy
    userName:
      log.actor?.userName ??
      legacy.user ??
      "System",

    // Lấy role từ actor hoặc legacy
    role:
      log.actor?.role ??
      legacy.role ??
      "-",

    action: log.action,
    line: log.line,
    style: log.style,
    field: log.field,
    oldValue: log.oldValue,
    newValue: log.newValue,
  };
}


// Cấu hình hiển thị badge theo action=
const ACTION_BADGE_CONFIG: Record<
  AuditLogItem["action"],
  { bg: string; label: string; textDark?: boolean }
> = {
  CREATE: { bg: "primary", label: "CREATE" },
  DELETE: { bg: "danger", label: "DELETE" },
  CONFIRM: { bg: "success", label: "CONFIRM" },
  UPDATE: { bg: "warning", label: "UPDATE", textDark: true },
};

// Hiển thị badge action
// Nhận action và render badge tương ứng
function ActionBadge({ action }: { action: AuditLogItem["action"] }) {
  // Lấy cấu hình theo action
  // Nếu action không hợp lệ thì fallback về UPDATE
  const config =
    ACTION_BADGE_CONFIG[action] ??
    ACTION_BADGE_CONFIG.UPDATE;

  return (
    <Badge
      bg={config.bg}
      text={config.textDark ? "dark" : undefined}
    >
      {config.label}
    </Badge>
  );
}


// Component chính
////////////////////////////////////////////
// Hiển thị modal chứa bảng lịch sử thao tác
export function AuditLog({ show, onClose, logs }: AuditLogProps) {
  // Chuẩn hóa dữ liệu log để dùng cho UI
  const normalizedLogs = useMemo(
    () => logs.map(normalizeAuditLog),
    [logs]
  );

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>History Change</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Table striped bordered hover responsive size="sm" className="mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 170 }}>Time</th>
              <th style={{ width: 120 }}>User</th>
              <th style={{ width: 100 }}>Role</th>
              <th style={{ width: 100 }}>Action</th>
              <th style={{ width: 110 }}>Line</th>
              <th style={{ width: 180 }}>Style</th>
              <th style={{ width: 160 }}>Field</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>

          <tbody>
            {/* Không có dữ liệu */}
            {normalizedLogs.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  No history change available
                </td>
              </tr>
            )}

            {/* Render danh sách audit log */}
            {normalizedLogs.map((log) => (
              <tr key={log.id}>
                <td>{formatTimestampSafe(log.timestamp)}</td>
                <td>{log.userName}</td>
                <td>{log.role}</td>
                <td>
                  <ActionBadge action={log.action} />
                </td>
                <td>{log.line ?? "-"}</td>
                <td>{log.style ?? "-"}</td>
                <td>{log.field ?? "-"}</td>
                <td>{log.oldValue ?? "-"}</td>
                <td>{log.newValue ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}