import { Button, Card, Modal, Table } from "react-bootstrap";

export interface TechpackPanelProps {
  show: boolean;
  onClose: () => void;
order: { style?: string } | null;
}

export function TechpackPanel({ show, onClose, order }: TechpackPanelProps) {
  const files = [
    {
      fileName: "TW5703F26_CLIMAPROOF Hooded Rain Jacket.ai",
      date: "10/17/2025 5:33:49 AM",
      uploader: "Belmont, Katie",
      initialUploadSeason: "FW26",
      description: "",
      assetId: "6394ef36-56cc-46a5-b692-650be37a6448",
    },
  ];

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>TechPack - Mã hàng: <span>{order?.style}</span></Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>File name</th>
                  <th>Date</th>
                  <th>Uploader</th>
                  <th>Initial Upload Season</th>
                  <th>Description</th>
                  <th>Asset ID</th>
                  <th style={{ width: "60px" }}>Download</th>
                </tr>
              </thead>

              <tbody>
                {files.map((file, index) => (
                  <tr key={index}>
                    <td>{file.fileName}</td>
                    <td>{file.date}</td>
                    <td>{file.uploader}</td>
                    <td>{file.initialUploadSeason}</td>
                    <td>{file.description}</td>
                    <td>{file.assetId}</td>
                    <td className="text-center">
                      <Button
                        variant="link"
                        className="p-0 text-primary"
                        title="Download file"
                        onClick={() =>
                          window.open(`/api/download/${file.assetId}`, "_blank")
                        }
                      >
                        <i className="bi bi-download fs-5"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}