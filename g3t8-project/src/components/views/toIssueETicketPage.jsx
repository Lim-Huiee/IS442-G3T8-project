import React, { useState } from "react";

import { TONavigation } from "../toNavigation";
import { PageTitle } from "../section-components/pageTitle";
import axios from 'axios'; // Import Axios for making HTTP requests
import Alert from '../section-components/alert';
import "./../../App.css";

export const TOIssueETicketPage = () => {
    // role checked in navigation
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailAlert, setShowFailAlert] = useState(false);

    const handleSubmit = async (event) => {
        setShowSuccessAlert(false);
        setShowFailAlert(false);
        event.preventDefault();
        console.log(event.target.orderID.value, event.target.custUserID.value);

        try {
            const response = await axios.post('http://localhost:4567/issue_eticket/' + event.target.orderID.value + "/" + event.target.custUserID.value, {
                "toID": localStorage.getItem("userId")
            });
            console.log('Response from server:', response.data); // Log the response data

            if (response.data == 200) {
                console.log('success');
                setShowSuccessAlert(true);
            }
            else {
                setShowFailAlert(true);
            }
            
        } catch (error) {
            console.error('Error fetching events:', error);
            setShowFailAlert(true);
        }
    }
        
        return (
            <div>
            <TONavigation/>

            <PageTitle pageTitle={"Issue E-Ticket"} pageView="" filterShow={"false"} />
            
            <div className="container mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col"></div>
                        <div className="col">
                            <div className="col mt-3">
                                <label htmlFor="custUserID" className="form-label">* Customer's User ID</label>
                                <input type="number" className="form-control" id="custUserID" name="custUserID"></input>
                            </div>
                            <div className="col mt-3">
                                <label htmlFor="orderID" className="form-label">* Order ID</label>
                                <input type="number" className="form-control" id="orderID" name="orderID"></input>
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
                        {showSuccessAlert && <Alert variant="success" header="E-tickets sent successfully!" body=""/>}
                        {showFailAlert && <Alert variant="danger" header="E-tickets failed to send." body="Please try again later, or contact us if you have any issues."/>}
                    </div>
                </div>
            </div>
        </div>
    )
};