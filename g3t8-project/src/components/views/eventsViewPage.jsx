import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Event } from "../event";
import { PageTitle } from "../section-components/pageTitle";
import { Footer } from "../footer";
import JsonData from "../../data/data.json";
import "./../../App.css";


export const EventsViewPage = () => {
    const [landingPageData, setLandingPageData] = useState({});
    
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    const [view, setView] = useState("All Events");

    const handleView = (view) => {
        setView(view);
    }
    //pass dropdown filter to parent and call backend, pass in data as per dropdown filtered data. 

    return (
        <div>
            <div style={{minHeight:"100vh"}}>
                <Navigation />
                <PageTitle pageTitle={"Events"}  pageView={view} filterShow={"true"}/>
                <Event data={landingPageData.TopPicks} handleView={handleView} />
            </div>
            <Footer></Footer>
        </div>
    )
};