import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



export const CheckoutModal = ({ onHide, handleCheckout, ...props }) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={onHide}>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm Purchase
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to checkout?</h4>
          <p>
            This action cannot be undone. Refunds for tickets may only be processed less than 48 hours before start of events.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleCheckout} style={{ backgroundColor: " #608dfd", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "none", outline: "none", fontSize: "20px" }}>Yes</Button>
          <Button variant="secondary" onClick={onHide} style={{ padding: "10px", borderRadius: "5px", cursor: "pointer", border: "none", outline: "none", fontSize: "20px" }}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  };