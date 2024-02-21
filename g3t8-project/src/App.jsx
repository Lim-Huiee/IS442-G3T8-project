import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./components/views/homePage";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { ContactPage } from "./components/views/contactPage";

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
            <Route path="/contactPage" element={ <ContactPage />} />
          </Routes>
      </Router>
    </div>
  );
};

export default App;
