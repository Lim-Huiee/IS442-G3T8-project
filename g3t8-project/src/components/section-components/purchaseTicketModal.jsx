import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';

export const PurchaseTicketModal = ({ show, handleClose, data }) => {
    const [cart, setCart] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [viewCart, setViewCart] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [ticketQuantity, setTicketQuantity] = useState(1);

    const isFormComplete = firstName && lastName && mobileNumber && ticketQuantity > 0;

    const handleBuyTicket = (ticket) => {
        setSelectedTicket(ticket);
        setViewCart(true);
    };

    const handleAddToCart = () => {
        if (selectedTicket) {
            setCart([...cart, { ...selectedTicket, quantity: ticketQuantity }]);
            setSelectedTicket(null);
            setViewCart(true);
        }
    };

    const handleBackToEvents = () => {
        setViewCart(false);
    };

    const handleQuantityChange = (quantity) => {
        setTicketQuantity(quantity);
    };

    const handlePurchase = () => {
        // Logic to handle purchase
        console.log({
            firstName,
            lastName,
            mobileNumber,
            ticketQuantity
        });
    };

    return (
        <div>
            <Modal show={show && !viewCart} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Find tickets - {data.eventName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.eventDateTime ? data.eventDateTime.replace("T", " ") : "Loading..."}</td>
                                <td>{data.venue}</td>
                                <td>{data.ticketPrice}</td>
                                <td>{data.numTicketsAvailable > 0 ? "Available" : "Sold out"}</td>
                                <td>
                                    {data.numTicketsAvailable > 0 ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                handleBuyTicket(data);
                                                handleAddToCart();
                                            }}
                                        >
                                            Buy Tickets
                                        </Button>
                                    ) : (
                                        "Sold out"
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            {/* Shopping Cart Modal */}
            <Modal show={viewCart} onHide={handleBackToEvents} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Input Your Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                        <input type="tel" className="form-control" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ticketQuantity" className="form-label">Ticket Quantity</label>
                        <input type="number" className="form-control" id="ticketQuantity" value={ticketQuantity} onChange={(e) => handleQuantityChange(e.target.value)} required min="1" />
                    </div>
                    {isFormComplete && (
                        <Button variant="primary" onClick={handlePurchase}>Purchase</Button>
                    )}
                </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};