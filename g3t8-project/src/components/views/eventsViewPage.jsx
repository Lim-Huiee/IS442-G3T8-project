import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Event } from "../event";
import { PageTitle } from "../section-components/pageTitle";
import { Footer } from "../footer";
import JsonData from "../../data/data.json";
import "./../../App.css";
import axios from 'axios'; // Import Axios for making HTTP requests

export const EventsViewPage = () => {

    const [view, setView] = useState("All Events");
    const [selectedEvents, setSelectedEvents] = useState({});

    const handleView = (view) => {
        setView(view);
        //need to call relevant API
        fetchEvents(JsonData.views[view]);
    }
    //pass dropdown filter to parent and call backend, pass in data as per dropdown filtered data. 

    useEffect(() => {
        // Fetch events when the component mounts
        fetchEvents("get_all_events");
    }, []); // Empty dependency array to run only once when the component mounts

    async function fetchEvents(view) {
        try {
            const response = await axios.get('http://localhost:4567/' + view);
            console.log('Response from server:', response.data); // Log the response data
            setSelectedEvents(response.data); // Set the events state
            // console.log(events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    return (
        <div>
            <div style={{minHeight:"100vh"}}>
                <Navigation />
                <PageTitle pageTitle={"Events"}  pageView={view} filterShow={"true"}/>
                <Event data={selectedEvents} handleView={handleView}/>
            </div>
            <Footer></Footer>
        </div>
    )
};