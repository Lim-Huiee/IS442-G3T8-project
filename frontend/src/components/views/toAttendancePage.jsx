import React, { useState } from "react";
import { TONavigation } from "../toNavigation";
import { PageTitle } from "../section-components/pageTitle";
import axios from 'axios';
import "./../../App.css";

export const TOAttendancePage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [numTix, setNumTix] = useState([]);
    const [ticketData, setTicketData] = useState({});

    const numTixChange = event => {
        event.preventDefault();
        setNumTix(Array(Number(event.target.value)).fill(0));
    };

    const handleTicketIDChange = (val, idx) => {
        let input = Number(val.target.value);
        if (input !== 0) {
            setTicketData({
                ...ticketData,
                [idx]: input
            })
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4567/take_attendance/' + event.target.eventID.value + "/" + event.target.custUserID.value, {
                "attendedTickets": Object.values(ticketData),
                "toID": localStorage.getItem("userId")
            });
            if (response.data=="Ticket verification failed, either ticket does not exist, database check failed, or userID provided does not match the user in Order"){
                setPopupMessage("Error taking attendance. Either ticket does not exist, database check failed, or userID provided does not match the user in Order");
                setShowPopup(true);
                console.error('Error taking attendance:');
            } 
            else {
                setPopupMessage("Attendance taken successfully.");
                setShowPopup(true);
            }
            // If attendance is taken successfully
            
            //console.log('Response from server:', response.data); // Log the response data
        } catch (error) {
            // If there's an error in taking attendance
            setPopupMessage("Error taking attendance. Please try again later.");
            //setShowPopup(true);
            console.error('Error taking attendance:', error);
        }
    }

    return (
        <div>
            <TONavigation/>
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
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

