import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { OneEventPage } from "./views/oneEventPage";
import JsonData from "./../data/data.json";

export const EventListing = ( props ) => {
  const navigate = useNavigate();
  console.log(props);
  const handleClick = () => {
    navigate("/oneEventPage", { state: props.data });
  };

  return (
      <div
      onClick={handleClick}
      className="portfolio-item"
      style={{ boxShadow: "4px 4px 6px #808080" }}
    >
      <div className="hover-bg">
        <a href="" title={props.data.eventName} data-lightbox-gallery="gallery1">
          <div className="hover-text">
            <h4>
              <b>{props.data.eventName}</b>
            </h4>
            <span>{props.data.eventDateTime ? props.data.eventDateTime.replace("T", " ") : "Loading..."}</span><br/>
            <span>{props.data.venue}</span>
            {/* {props.data.shows &&
              props.data.shows.map((d, i) => {
                if (i < props.data.shows.length - 1) {
                  return <span key={i}>{d.date},</span>;
                } else {
                  return <span key={i}>{d.date}</span>;
                }
              })} */}
          </div>
          {/* need to find a way to store images */}
          <img
            src={JsonData.images[props.data.eventID]}
            className="img-responsive"
            alt={props.data.eventName}
          />
        </a>
      </div>
    </div>
  );
};
