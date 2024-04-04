import React, { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";

export const EMNavigation = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionRole = localStorage.getItem("role");
        if (sessionRole == null || sessionRole != "event manager") {
            navigate("/");
        }
    }, [])

    return (
        <nav id="menu" className="navbar navbar-default navbar-sticky-top navbar-expand-md my-0">
            <div className="navbar-header">
                <button
                    type="button"
                    className="navbar-toggler collapsed"
                    data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link to="/"> 
                    <img src="img/ticketmistress-logo.jpg"></img>
                </Link>
                {" "}
                </div>

                <div className="container-fluid">
                <div
                    className="collapse navbar-collapse"
                    id="bs-example-navbar-collapse-1"
                >
                    <ul className="nav navbar-nav navbar-right">
                        <li className="nav-item">
                            <Link to="/salesStatisticsPageEM"> Sales Statistics </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/eventManagementPageEM"> Event Management </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/manageTicketingOfficerPageEM"> Manage Ticket Officers </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded=" true">
                                Your profile
                            </a>
                            <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                                {/* <a class="dropdown-item" href="#">Manage profile</a>
                                <div class="dropdown-divider"></div> */}
                                <a className="dropdown-item" href="#">Sign out</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
