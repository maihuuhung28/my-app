// import { Modal, Table, Button, Badge } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export interface AuditLogItem {
//   id: string | number;
//   time: string;
//   user: string;
//   action: "UPDATE" | "CONFIRM" | "DELETE";
//   line?: string;
//   field?: string;
//   oldValue?: string;
//   newValue?: string;
// }

// interface AuditLogProps {
//   show: boolean;
//   onClose: () => void;
//   logs: AuditLogItem[];
// }

// export function AuditLog({ show, onClose, logs }: AuditLogProps) {
//   const renderActionBadge = (action: AuditLogItem["action"]) => {
//     switch (action) {
//       case "CONFIRM":
//         return <Badge bg="success">CONFIRM</Badge>;
//       case "DELETE":
//         return <Badge bg="danger">DELETE</Badge>;
//       default:
//         return <Badge bg="warning" text="dark">UPDATE</Badge>;
//     }
//   };

//   return (
//     <Modal show={show} onHide={onClose} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Audit History</Modal.Title>
//       </Modal.Header>

//       <Modal.Body className="p-0">
//         <Table striped bordered hover responsive size="sm" className="mb-0">
//           <thead className="table-light">
//             <tr>
//               <th style={{ width: 160 }}>Time</th>
//               <th style={{ width: 120 }}>User</th>
//               <th style={{ width: 110 }}>Action</th>
//               <th style={{ width: 80 }}>Line</th>
//               <th>Field</th>
//               <th>Old Value</th>
//               <th>New Value</th>
//             </tr>
//           </thead>

//           <tbody>
//             {logs.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="text-center text-muted py-4">
//                   No audit history
//                 </td>
//               </tr>
//             )}

//             {logs.map((log) => (
//               <tr key={log.id}>
//                 <td>{log.time}</td>
//                 <td>{log.user}</td>
//                 <td>{renderActionBadge(log.action)}</td>
//                 <td>{log.line ?? "-"}</td>
//                 <td>{log.field ?? "-"}</td>
//                 <td>{log.oldValue ?? "-"}</td>
//                 <td>{log.newValue ?? "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }
import { Modal, Table, Button, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export interface AuditLogItem {
  id: string | number;
  time: string;
  user: string;
  role?: string; // 👈 thêm role
  action: "UPDATE" | "CONFIRM" | "DELETE";
  line?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

interface AuditLogProps {
  show: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
}

export function AuditLog({ show, onClose, logs }: AuditLogProps) {
  const renderActionBadge = (action: AuditLogItem["action"]) => {
    switch (action) {
      case "CONFIRM":
        return <Badge bg="success">CONFIRM</Badge>;
      case "DELETE":
        return <Badge bg="danger">DELETE</Badge>;
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
        <Modal.Title>Lịch sử thay đổi</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Table striped bordered hover responsive size="sm" className="mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 160 }}>Thời gian</th>
              <th style={{ width: 120 }}>Người thay đổi</th>
              <th style={{ width: 110 }}>Role</th>
              <th style={{ width: 110 }}>Trạng thái</th>
              <th>Field</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                Chưa có lịch sử thay đổi
                </td>
              </tr>
            )}

            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td>{log.user}</td>
                <td>{log.role ?? "-"}</td>
                <td>{renderActionBadge(log.action)}</td>
                <td>{log.line ?? "-"}</td>
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