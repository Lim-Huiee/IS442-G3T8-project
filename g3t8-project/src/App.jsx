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
import {LoginRegisterPage} from "./components/views/loginRegisterPage";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {

  return (
    <div>
      <Router>
          <Routes>
            <Route exact path="/" element={ <Home />} />
            <Route path="/eventsView" element={ <EventsViewPage />} />
            <Route path="/contactPage" element={ <ContactPage />} />
            <Route path="/loginRegisterPage" element={ <LoginRegisterPage />} />
          </Routes>
      </Router>
    </div>
  );
};

export default App;
