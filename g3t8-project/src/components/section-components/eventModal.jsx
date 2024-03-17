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

export const EventModal = ({show, action, handleClose}) => {

    const [values, setValues] = useState({
        eventType: "",
        eventName: "",
        eventVenue: "",
        eventDateTime: "",
        eventTicketPrice: "",
        numTicketAvail: ""
    });
    
    const [errors, setErrors] = useState({});

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
        if (values.eventVenue==="") {
            error.eventVenueError = "Event venue should not be empty";
        }
        if (values.eventDateTime==="") {
            error.eventDateTimeError = "Please pick a date and time";
        } else if (values.eventDateTime <= new Date().getTime()) {
            error.eventDateTimeError = "Please pick a future date and time";
        }
        if (values.eventTicketPrice==="" || values.eventTicketPrice==="0" || values.eventTicketPrice==="-0") {
            error.eventTicketPriceError = "Please input valid ticket price";
        }
        if (values.numTicketAvail==="" || values.numTicketAvail==="0" || values.eventTicketPrice==="-0") {
            error.numTicketAvailError = "Please input valid number of tickets available";
        }

        setErrors(error);
    
        // If no error, proceed to send to backend
        if (Object.keys(error).length === 0) {
          // Send data to backend
          console.log("OK");
        }
    };

    return (
        <div>
            {/* <Modal show={show} onHide={handleClose} animation={false}> */}
            <Modal show={show} animation={false} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{action} Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div class="form-group">
                            <label htmlFor="eventType">Event Type</label>
                            <select class="form-control" id="eventType" name="eventType" onChange={handleInput}>
                                <option value="" selected disabled>Please select event type</option>
                                <option value="Concert">Concert</option>
                                <option value="Musical">Musical</option>
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
                            <label htmlFor="eventVenue">Event Venue</label>
                            <input
                                id="eventVenue"
                                className="form-control"
                                name="eventVenue"
                                value={values.eventVenue}
                                placeholder={"Enter event venue"}
                                onChange={handleInput}
                            ></input>
                            {errors.eventVenueError && (
                            <span className="text-danger">{errors.eventVenueError}</span>
                            )}
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                                <DateTimePicker
                                label="Enter event date and time"
                                value={values.eventDateTime}
                                onChange={(date) => {
                                    setValues((prev) => ({
                                        ...prev,
                                        eventDateTime: date.$d // Remove square brackets around event.target.value
                                    }));
                                }}
                                />                 
                            </DemoContainer>
                            {errors.eventDateTimeError && (
                            <span className="text-danger">{errors.eventDateTimeError}</span>
                            )}
                        </LocalizationProvider>
                        <div className="form-group mt-3">
                            <label htmlFor="eventTicketPrice">Event Ticket Price</label>
                            <input
                                id="eventTicketPrice"
                                className="form-control"
                                type="number"
                                min="0"
                                name="eventTicketPrice"
                                value={values.eventTicketPrice}
                                placeholder={"Enter event ticket price"}
                                onChange={handleInput}
                            ></input>
                            {errors.eventTicketPriceError && (
                            <span className="text-danger">{errors.eventTicketPriceError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="numTicketAvail">No. of tickets available</label>
                            <input
                                id="numTicketAvail"
                                className="form-control"
                                type="number"
                                min="0"
                                name="numTicketAvail"
                                value={values.numTicketAvail}
                                placeholder={"Enter number of tickets available"}
                                onChange={handleInput}
                            ></input>
                            {errors.numTicketAvailError && (
                            <span className="text-danger">{errors.numTicketAvailError}</span>
                            )}
                        </div>
                        
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                Create Event
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}