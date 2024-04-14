import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { EventListing } from '../eventListing';
import Button from "react-bootstrap/Button";
import "./../../App.css";
import axios from 'axios';

export const MyEventsPage = () => {
  const [userId, setUserId] = useState("");

  const [myEvents, setMyEvents] = useState({});
  const [eventDetails, setEventDetails] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get(`http://localhost:4567/get_orders/${userId}`);
        console.log('Response from server:', response.data);
  
        const compiledEvents = {};
  
        response.data.forEach(order => {
          const eventsBooked = order.eventsBooked;
          const tickets = order.orderTickets;
          Object.keys(eventsBooked).forEach(eventId => {
            const quantity = eventsBooked[eventId];
            if (!compiledEvents[eventId]) {
              compiledEvents[eventId] = {}; // Initialize the object if it doesn't exist
            }
            if (!compiledEvents[eventId]['qty']) {
              compiledEvents[eventId]['qty'] = 0; // Initialize 'qty' if it doesn't exist
            }
            compiledEvents[eventId]['qty'] += quantity;
            if ('tickets' in compiledEvents[eventId]) {
              compiledEvents[eventId]['tickets'].push(...tickets);
            } else {
              compiledEvents[eventId]['tickets'] = tickets;
            }
          });
        });
  
        setMyEvents(compiledEvents);
        console.log(compiledEvents);
  
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const details = [];
      for (const [eventId, eventData] of Object.entries(myEvents)) {
        try {
          const response = await axios.get(`http://localhost:4567/get_event_by_id/${eventId}`);
          console.log('Response from server:', response.data);
          const tickets = eventData.tickets;
          // Calculate the quantity based on the total quantity of tickets with status "delivered"
          const deliveredTicketsQty = tickets.filter(ticket => ticket.ticketStatus === "delivered").length;
          if (deliveredTicketsQty != 0) {
            const eventDataWithQty = { ...response.data, qty: deliveredTicketsQty, tickets };
            details.push(eventDataWithQty);
          }
          console.log(details);
        } catch (error) {
          console.error('Error fetching events details:', error);
        }
      }
      console.log(details);
      setEventDetails(details);
    };
  
    fetchEventDetails();
  }, [myEvents]);

  const [refundQty, setRefundQty] = useState({}); // Initialize refund quantity for each event

  const handleQuantityChange = (eventId, amount, maxQty) => {
    setRefundQty(prevState => {
      const updatedQty = (prevState[eventId] || 0) + amount;
      const newQty = Math.max(1, Math.min(maxQty, updatedQty));
      return {
        ...prevState,
        [eventId]: newQty
      };
    });
  };

  const handleRefund = async (userId, orderId, eventId, quantity, maxqty) => {
    // if (quantity == maxqty) {
    //   try {
    //     const response = await axios.post(`http://localhost:4567/process_refund_order/${userId}/${orderId}`);
    //     console.log('Refund processed:', response.data);
    //     // Optionally, update state or UI to reflect the refund status
    //   } catch (error) {
    //     console.error('Error processing refund:', error);
    //   }
    // } else {
      console.log('Refund quantity does not match event quantity');
      try {
        const response = await axios.post(`http://localhost:4567/process_refund_quantity/${eventId}/${quantity}/${userId}`);
        console.log('Refund processed:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Error processing refund:', error);
      }
    // }
  };

  const isRefundDisabled = (eventDateTime) => {
    const eventDateTimeObject = new Date(eventDateTime);
    const currentDateTime = new Date();
    const timeDifference = eventDateTimeObject - currentDateTime;
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
    return hoursDifference < 48;
  };

  return (
    <div>
      <Navigation />
      <table>
        <tr>
          <th style={{ fontSize: 20, textAlign: 'center', width: '500px', padding: 20, paddingLeft: 100 }}>My Events</th>
          <th style={{ fontSize: 20, textAlign: 'center', width: '500px', padding: 20 }}>Quantity of Tickets Purchased</th>
          <th style={{ fontSize: 20, textAlign: 'center', width: '500px', padding: 20 }}>My Tickets</th>
        </tr>
        {eventDetails.map(event => (
          <React.Fragment key={event.eventID}>
            <tr>
              <td>
                <div style={{ width: '500px', height: '60px', marginLeft: 90, paddingBottom: 100, marginBottom: 120 }}>
                  <EventListing data={event} />
                </div>
              </td>
              <td style={{ width: '200px', textAlign: 'center', fontSize: "15px" }}>
                {event.qty}
                <br /><br />
                Request Refund:
                <br />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Button variant="outline-primary" style={{ backgroundColor: " #608dfd", color: "white", padding: "10px", marginTop: "10px", borderRadius: "5px", cursor: "pointer", border: "none", outline: "none" }} onClick={() => handleQuantityChange(event.eventID, -1, event.qty)}>-</Button>
                  <span style={{ margin: "0 10px" }}>{refundQty[event.eventID] || 1}</span>
                  <Button variant="outline-primary" style={{ backgroundColor: " #608dfd", color: "white", padding: "10px", marginTop: "10px", borderRadius: "5px", cursor: "pointer", border: "none", outline: "none" }} onClick={() => handleQuantityChange(event.eventID, 1, event.qty)}>+</Button>
                  <Button variant="outline-primary" disabled={isRefundDisabled(event.eventDateTime)} onClick={() => handleRefund(userId, event.tickets[0].orderID, event.eventID, refundQty[event.eventID] || 1, event.qty)} style={{ backgroundColor: " #608dfd", color: "white", padding: "10px", marginLeft: "10px", marginTop: "10px", borderRadius: "5px", cursor: "pointer", border: "none", outline: "none" }}>Refund</Button>
                </div>
                {isRefundDisabled(event.eventDateTime) && (
                    <small style={{ color: "red", marginLeft: "10px", marginTop: "10px" }}>
                      You cannot refund tickets ≤ 48 hours before the event.
                    </small>
                  )}
              </td>
              <td>
                  <table border="1" style={{ marginLeft: "auto", marginRight: "auto", width: 400}}>
                    <tr>
                      <th style={{ textAlign: 'center', width: '50px', padding: 10, border:"ridge" }}>Ticket ID</th>
                      <th style={{ textAlign: 'center', width: '50px', padding: 10, border:"ridge" }}>Ticket Status</th>
                    </tr>
                  {event.tickets.map(ticket => (
                  <tr key={ticket.ticketID}>
                    <td style={{ textAlign: 'center', width: '50px', padding: 10, border:"ridge" }}>{ticket.ticketID}</td>
                    <td style={{ textAlign: 'center', width: '50px', padding: 10, border:"ridge" }}>{ticket.ticketStatus}</td>
                  </tr>
                ))}
                </table>
            </td>
            </tr>
          </React.Fragment>
        ))}
      </table>
      <Footer />
    </div>
  );
};