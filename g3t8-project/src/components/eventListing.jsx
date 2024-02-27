import React from "react";

export const EventListing = ({ id, title, image, date }) => {
  return (
    <div className="portfolio-item" style={{boxShadow: "4px 4px 6px #808080"}}>
      <div className="hover-bg">
        <a href={""} title={title} data-lightbox-gallery="gallery1">
          <div className="hover-text">
            <h4><b>{title}</b></h4>
            <p>{date}</p>
          </div>
          <img src={image} className="img-responsive" alt={title} />
        </a>
      </div>
    </div>
  );
};
