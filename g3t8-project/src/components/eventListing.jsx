import React from "react";
import { Link, Navigate, useNavigate  } from "react-router-dom";
import { OneEventPage } from "./views/oneEventPage";

export const EventListing = ({ id, title, image, date, venue }) => {

  const eventData = {
    title: title,
    image: image,
    date: date,
    venue: venue
  }

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/oneEventPage", {state:eventData})
  }

  return (
      <div onClick={handleClick} className="portfolio-item" style={{boxShadow: "4px 4px 6px #808080"}}>
        <div className="hover-bg">
          <a href={""} title={title} data-lightbox-gallery="gallery1">
            <div className="hover-text">
              <h4><b>{title}</b></h4>
              {date.map((d,i) => {
                if (i < date.length-1) {
                  return(<span key={i}>{d},</span>)
                } else {
                  return(<span key={i}>{d}</span>)
                }
              })}
            </div>
            <img src={image} className="img-responsive" alt={title} />
          </a>
        </div>
      </div>
  );
};
