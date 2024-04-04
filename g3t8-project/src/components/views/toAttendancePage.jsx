import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { StaffNavigation } from "../staffNavigation";
import { PageTitle } from "../section-components/pageTitle";
import axios from 'axios'; // Import Axios for making HTTP requests
import "./../../App.css";

export const TOAttendancePage = () => {
    
    //check userRole
    
    const [numTix, setNumTix] = useState([]);

    const numTixChange = event => {
        event.preventDefault();
        setNumTix(Array(Number(event.target.value)).fill(0));
    };
    
    const [ticketData, setTicketData] = useState({});
    const handleTicketIDChange = (val, idx) => {
        let input = Number(val.target.value);
        // let idx = idx;
        if (input != 0) {
            setTicketData({
                ...ticketData,
                [idx]: input
            })
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(Object.values(ticketData));

        // try {
        //     const response = await axios.get('http://localhost:4567/test');
        //     console.log("Response from server test", response.data);
        // }
        // catch(error) {
        //     console.error("error testing", error);
        // }

        try {
            const response = await axios.post('http://localhost:4567/take_attendance/' + event.target.custUserID.value + "/" + event.target.eventID.value, {
                "attendedTickets": Object.values(ticketData),
                "toID": localStorage.getItem("userId")
            });
            console.log('Response from server:', response.data); // Log the response data
            
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }
        
        return (
            <div>
            <StaffNavigation/>

            <PageTitle pageTitle={"Ticket Attendance & Verification"} pageView="" filterShow={"false"} />
            
            <div className="container mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col">
                            <div className="col-6 mt-3">
                                <label htmlFor="custUserID" className="form-label">* Customer's User ID</label>
                                <input type="number" className="form-control" id="custUserID" name="custUserID"></input>
                            </div>
                            <div className="col-6 mt-3">
                                <label htmlFor="eventID" className="form-label">* Event ID</label>
                                <input type="number" className="form-control" id="eventID" name="eventID"></input>
                            </div>
                            <div className="col-6 mt-3">
                                <label htmlFor="numTickets" className="form-label">* Number of tickets to verify</label>
                                <input type="number" className="form-control" id="numTickets" name="numtix" onChange={numTixChange}></input>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                                {
                                    numTix.length > 0 ? numTix.map((_, idx) => (
                                        <div className="col-4 mt-3" key={idx}>
                                            <label htmlFor="ticketID" className="form-label">* Ticket ID {idx+1}</label>
                                            <input type="number" className="form-control" id="ticketID" name="ticketIDs" onChange={(val) => {handleTicketIDChange(val, idx)}}></input>
                                        </div>
                                    )) : ""
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row my-5">
                        <button type="submit" className="btn btn-primary w-25 mx-auto">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
};