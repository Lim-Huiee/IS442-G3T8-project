import React from "react";
import ControlledCarousel from "./section-components/carousel";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
            <div className="row">
              <div className="col-12">
                <ControlledCarousel data={props.data ? props.data : "Loading"}></ControlledCarousel>
              </div>
              {/* move this button somewhere else later */}
              {/* <div className="col-12 intro-text">
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  View events
                </a>{" "}
              </div> */}
            </div>
        </div>
    </header>
  );
};
