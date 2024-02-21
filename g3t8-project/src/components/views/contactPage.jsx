import React, { useState, useEffect } from "react";
import { Navigation } from "./../navigation";
import { Contact } from "./../contact";
import JsonData from "./../../data/data.json";
import "./../../App.css";

export const ContactPage = () => {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <div>
            <Navigation />
            <Contact data={landingPageData.Contact} />
        </div>
    )
};