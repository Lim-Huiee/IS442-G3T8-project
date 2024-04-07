import React, { useState, useEffect } from "react";
import { Navigation } from "./../navigation";
import { Header } from "./../header";
import { Footer } from "../footer";
import { PageTitle } from "../section-components/pageTitle";
import { Checkout } from "./../checkout";
import JsonData from "./../../data/data.json";
import "./../../App.css";
import axios from 'axios'; // Import Axios for making HTTP requests


export const BookingPage = () => { 
    const [numEventsInCart, setNumEventsInCart] = useState(0);

    useEffect(() => {
        // Update cart count when component mounts
        updateCartCount();
    }, []);

    const updateCartCount = () => {
        const userId = localStorage.getItem("userId");
        const userEvents = JSON.parse(localStorage.getItem("events"))?.[userId] || [];
        setNumEventsInCart(userEvents.length);
    };

    const handleUpdateCart = () => {
        // Callback function to update cart count
        updateCartCount();
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <Navigation />
                <PageTitle pageTitle={"Cart"}  />
            </div>
            <div className="row">
                <Checkout handleUpdateCart={handleUpdateCart}/>
            </div>
            <div className="row">
                <Footer></Footer>
            </div>
        </div>
    );
};