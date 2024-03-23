import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import axios from 'axios'; // Import Axios for making HTTP requests

export const TicketingOfficerModal = ({show, action, handleClose, data}) => {

    const [values, setValues] = useState(data);
    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");
    const [disableConfirmPassword, setDisableConfirmPassword] = useState(false);
    console.log(values);
    //table data
    useEffect(() => {
        if (action=="Create") {
            setDisableConfirmPassword(false);
        } else {
            setDisableConfirmPassword(true);
        }
    }, [action]); // Empty dependency array to run only once when the component mounts

    const handleInput = (event) => {

        if (event.target.name=="password" && values.password != event.target.value) {
            setDisableConfirmPassword(false);
        }

        setValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value // Remove square brackets around event.target.value
        }));
    };

    //helper functions
    const containSpecialChars = (str) => {
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return specialChars.test(str);
    }
    const containUpperCase = (str) => {
        return /[A-Z]/.test(str);
    }
    const containNumber = (str) => {
        return /\d/.test(str);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let error = {}
    
        //check if name and address is empty
        if (values.name === "") {
            error.nameError = "Name should not be empty"
        }
        
        if (values.email === "") {
            //check if email is empty
            error.emailError = "Email should not be empty"
        }
        // check if email already exist in the database
    
        //check password
        if (values.password === "") {
          error.passwordError = "Password should not be empty"
        } else if (!containSpecialChars(values.password) || !containUpperCase(values.password) || !containNumber(values.password)) {
            // check if password contains at least a capital letter; a number; a special character
            error.passwordError = "Password should at least contain a capital letter, special character and a number."
        }
    
        // check if confirm password matches password
        if (disableConfirmPassword==false) {
            if (values.password !== values.confirmPassword) {
                error.confirmPasswordError = "Passwords do not match"
            }
        }
        
        setErrors(error);

        if (Object.keys(error).length === 0) {
            if (action == "Create") {
                //proceed to send to backend registration...
                registerTicketingOfficer();
            } else {
                updateTicketingOfficer();
            }
        };
    }

    async function registerTicketingOfficer() {
        try {
            const response = await axios.post("http://localhost:4567/add_ticketing_officer", values);
            console.log(values);
            console.log('Response from server:', response.data); // Log the response data
            setServerResponse(response.data);
            if (response.data=="Ticketing officer added successfully!") {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function updateTicketingOfficer() {
        try {
            const response = await axios.put('http://localhost:4567/update_ticketing_officer', values);
            console.log(values);
            console.log('Response from server:', response.data); // Log the response data
            setServerResponse(response.data);
            if (response.data=="Ticketing officer updated successfully!") {
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
                    <Modal.Title><h4>{action} Ticketing Officer</h4>{serverResponse!=""?<p className={(serverResponse!="Ticketing officer added successfully!" && serverResponse!="Ticketing officer updated successfully!" )? "text-danger" : "text-success"}>{serverResponse}</p>:<p></p>}</Modal.Title>
                </Modal.Header>
                {action!="View" ? (
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                className="form-control"
                                name="name"
                                value={values.name}
                                placeholder={"Enter ticketing officer's name"}
                                onChange={handleInput}
                            ></input>
                            {errors.nameError && (
                            <span className="text-danger">{errors.nameError}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="form-control"
                                name="email"
                                value={values.email}
                                placeholder={"Enter ticketing officer's email"}
                                onChange={handleInput}
                            ></input>
                            {errors.emailError && (
                            <span className="text-danger">{errors.emailError}</span>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="form-control"
                                name="password"
                                type="password"
                                value={values.password}
                                placeholder={"Enter password"}
                                onChange={handleInput}
                            ></input>
                            {errors.passwordError && (
                            <span className="text-danger">{errors.passwordError}</span>
                            )}
                        </div>
                        <div className="form-group ">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                disabled={disableConfirmPassword}
                                id="confirmPassword"
                                className= "form-control disabled"
                                name="confirmPassword"
                                type="password"
                                value={values.confirmPassword}
                                placeholder={"Confirm the password"}
                                onChange={handleInput}
                            ></input>
                            {errors.confirmPasswordError && (
                            <span className="text-danger">{errors.confirmPasswordError}</span>
                            )}
                        </div>

                        
                        <div className="d-flex justify-content-end">
                            {action=="Create"? (
                                <button type="submit" className="btn btn-primary">
                                    Create Ticketing Officer
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary">
                                    Update Ticketing Officer
                                </button>
                            )}
                        </div>
                    </form>
                </Modal.Body>
                ) : (
                <Modal.Body>
                    <p><b>User ID:</b> <span>{values.userID}</span></p>
                    <p><b>Ticketing Officer Name:</b> <span>{values.name}</span></p>
                    <p><b>Ticketing Officer Email:</b> <span>{values.email}</span></p>
                </Modal.Body>
                )
                }
            </Modal>
        </div>
    );
}