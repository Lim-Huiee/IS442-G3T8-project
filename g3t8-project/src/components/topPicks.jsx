import { EventListing } from "./eventListing";
import React from "react";

export const TopPicks = (props) => {
  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top picks</h2>
          <p>
            <b>
              Experience diverse, top-tier events for unforgettable moments
            </b>
          </p>
        </div>
        <div className="row">
          <div className="portfolio-items">
            {props.data
              ? props.data.map((d, i) => (
                  <div
                    key={`${d.title}-${i}`}
                    className="col-xs-12 col-sm-6 col-md-4">
                    <EventListing data={d}></EventListing>
                  </div>
                ))
              : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};
