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
import { BookingPage } from "./components/views/bookingPage";
import { MyEventsPage } from "./components/views/myEventsPage";
import { ProfilePage } from "./components/views/profilePage";

import { StaffLoginPage } from "./components/views/staffLoginPage";
import { SalesStatisticsPageEM } from "./components/views/salesStatisticsPageEM";
import { EventManagementPageEM } from "./components/views/eventManagementPageEM";
import { ManageTicketingOfficerPageEM } from "./components/views/manageTicketingOfficerPageEM";
import { TOAttendancePage } from "./components/views/toAttendancePage";

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
              <Route path="/bookingPage" element={ <BookingPage />} />
              <Route path="/myEvents" element={ <MyEventsPage />} />
              <Route path="/profile" element={ <ProfilePage />} />
  
            {/* event manager views*/}
            <Route path="/staff" element={ <StaffLoginPage/> } />
            <Route path="/salesStatisticsPageEM" element={ <SalesStatisticsPageEM />} />
            <Route path="/eventManagementPageEM" element={ <EventManagementPageEM/> }/>
            <Route path="/manageTicketingOfficerPageEM" element={ <ManageTicketingOfficerPageEM/> }/>

            {/* ticket officer views */}
            <Route path="/attendanceTO" element={ <TOAttendancePage/> }/>
            
          </Routes>
        </Router>
    </div>
  );
};

export default App;
