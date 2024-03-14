import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { EventListing } from "./eventListing";
import axios from 'axios'; // Import Axios for making HTTP requests

export const Event = ({ handleView }) => {

  const [values, setValues] = useState({
    dropdownFilter: '',
    searchBar: ''
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events when the component mounts
    async function fetchEvents() {
      try {
        const response = await axios.get('http://localhost:4567/get_all_bookable_events');
        console.log('Response from server:', response.data); // Log the response data
        setEvents(response.data); // Set the events state
        // console.log(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, []); // Empty dependency array to run only once when the component mounts


  const handleFilter = (event) => {
    event.preventDefault();
    setValues(prev => (
      {
        ...prev,
        searchBar: event.target.value
      }
    ));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-left h-100">
            <div className="searchbar">
              <input className="search_input" type="text" name="" placeholder="Search..." value={values.searchBar} onChange={handleFilter} />
              <a href="#" className="search_icon">🔍</a>
            </div>
          </div>
        </div>
        <div className="col-3 my-auto d-flex justify-content-end">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: "#353b48", height: "40px" }}>
              Filter view
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleView("All Events")}>All Events</Dropdown.Item>
              <Dropdown.Item onClick={() => handleView("Events in a month")}>Events in a month</Dropdown.Item>
              <Dropdown.Item onClick={() => handleView("Events in 3 months")}>Events in 3 months</Dropdown.Item>
              <Dropdown.Item onClick={() => handleView("Events in 6 months")}>Events in 6 months</Dropdown.Item>
              <Dropdown.Item onClick={() => handleView("Future events (available after 6 months)")}>Future events (available after 6 months)</Dropdown.Item>
              <Dropdown.Item onClick={() => handleView("Past events (happening in 24 hours)")}>Past events (happening in 24 hours)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="row mt-5">
      <div className="portfolio-items">
  {events.length > 0
    ? events.filter((el) => {
        if (values.searchBar.length > 0) {
          let searchInputValue = values.searchBar.toLowerCase();
          // Replace 'el.title' with the appropriate property name
          return el.eventName.toLowerCase().includes(searchInputValue);
        } else {
          return true; // Include all events if search bar is empty
        }
      }).map((d, i) => (
        <div
          key={`${d.eventName}-${i}`}
          className="col-xs-12 col-sm-6 col-md-4"
        >
          <EventListing data={d}></EventListing>
        </div>
      ))
    : "Loading..."}
</div>
      </div>
    </div>
  );
};
