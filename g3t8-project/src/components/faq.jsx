import React from "react";
import Accordion from "./section-components/accordion";

export const Faq = (props) => {
  return (
    <div>
      {props.data ? (
        props.data.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-center pt-5">{category}</h2>
            <div className="accordion">
              {items.map(({ qn, ans }, index) => (
                <Accordion key={index} qn={qn} ans={ans} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};
