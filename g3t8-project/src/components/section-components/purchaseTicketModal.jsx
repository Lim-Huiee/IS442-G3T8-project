import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

export const PurchaseTicketModal = ({show, handleClose, data}) => {

    console.log(data);

    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Find tickets - {data.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table stiped bordered>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.shows.map((d,i) => {
                                return (
                                    <tr>
                                        <td key={`${d}-${i}`}>{d.date}</td>
                                        <td key={`${data.venue}-{i}`}>{d.venue}</td>
                                        <td key={`${data.price}-{i}`}>{d.price}</td>
                                        <td key={i}> {d.status=="active"? <Button variant="primary">Buy Tickets</Button> : "Sold out"}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
}