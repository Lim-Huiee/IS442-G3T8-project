import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { PageTitle } from "../section-components/pageTitle";
import { Footer } from "../footer";
import JsonData from "../../data/data.json";
import "./../../App.css";
import { Faq } from "../faq";

export const FaqPage = () => {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <div >
            <Navigation />

            <div style={{ minHeight: "100vh", overflow: "auto" }}>
                <PageTitle pageTitle={"FAQ"} />
                <Faq data={landingPageData.Faq}/>

                <div >
                    <h3 className="text-center pt-5">FOR MORE ENQUIRIES</h3>
                    <button className="btn btn-custom btn-lg align-center" style={{ display: "block", margin: "20px auto 20px auto" }} onClick={() => window.location.href = "/contactPage"}>Click Here</button>
                </div>
            </div>
            <Footer />
        </div>
    )
};