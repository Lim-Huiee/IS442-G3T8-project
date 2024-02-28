import React, { useState, useEffect } from "react";
import { Navigation } from "./../navigation";
import { Contact } from "./../contact";
import { PageTitle } from "../section-components/pageTitle";
import { Footer } from "./../footer";
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
            <div style={{minHeight:"100vh"}}>
                <PageTitle pageTitle={"Get In Touch with Us"} />
                <Contact data={landingPageData.Contact} />
            </div>
            <Footer />
        </div>
    )
};