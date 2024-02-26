import React from "react";
import {Link} from "react-router-dom";

export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-sticky-top navbar-expand-md">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggler collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <Link to="/"> 
            <img src="img/ticketmistress-logo.jpg"></img>
          </Link>
          {" "}
        </div>

        <div class="container-fluid">
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li class="nav-item">
                <Link to="/eventsView"> All Events </Link>
                {/* <a href="#services" className="page-scroll">
                  Services
                </a> */}
              </li>
              <li class="nav-item">
              <Link to="/about"> About </Link>
                {/* <a href="#about" className="page-scroll">
                  About
                </a> */}
              </li>
              <li class="nav-item">
                <Link to="/faqs"> FAQs </Link>
                {/* <a href="#portfolio" className="page-scroll">
                  Gallery
                </a> */}
              </li>
              <li class="nav-item">
                <Link to="/contactPage"> Contact </Link>
                {/* <a href="#contact" className="page-scroll"> */}
                  {/* Contact */}
                {/* </a> */}
              </li>
              <li class="nav-item">
                <Link to="/loginRegisterPage"> Login/Register </Link>
                {/* <a href="#contact" className="page-scroll"> */}
                  {/* Contact */}
                {/* </a> */}
              </li>
            </ul>
          </div>
        </div>
    </nav>
  );
};
