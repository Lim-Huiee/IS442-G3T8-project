import { useState } from 'react';

export const PageTitle = ({pageTitle, pageView, filterShow}) => { 
    return (
        <div id="services">
            <h2>{pageTitle}</h2>
            <h5 className={filterShow === "true" ? "" : "d-none"}>View: {pageView}</h5>
        </div>
    )
}
