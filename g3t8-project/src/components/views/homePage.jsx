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
                    <Header data={landingPageData.Header} />
                    <TopPicks data={landingPageData.TopPicks} />
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
