import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Services } from "../services";
import JsonData from "../../data/data.json";
import "./../../App.css";


export const EventsViewPage = () => {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <div>
            <Navigation />
            <Services data={landingPageData.Services} />
        </div>
    )
};