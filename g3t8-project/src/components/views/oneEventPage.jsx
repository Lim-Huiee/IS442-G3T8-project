import React, { useState, useEffect } from "react";
import { useLocation} from 'react-router-dom';
import { Navigation } from "../navigation";
import { EventBanner } from "../section-components/eventBanner";
import { InfoBlock } from "../section-components/infoBlock";
import { Footer } from "../footer";
import JsonData from "../../data/data.json";
import "./../../App.css";

export const OneEventPage = () => {

  const location = useLocation()
  const data = location.state;
  
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
      setLandingPageData(JsonData);
  }, []);

  return (
    <div>
        <Navigation/>
        <EventBanner data={data}/>        
        <InfoBlock bgColor={"#FFFFFF"} sectionTitle="Ticket policy" listedRules={landingPageData.TicketPolicy} />
        <InfoBlock bgColor={"#f6f6f6"} sectionTitle="Admission Policy" listedRules={landingPageData.AdmissionPolicy} />
        <InfoBlock bgColor={"#FFFFFF"} sectionTitle="Cancellation & Refund" listedRules={landingPageData.CancellationPolicy} />
        <Footer/>
    </div>
  );
};