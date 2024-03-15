import React, { useState, useEffect } from "react";
import { Navigation } from "./../navigation";
import { Header } from "./../header";
import { About } from "./../about";
import { TopPicks } from "../topPicks";
import { Testimonials } from "./../testimonials";
import { Team } from "./../Team";
import { Footer } from "../footer";
import JsonData from "./../../data/data.json";
import "./../../App.css";
import axios from 'axios'; // Import Axios for making HTTP requests

export const Home = () => {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    const [events, setEvents] = useState([]); //Top Picks will only show bookable events
    useEffect(() => {
      // Fetch events when the component mounts
      async function fetchEvents() {
        try {
          const response = await axios.get('http://localhost:4567/get_all_bookable_events');
          console.log('Response from server:', response.data); // Log the response data
          setEvents(response.data); // Set the events state
          // console.log(events);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
      fetchEvents();
    }, []); // Empty dependency array to run only once when the component mounts
  

    return (
        <div className="container-fluid">
            <div className="row">
                <Navigation />
            </div>
            <div className="row">
                    <Header data={landingPageData.Header} />
                    <TopPicks data={events} />
                    <Testimonials data={landingPageData.Testimonials}/>
                    <About data={landingPageData.About} />
                    <Team data={landingPageData.Team} />
            </div>
            <div className="row">
                <Footer></Footer>
            </div>
        </div>
    );
};
