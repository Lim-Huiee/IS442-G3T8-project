import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

export const PurchaseTicketModal = ({show, handleClose}) => {

    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Find tickets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table stiped bordered>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Venue</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ed Sheeran</td>
                                <td>National Stadium</td>
                                <td>16 Feb 2024</td>
                                <td>$128</td>
                                <td> <Button variant="primary">Buy Tickets</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
}