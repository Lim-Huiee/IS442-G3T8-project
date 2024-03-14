import { useState } from 'react';
import { PurchaseTicketModal } from "./purchaseTicketModal";

export const EventBanner = ( props ) => { 

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
                {/* <div className="col text-center p-0">
                    <img src={props.data.image} className="w-100" alt="Loading..." />
                </div> */}
            </div>
            <div className="row py-3" style={{backgroundColor:"#C0C0C0"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-8 text-left">
                            <h2>{props.data.eventName}</h2>
                            <h4>Date: 
                                {/* {props.data.shows.map((d,i) => {
                                    if (i < props.data.shows.length-1) {
                                    return(<span key={i}>{d.date},</span>)
                                    } else {
                                    return(<span key={i}>{d.date}</span>)
                                    }
                                })} */}
                                <span> {props.data.eventDateTime ? props.data.eventDateTime.replace("T", " ") : "Loading..."}</span>
                            </h4>
                            <h4>Venue: 
                                {/* {props.data.shows.map((d,i) => {
                                    if (i < props.data.shows.length-1) {
                                    return(<span key={i}>{d.venue},</span>)
                                    } else {
                                    return(<span key={i}>{d.venue}</span>)
                                    }
                                })} */}
                                <span> {props.data.venue}</span>
                            </h4>
                            <h4>Ticket price: 
                                {/* {props.data.shows.map((d,i) => {
                                    if (i < props.data.shows.length-1) {
                                    return(<span key={i}>{d.price},</span>)
                                    } else {
                                    return(<span key={i}>{d.price}</span>)
                                    }
                                })} */}
                                <span> ${props.data.ticketPrice}</span>
                            </h4>
                        </div>
                        <div className="col text-end my-auto">
                            <a className="btn btn-custom btn-lg page-scroll" onClick={handleOpen}>Buy Tickets</a>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseTicketModal show={toShowModal} handleClose={handleClose} data={props.data}/>
        </div>
    )
}
