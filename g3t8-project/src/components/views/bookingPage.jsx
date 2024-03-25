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
    // const [CheckoutData, setCheckoutData] = useState({});
    // useEffect(() => {
    //     setCheckoutData(JsonData);
    // }, []);
    return (
        <div className="container-fluid">
            <div className="row">
                <Navigation />
                <PageTitle pageTitle={"Cart"}  />
            </div>
            <div className="row">
                <Checkout/>
            </div>
            <div className="row">
                <Footer></Footer>
            </div>
        </div>
    );
};