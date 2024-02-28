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
            <div style={{minHeight:"100vh"}}>
                <Navigation />
                <PageTitle pageTitle={"Events"}  pageView={"All Events"} filterShow={"true"}/>
                <Services data={landingPageData.TopPicks} />
            </div>
            <Footer></Footer>
        </div>
    )
};