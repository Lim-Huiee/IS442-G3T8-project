import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getTodayDate } from "@mui/x-date-pickers/internals";
import axios from 'axios'; // Import Axios for making HTTP requests

export const EventModal = ({show, action, handleClose, data, processDateTime}) => {

    const [values, setValues] = useState(data);
    const [dateTime, setDateTime] = useState({});
    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value // Remove square brackets around event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(values);

        // //FE validation
        let error = {};
        if (values.eventType==="") {
            error.eventTypeError = "Please select an event type";
        }
        if (values.eventName==="") {
            error.eventNameError = "Event name should not be empty";
        }
        if (values.venue==="") {
            error.venueError = "Event venue should not be empty";
        }
        if (values.eventDateTime==="") {
            error.eventDateTimeError = "Please pick a date and time";
        } else if (dateTime <= new Date().getTime()) {
            error.eventDateTimeError = "Please pick a future date and time";
        }
        if (values.ticketPrice==="" || values.ticketPrice==="0" || values.ticketPrice==="-0") {
            error.ticketPriceError = "Please input valid ticket price";
        }
        if (values.numTicketsAvailable==="" || values.numTicketsAvailable==="0" || values.numTicketsAvailable==="-0") {
            error.numTicketsAvailableError = "Please input valid number of tickets available";
        }
        if (values.numTotalTickets==="" || values.numTotalTickets==="0" || values.numTotalTickets==="-0") {
            error.numTotalTicketsError = "Please input valid number of tickets available";
        }
        if (values.eventDetails==="") {
            error.eventDetailsError = "Event venue should not be empty";
        }

        setErrors(error);

        // If no error, proceed to send to backend
        if (Object.keys(error).length === 0) {
          // Send data to backend
          if (action == "Create") {
            createEvent();
            window.location.reload();
          } else {
            updateEvent();
        }
        }
    };

    async function createEvent() {
        try {
            const response = await axios.post('http://localhost:4567/create_event', values);
            console.log(values);
            console.log('Response from server:', response.data); // Log the response data
            setServerResponse(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function updateEvent() {
        try {
            const response = await axios.put('http://localhost:4567/update_event', values);
            console.log(values);
            console.log('Response from server:', response.data); // Log the response data
            setServerResponse(response.data);
            if (response.data=="Event updated successfully!") {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    return (
        <div>
            <Modal show={show} animation={false} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><h4>{action} Event</h4>{serverResponse!=""?<p className={(serverResponse!="Event updated successfully!" && serverResponse!="Event created successfully." )? "text-danger" : "text-success"}>{serverResponse}</p>:<p></p>}</Modal.Title>
                </Modal.Header>
                {action!="View" ? (
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div class="form-group">
                            <label htmlFor="eventType">Event Type</label>
                            <select class="form-control" id="eventType" name="eventType" value={values.eventType} onChange={handleInput}>
                                <option value="" selected disabled>Please select event type</option>
                                <option value="Concert">Concert</option>
                                <option value="Musical">Musical</option>
                                <option value="Seminar">Seminar</option>
                            </select>
                            {errors.eventTypeError && (
                            <span className="text-danger">{errors.eventTypeError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventName">Event Name</label>
                            <input
                                id="eventName"
                                className="form-control"
                                name="eventName"
                                value={values.eventName}
                                placeholder={"Enter event name"}
                                onChange={handleInput}
                            ></input>
                            {errors.eventNameError && (
                            <span className="text-danger">{errors.eventNameError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="venue">Event Venue</label>
                            <input
                                id="venue"
                                className="form-control"
                                name="venue"
                                value={values.venue}
                                placeholder={"Enter event venue"}
                                onChange={handleInput}
                            ></input>
                            {errors.venueError && (
                            <span className="text-danger">{errors.venueError}</span>
                            )}
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                                <DateTimePicker
                                slotProps={{
                                    textField: {
                                        size: "large",
                                        error: false,
                                    },
                                }}
                                label="Enter event date and time"
                                value={dayjs(values.eventDateTime)}
                                onChange={(date) => {
                                    //prepare date for backend
                                    const year = date.$d.getFullYear();
                                    const month = String(date.$d.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.$d.getDate()).padStart(2, '0');
                                    const hours = String(date.$d.getHours()).padStart(2, '0');
                                    const minutes = String(date.$d.getMinutes()).padStart(2, '0');
                                    const seconds = String(date.$d.getSeconds()).padStart(2, '0');
                                    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                                    
                                    setValues((prev) => ({
                                        ...prev,
                                        eventDateTime: dateTimeString // Remove square brackets around event.target.value
                                    }));
                                    setDateTime(date.$d);
                                }}
                                />                 
                            </DemoContainer>
                            {errors.eventDateTimeError && (
                            <span className="text-danger">{errors.eventDateTimeError}</span>
                            )}
                        </LocalizationProvider>
                        <div className="form-group mt-3">
                            <label htmlFor="eventDetails">Event Details</label>
                            <textarea                              
                                id="eventDetails"
                                className="form-control"
                                name="eventDetails"
                                value={values.eventDetails}
                                placeholder={"Enter event details"}
                                onChange={handleInput} 
                                rows="4" 
                                cols="50">
                            </textarea>
                            {errors.eventDetailsError && (
                            <span className="text-danger">{errors.eventDetailsError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="numTotalTickets">Total No. of tickets</label>
                            <input
                                id="numTotalTickets"
                                className="form-control"
                                type="number"
                                min="0"
                                name="numTotalTickets"
                                value={values.numTotalTickets}
                                placeholder={"Enter total number of tickets"}
                                onChange={handleInput}
                            ></input>
                            {errors.numTotalTicketsError && (
                            <span className="text-danger">{errors.numTotalTicketsError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="numTicketsAvailable">No. of tickets available</label>
                            <input
                                id="numTicketsAvailable"
                                className="form-control"
                                type="number"
                                min="0"
                                name="numTicketsAvailable"
                                value={values.numTicketsAvailable}
                                placeholder={"Enter number of tickets available"}
                                onChange={handleInput}
                            ></input>
                            {errors.numTicketsAvailableError && (
                            <span className="text-danger">{errors.numTicketsAvailableError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="ticketPrice">Event Ticket Price</label>
                            <input
                                id="ticketPrice"
                                className="form-control"
                                type="number"
                                min="0"
                                name="ticketPrice"
                                value={values.ticketPrice}
                                placeholder={"Enter event ticket price"}
                                onChange={handleInput}
                            ></input>
                            {errors.ticketPriceError && (
                            <span className="text-danger">{errors.ticketPriceError}</span>
                            )}
                        </div>
                        
                        <div className="d-flex justify-content-end">
                            {action=="Create"? (
                                <button type="submit" className="btn btn-primary">
                                    Create Event
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary">
                                    Update Event
                                </button>
                            )}

                        </div>
                    </form>
                </Modal.Body>
                ) : (
                <Modal.Body>
                    <p><b>Event ID:</b> <span>{values.eventID}</span></p>
                    <p><b>Event Type:</b> <span>{values.eventType}</span></p>
                    <p><b>Event Name:</b> <span>{values.eventName}</span></p>
                    <p><b>Event Venue:</b> <span>{values.venue}</span></p>
                    <p><b>Event Date & Time:</b> <span>{processDateTime(values.eventDateTime)}</span></p>
                    <p><b>Total number of tickets:</b> <span>{values.numTotalTickets}</span></p>
                    <p><b>Event Details:</b> <span>{values.numTicketsAvailable}</span></p>
                    <p><b>Ticket Price:</b> <span>{values.ticketPrice}</span></p>
                </Modal.Body>
                )
                }
            </Modal>
        </div>
    );
}