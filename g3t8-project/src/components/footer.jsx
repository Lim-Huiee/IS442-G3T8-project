import React from "react";
import {Link} from "react-router-dom";

export const Footer = (props) => {
  return (
    <div className="container-fluid" id="footer">
        <div className="row">
            <ul className="nav justify-content-center border-bottom pb-3 mb-3 pt-4">
                <li className="nav-item">
                    <Link to="/eventsView"> All Events</Link>
                </li>
                <li className="nav-item">
                    <Link to="/about"> About </Link>
                </li>
                <li className="nav-item">
                    <Link to="/faqs"> FAQs </Link>
                </li>
                <li className="nav-item">
                    <Link to="/contactPage"> Contact </Link>
                </li>
            </ul>
        </div>
        <div className="row text-center pb-4">
            <p>© 2024 TicketMistress</p>
        </div>
    </div>
  );
};
