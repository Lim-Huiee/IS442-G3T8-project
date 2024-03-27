import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { EventListing } from '../eventListing';
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
          Object.keys(eventsBooked).forEach(eventId => {
              const quantity = eventsBooked[eventId];
              if (compiledEvents[eventId]) {
                  compiledEvents[eventId] += quantity;
              } else {
                  compiledEvents[eventId] = quantity;
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
      for (const [eventId, quantity] of Object.entries(myEvents)) {
        try {
          const response = await axios.get(`http://localhost:4567/get_event_by_id/${eventId}`);
          console.log('Response from server:', response.data);
          const eventDataWithQty = { ...response.data, qty: quantity };
          details.push(eventDataWithQty);
        } catch (error) {
          console.error('Error fetching events details:', error);
        }
      }
      setEventDetails(details);
    };
  
    fetchEventDetails();
  }, [myEvents]);

  return (
    <div>
        <Navigation/>
        <table>
        <tr>
        <th style={{fontSize: 20, textAlign: 'center', width: '500px', padding: 20, paddingLeft: 200}}>My Events</th>
        <th style={{fontSize: 20, textAlign: 'center', width: '500px', padding: 20}}>Quantity of Tickets Purchased</th>
        </tr>
        {eventDetails.map(event => (
          <tr>
            <td>
            <div style={{width: '500px', height: '60px', marginLeft: 250, paddingBottom: 100, marginBottom: 120}}>
              <EventListing data={event} />
            </div>
            </td>
            <td style={{width: '200px', textAlign: 'center'}}>
            {event.qty}
            </td>
          </tr>
        ))}
        </table>
        <Footer/>
    </div>
  );
};