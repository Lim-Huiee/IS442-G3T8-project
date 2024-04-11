import React, { useState, useEffect } from "react";

export const InfoBlock = ({sectionTitle, listedRules, bgColor}) => {

  return (
    <div id="portfolio" className="text-center" style={{backgroundColor:bgColor}}>
      <div className="container">
        <div className="section-title">
          <h2>{sectionTitle}</h2>
        </div>
        <div className="row">
          <div className="col text-left">
            <ol>
                {listedRules
                ? listedRules.map((d, i) => (
                    <li key={i}>{d}</li>
                    ))
                : "Loading..."}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};