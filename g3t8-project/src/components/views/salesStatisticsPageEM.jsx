import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import "./../../App.css";

export const SalesStatisticsPageEM = () => {

    //check userRole

    return (
        <div>
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
                        <Link to="/eventManagerSalesStatistics"> Sales Statistics </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/"> Event Management </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/"> Your profile </Link>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
        </div>
    )
};