//import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { PageTitle } from "../section-components/pageTitle";
import { Footer } from "../footer";
//import JsonData from "../../data/data.json";
import "./../../App.css";
import Accordion from "../section-components/accordion"; 

export const FaqPage = () => {
    const data=[
        {
            category: "Ticketing & Delivery",
            items: [
                {
                    qn: "Am I able to choose specific seats when purchasing online?",
                    ans: "To ensure fans are able to navigate our online purchase process as quickly and efficiently as possible, our system automatically assign the 'Best available' option to each fan for the price category they have selected unless the Event Organizers have specifically allowed fans to select their own seats through a 'Pick Your Own (PYO) seat' function."
                  },
                  {
                    qn: "What ticket delivery options do TicketMistress offer? How much are the charges?",
                    ans: "TicketMistress offers several different delivery options so that you can receive your tickets in a way that is most convenient for you. Please note that available delivery options vary between events, and some delivery options may not be available for certain events. ",
                  }
            ]
        },
        {
            category: "Payments & Refunds",
            items: [
                {
                    qn:"What happens if an event is cancelled or postponed?",
                    ans:"If an event is cancelled, you will be contacted by the Event Organizer to arrange a refund. If the event is postponed, your tickets will be valid for the rescheduled date. If you are unable to attend the rescheduled date, you will be contacted by the Event Organizer to arrange a refund."
                },
                {
                    qn:"I cannot attend the event. Can I get a refund?",
                    ans:"Unfortunately, we are unable to offer refunds or exchanges unless the event has been cancelled or postponed. Please refer to our Terms and Conditions for more information."
                },
                {
                    qn:"How can I contact TicketMistress?",
                    ans:"You can contact us via our Contact Us page or email us at weSellTickets@ticketmistress.com."
                }
            ]
        }
    ];
    
    
    /*const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);*/

    return (
        <div >
            <Navigation />
            
            <div style={{ minHeight: "100vh", overflow: "auto" }}>
                <PageTitle pageTitle={"FAQ"} />
                {data.map(({ category, items }) => (
                    <div key={category}>
                        <h3 className="text-center">{category}</h3>
                        <div className="accordion">
                            {items.map(({ qn, ans }) => (
                                <Accordion qn={qn} ans={ans} />
                            ))}
                        </div>
                    </div>
                ))}
                <div>
                    <h3 className="text-center">FOR MORE ENQUIRIES</h3>
                    <button className="btn btn-custom btn-lg align-center" style={{ display: "block", margin: "20px auto 20px auto" }} onClick={() => window.location.href = "/contactPage"}>Click Here</button>
                </div>
            </div>
            <Footer />
        </div>
    )
};