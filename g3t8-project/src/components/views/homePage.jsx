import React, { useState, useEffect } from "react";
import { Navigation } from "./../navigation";
import { Header } from "./../header";
import { About } from "./../about";
import { Event } from "../event";
import { Testimonials } from "./../testimonials";
import { Team } from "./../Team";
import JsonData from "./../../data/data.json";
import "./../../App.css";

export const Home = () => {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <Navigation />
            </div>
            <div className="row">
                <div className="container-fluid">
                    <Header data={landingPageData.Header} />
                    <Event data={landingPageData.TopPicks} />
                    <About data={landingPageData.About} />
                    <Testimonials data={landingPageData.Testimonials} />
                    <Team data={landingPageData.Team} />
                </div>
            </div>
        </div>
    );
};
