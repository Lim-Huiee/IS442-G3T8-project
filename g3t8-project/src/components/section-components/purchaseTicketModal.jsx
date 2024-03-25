import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import React, { useContext, useState } from 'react';


export const PurchaseTicketModal = ({ show, handleClose, data }) => {
    
    const handleBuyTickets = () => {
        const userId = parseInt(localStorage.getItem("userId")); // Parse user ID to integer
        if (!userId || isNaN(userId)) {
            window.location.href = "/loginRegisterPage"; // Redirect if user ID is not valid or not logged in
            return;
        } else {
            // Create an object representing the purchased event
            const purchasedEvent = {
                eventId: data.eventID, // Include event ID
                eventType: data.eventType, // Include event type
                eventName: data.eventName,
                eventDateTime: data.eventDateTime,
                venue: data.venue,
                ticketPrice: data.ticketPrice,
                numTickets: numTickets // Number of tickets selected
            };
        
            // Update events in local storage
            updateEventsInLocalStorage(userId, purchasedEvent);
        
            handleClose();
            
            return;
        }
    };
    

    const [numTickets, setNumTickets] = useState(1); // Default to 1 ticket

    const handleTicketChange = (event) => {
        setNumTickets(parseInt(event.target.value));
    };
    const updateEventsInLocalStorage = (userId, eventData) => {
        // Retrieve existing events for the user from local storage or initialize an empty object
        const storedEvents = JSON.parse(localStorage.getItem("events")) || {};
    
        // Check if the user already has events stored
        if (storedEvents[userId]) {
            // Find the index of the event with the same ID if it exists
            const index = storedEvents[userId].findIndex(event => event.id === eventData.id);
    
            // If the event with the same ID exists, update its data
            if (index !== -1) {
                storedEvents[userId][index] = eventData;
            } else {
                // If the event with the same ID doesn't exist, push the new event data
                storedEvents[userId].push(eventData);
            }
        } else {
            // Initialize an array for the user's events and push the new event data
            storedEvents[userId] = [eventData];
        }
    
        // Store the updated events back in local storage
        localStorage.setItem("events", JSON.stringify(storedEvents));
        console.log("Added:", eventData);
    };
    
      

    const renderTicketOptions = (maxTickets) => {
        const options = [];
        const maxSelectableTickets = Math.min(5, maxTickets); // Set the maximum selectable tickets to 5
        for (let i = 1; i <= maxSelectableTickets; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return options;
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={false}>
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
                                <th>Tickets</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {data.shows.map((d,i) => {
                                return (
                                    <tr>
                                        <td key={`${d}-${i}`}>{d.date}</td>
                                        <td key={`${data.venue}-{i}`}>{d.venue}</td>
                                        <td key={`${data.price}-{i}`}>{d.price}</td>
                                        <td key={i}> {d.status=="active"? <Button variant="primary">Buy Tickets</Button> : "Sold out"}</td>
                                    </tr>
                                )
                            })} */}
                            <tr>
                                <td>{data.eventDateTime ? data.eventDateTime.replace("T", " ") : "Loading..."}</td>
                                <td>{data.venue}</td>
                                <td>{data.ticketPrice}</td>
                                <td>
                                    <select value={numTickets} onChange={handleTicketChange}>
                                        {renderTicketOptions(data.numTicketsAvailable)}
                                    </select>
                                </td>
                                <td> {data.numTicketsAvailable > 0 ? <Button variant="primary" onClick={handleBuyTickets}>Buy Tickets</Button> : "Sold out"}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
}
