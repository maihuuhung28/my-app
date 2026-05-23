import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Modal, Nav, Row } from "react-bootstrap";
import "./TechpackPanel.scss";
import type { Order } from "../../data/order.data";

type TechpackKey = "front" | "back" | "collar" | "sleeve";

export interface TechpackPanelProps {
  show: boolean;
  onClose: () => void;
  order: Order | null;
}

const techpackImages: Record<TechpackKey, string | null> = {
  front: null,
  back: null,
  collar: null,
  sleeve: null,
};

function TechpackImageViewer({
  title,
  src,
}: {
  title: string;
  src: string | null;
}) {
  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="fw-bold">{title}</div>
          <Badge bg={src ? "success" : "secondary"}>
            {src ? "Has image" : "Placeholder"}
          </Badge>
        </div>

        <div
          className="border rounded bg-light d-flex align-items-center justify-content-center flex-grow-1"
          style={{ minHeight: 360 }}
        >
          {src ? (
            <img
              src={src}
              alt={title}
              className="img-fluid"
              style={{ maxHeight: 420, objectFit: "contain" }}
            />
          ) : (
            <div className="text-center px-3">
              <div className="fw-bold mb-2">Chưa có dữ liệu ảnh</div>
              <div className="text-muted">
                Khu vực này sẽ hiển thị ảnh techpack của mã hàng
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export function TechpackPanel({ show, onClose, order }: TechpackPanelProps) {
  const [key, setKey] = useState<TechpackKey>("front");

  const header = useMemo(() => {
    if (!order) return null;
    return {
      title: `Techpack mã hàng [${order.style}]`,
      meta: `${order.season} • ${order.buy}`,
    };
  }, [order]);

  const currentImage = techpackImages[key];
  const currentTitle =
    key === "front"
      ? "Thân (Front)"
      : key === "back"
        ? "Sau (Back)"
        : key === "collar"
          ? "Cổ (Collar)"
          : "Tay (Sleeve)";

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      backdrop="static"
      scrollable
      fullscreen="lg-down"
    >
      <Modal.Header closeButton>
        <div className="w-100">
          <Modal.Title className="mb-1">
            {header?.title ?? "Techpack"}
          </Modal.Title>
          {header?.meta ? (
            <div className="text-muted small">{header.meta}</div>
          ) : null}
        </div>
      </Modal.Header>

      <Modal.Body>
        {!order ? (
          <div className="text-center text-muted py-5">Không có dữ liệu techpack.</div>
        ) : (
          <Row className="g-3">
            <Col lg={3}>
              <Card className="mb-3">
                <Card.Body>
                  <div className="fw-bold mb-3">Thông tin chung</div>
                  <div><strong>Season: </strong>{order.season}</div>
                  <div><strong>Buy: </strong>{order.buy}</div>
                  <div><strong>Style: </strong>{order.style}</div>
                  <div><strong>Product: </strong>{order.productType}</div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <div className="fw-bold mb-3">Các Phần Thân</div>
                  <Nav variant="pills" className="flex-column gap-2">
                    <Nav.Link active={key === "front"} onClick={() => setKey("front")}>
                      Thân (Front)
                    </Nav.Link>
                    <Nav.Link active={key === "back"} onClick={() => setKey("back")}>
                      Sau (Back)
                    </Nav.Link>
                    <Nav.Link active={key === "collar"} onClick={() => setKey("collar")}>
                      Cổ (Collar)
                    </Nav.Link>
                    <Nav.Link active={key === "sleeve"} onClick={() => setKey("sleeve")}>
                      Tay (Sleeve)
                    </Nav.Link>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={9}>
              <TechpackImageViewer title={currentTitle} src={currentImage} />
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}