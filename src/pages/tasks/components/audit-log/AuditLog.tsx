import { Badge, Button, Modal, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AuditLogItem } from "../../types/audit.types";

interface AuditLogProps {
  show: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
}

const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

type LegacyAuditLog = AuditLogItem & {
  time?: string;
  user?: string;
  role?: string;
};

//Trạng thái Hiện thị lịch sử thay đổi
export function AuditLog({ show, onClose, logs }: AuditLogProps) {
  const renderActionBadge = (action: AuditLogItem["action"]) => {
    switch (action) {
      case "CONFIRM":
        return <Badge bg="success">CONFIRM</Badge>; 
      case "DELETE":
        return <Badge bg="danger">DELETE</Badge>;
      case "CREATE":
        return <Badge bg="primary">CREATE</Badge>;
      default:
        return (
          <Badge bg="warning" text="dark">
            UPDATE
          </Badge>
        );
    }
  };

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
            {logs.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  No history change available
                </td>
              </tr>
            )}

            {logs.map((rawLog) => {
              const log = rawLog as LegacyAuditLog;
              const timestamp = log.timestamp || log.time || new Date().toISOString();
              const userName = log.actor?.userName || log.user || "-";
              const role = log.actor?.role || log.role || "-";

              return (
                <tr key={log.id}>
                  <td>{formatTimestamp(timestamp)}</td>
                  <td>{userName}</td>
                  <td>{role}</td>
                  <td>{renderActionBadge(log.action)}</td>
                  <td>{log.line ?? "-"}</td>
                  <td>{log.style ?? "-"}</td>
                  <td>{log.field ?? "-"}</td>
                  <td>{log.oldValue ?? "-"}</td>
                  <td>{log.newValue ?? "-"}</td>
                </tr>
              );
            })}
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
