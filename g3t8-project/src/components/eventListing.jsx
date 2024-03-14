import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { OneEventPage } from "./views/oneEventPage";

export const EventListing = (props) => {
  const navigate = useNavigate();

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
        <a href="" title={props.data.title} data-lightbox-gallery="gallery1">
          <div className="hover-text">
            <h4>
              <b>{props.data.title}</b>
            </h4>
            {props.data.shows &&
              props.data.shows.map((d, i) => {
                if (i < props.data.shows.length - 1) {
                  return <span key={i}>{d.date},</span>;
                } else {
                  return <span key={i}>{d.date}</span>;
                }
              })}
          </div>
          <img
            src={props.data.image}
            className="img-responsive"
            alt={props.data.title}
          />
        </a>
      </div>
    </div>
  );
};
