import React from "react";
import {Link} from "react-router-dom";
import { useState, useEffect} from "react";

export const Navigation = (props) => {  
  
  
  // const { userState,updateUserState } = useContext(MyContext); 
  const [isHovered, setIsHovered] = useState(false);
  const [numEventsInCart, setNumEventsInCart] = useState(0); // State to track the number of events in the cart

  const userId = localStorage.getItem("userId");
  const userEvents = JSON.parse(localStorage.getItem("events"))?.[userId] || [];

  useEffect(() => {
    setNumEventsInCart(userEvents.length);
  }, [userEvents]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUserEvents = JSON.parse(localStorage.getItem("events"))?.[userId] || [];
      setNumEventsInCart(updatedUserEvents.length);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(true); //reload when logging out
    window.location.href = "/";
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  return (
    <nav
      id="menu"
      className="navbar navbar-default navbar-sticky-top navbar-expand-md my-0"
    >
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
        </Link>{" "}
      </div>

      <div className="container-fluid">
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item">
              <Link to="/eventsView"> All Events </Link>
              {/* <a href="#services" className="page-scroll">
                  Services
                </a> */}
            </li>
            {/* <li class="nav-item">
              <Link to="/about"> About </Link>
                <a href="#about" className="page-scroll">
                  About
                </a>
              </li> */}
            <li className="nav-item">
              <Link to="/faqPage"> FAQs </Link>
              {/* <a href="#portfolio" className="page-scroll">
                  Gallery
                </a> */}
            </li>
            <li className="nav-item">
              <Link to="/contactPage"> Contact </Link>
              {/* <a href="#contact" className="page-scroll"> */}
              {/* Contact */}
              {/* </a> */}
            </li>
            {userId && ( // Render only if user is logged in
              <li className="nav-item">
                <Link to="/bookingPage">
                  <i className="fa fa-shopping-cart"></i> Cart({numEventsInCart})
                </Link>
              </li>
            )}
            {!userId && (
              <li className="nav-item">
                <Link to="/loginRegisterPage"> Login/Register </Link>
                {/* <a href="#contact" className="page-scroll"> */}
                {/* Contact */}
                {/* </a> */}
              </li>
            )}
            {!!userId && (
              <li
                className="nav-item dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded={isHovered ? "true" : "false"}
                  
                  
                >
                  <i className="fa fa-user-circle"></i> Profile
                </a>
                <div
                  className={`dropdown-menu ${isHovered ? "show" : ""}`}
                  aria-labelledby="navbarDropdown"
                >
                  <a className="dropdown-item" href="/myEvents">
                    My Upcoming Events
                  </a>
                  <a className="dropdown-item" href="/profile">
                    Profile
                  </a>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Logout
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
