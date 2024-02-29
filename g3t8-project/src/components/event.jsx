import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { EventListing } from "./eventListing";

export const Event = ({data, handleView}) => {
  
  const [values, setValues] = useState({
    dropdownFilter: '',
    searchBar: ''
  })

  const handleFilter = (event) => {
    event.preventDefault();
    setValues(prev => (
      {
        ...prev,
        searchBar: event.target.value
      }
    ))
  }
  
  return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-left h-100">
              <div className="searchbar">
                <input className="search_input" type="text" name="" placeholder="Search..." value={values.searchBar} onChange={handleFilter}/>
                <a href="#" className="search_icon">🔍</a>
              </div>
            </div>
          </div>
          <div className="col-3 my-auto d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" style={{backgroundColor: "#353b48", height:"40px"}}>
                Filter view
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={()=> handleView("All Events")}>All Events</Dropdown.Item>
                <Dropdown.Item onClick={()=> handleView("Events in a month")}>Events in a month</Dropdown.Item>
                <Dropdown.Item onClick={()=> handleView("Events in 3 months")}>Events in 3 months</Dropdown.Item>
                <Dropdown.Item onClick={()=> handleView("Events in 6 months")}>Events in 6 months</Dropdown.Item>
                <Dropdown.Item onClick={()=> handleView("Future events (available after 6 months)")}>Future events (available after 6 months)</Dropdown.Item>
                <Dropdown.Item onClick={()=> handleView("Past events (happening in 24 hours)")}>Past events (happening in 24 hours)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="row mt-5">
          <div className="portfolio-items">
            {data
              ? data.filter((el) => {
                if (values.searchBar.length > 0) {
                  let searchInputValue = values.searchBar.toLowerCase();
                  return el.title.toLowerCase().match(searchInputValue);
                } else {
                  return el;
                }
              }).map((d, i) => (
                  <div
                    key={`${d.title}-${i}`}
                    className="col-xs-12 col-sm-6 col-md-4">
                    <EventListing id={i} title={d.title} date={d.date} image={d.image}></EventListing>
                  </div>
                ))
              : "Loading..."}
          </div>
        </div>
      </div>
    );
};