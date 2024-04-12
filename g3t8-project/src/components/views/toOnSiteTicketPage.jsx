import React, { useState } from "react";

import { TONavigation } from "../toNavigation";
import { PageTitle } from "../section-components/pageTitle";
import axios from 'axios'; // Import Axios for making HTTP requests
import Alert from '../section-components/alert';
import "./../../App.css";

export const TOOnSiteTicketPage = () => {
    // role checked in navigation
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailAlert1, setShowFailAlert1] = useState(false);
    const [showFailAlert2, setShowFailAlert2] = useState(false);
    const [orderID, setOrderID] = useState();

    const handleSubmit = async (event) => {
        setShowSuccessAlert(false);
        setShowFailAlert1(false);
        event.preventDefault();
        console.log(event.target.eventID.value, event.target.numTix.value);

        if (event.target.numTix.value > 5) {
            setShowFailAlert2(true);
        }
        else {
            try {
                const response = await axios.post('http://localhost:4567/onsite_tickets/' + event.target.eventID.value + "/" + event.target.numTix.value, {
                    "toID": localStorage.getItem("userId")
                });
                console.log('Response from server:', response.data); // Log the response data
    
                if (response.data > 0) {
                    console.log('success');
                    setOrderID("Order ID: " + response.data);
                    setShowSuccessAlert(true);
                }
                else {
                    setShowFailAlert1(true);
                }
                
            } catch (error) {
                console.error('Error processing on-site tickets:', error);
                setShowFailAlert1(true);
            }
        }
    }
        
        return (
            <div>
            <TONavigation/>

            <PageTitle pageTitle={"On-Site Ticket Sales"} pageView="" filterShow={"false"} />
            
            <div className="container mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col"></div>
                        <div className="col">
                            <div className="col mt-3">
                                <label htmlFor="eventID" className="form-label">* Event ID</label>
                                <input type="number" className="form-control" id="eventID" name="eventID"></input>
                            </div>
                            <div className="col mt-3">
                                <label htmlFor="numTix" className="form-label">* Number of Tickets</label>
                                <input type="number" className="form-control" id="numTix" name="numTix"></input>
                            </div>
                        </div>
                        <div className="col"></div>
                    </div>
                    <div className="row my-5">
                        <button type="submit" className="btn btn-primary w-25 mx-auto">Submit</button>
                    </div>
                </form>
                <div className="row justify-content-end">
                    <div className="col-4">
                        {showSuccessAlert && <Alert variant="success" header="On-site tickets processed successfully!" body={orderID} />}
                        {showFailAlert1 && <Alert variant="danger" header="On-site tickets failed to process." body="Please try again later, or contact us if you have any issues."/>}
                        {showFailAlert2 && <Alert variant="danger" header="Maximum 5 tickets per order" body="Please try again with max. 5 tickets."/>}
                    </div>
                </div>
            </div>
        </div>
    )
};