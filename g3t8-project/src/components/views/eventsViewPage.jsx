import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Services } from "../services";
import { PageTitle } from "../section-components/pageTitle";
import { Footer } from "../footer";
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
            <PageTitle pageTitle={"All Events"} />
            <Services data={landingPageData.Services} />
            <Footer></Footer>
        </div>
    )
};