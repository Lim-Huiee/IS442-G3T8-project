import { useState } from 'react';
import { PurchaseTicketModal } from "./purchaseTicketModal";

export const EventBanner = ({pageTitle, date, venue, image, price}) => { 

    const [toShowModal, setToShowModal] = useState(false);

    const handleClose = () => {
        setToShowModal(false);
    }
    const handleOpen = () => {
        setToShowModal(true);
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col text-center p-0">
                    <img src={image} className="w-100" alt="Loading..." />
                </div>
            </div>
            <div className="row py-3" style={{backgroundColor:"#C0C0C0"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-8 text-left">
                            <h2>{pageTitle}</h2>
                            <h4>Date: 
                                {date.map((d,i) => {
                                    if (i < date.length-1) {
                                    return(<span key={i}>{d},</span>)
                                    } else {
                                    return(<span key={i}>{d}</span>)
                                    }
                                })}
                            </h4>
                            <h4>Venue: {venue}</h4>
                            <h4>Ticket price: {price}</h4>
                        </div>
                        <div className="col text-end my-auto">
                            <a className="btn btn-custom btn-lg page-scroll" onClick={handleOpen}>Buy Tickets</a>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseTicketModal show={toShowModal} handleClose={handleClose}/>
        </div>
    )
}
