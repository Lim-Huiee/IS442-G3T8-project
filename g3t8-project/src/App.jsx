import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { Home } from "./components/views/homePage";
import { EventsViewPage } from "./components/views/eventsViewPage";
import { ContactPage } from "./components/views/contactPage";
import { LoginRegisterPage } from "./components/views/loginRegisterPage";
import { FaqPage } from "./components/views/faqPage";
import { OneEventPage } from "./components/views/oneEventPage";

import { StaffLoginPage } from "./components/views/staffLoginPage";
import { SalesStatisticsPageEM } from "./components/views/salesStatisticsPageEM";


export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {

  return (
    <div>
      <Router>
          <Routes>
            {/* customer views */}
            <Route exact path="/" element={ <Home />} />
            <Route path="/eventsView" element={ <EventsViewPage />} />
            <Route path="/contactPage" element={ <ContactPage />} />
            <Route path="/loginRegisterPage" element={ <LoginRegisterPage />} />
            <Route path="/faqPage" element={ <FaqPage />} />
            <Route path="/oneEventPage" element={ <OneEventPage />} />

            {/* event manager views*/}
            <Route path="/staff" element={ <StaffLoginPage/> } />
            <Route path="/salesStatisticsPageEM" element={ <SalesStatisticsPageEM />} />

          </Routes>
      </Router>
    </div>
  );
};

export default App;
