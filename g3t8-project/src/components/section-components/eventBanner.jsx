import { useState, useEffect } from 'react';
import { PurchaseTicketModal } from "./purchaseTicketModal";
import JsonData from "../../data/data.json";
import axios from 'axios'; // Import Axios for making HTTP requests



export const EventBanner = ( props ) => { 

    const [toShowModal, setToShowModal] = useState(false);
    const [purchasable, setPurchasable] = useState();

    const handleClose = () => {
        setToShowModal(false);
    }
    const handleOpen = () => {
        setToShowModal(true);
    }
    const handleBuyTickets = () => {
        // Update cart count or perform any other necessary actions
        console.log("Tickets bought!");
        // Reload the page
        window.location.reload(true);
      };
    useEffect(() => {
        // Fetch events when the component mounts
        fetchEventStatus();
    }, []); // Empty dependency array to run only once when the component mounts

    async function fetchEventStatus() {
        try {
            const response = await axios.get('http://localhost:4567/get_event_status_by_id/'+props.data.eventID);
            console.log('Response from server:', response.data); // Log the response data
            setPurchasable(response.data); // Set the events state
            // console.log(events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col text-center p-0">
                    <img src={JsonData.images[props.data.eventID]} className="w-100" alt="Loading..." />
                </div>
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
                        {/* + (props.data.view==="Bookable Events" ? "" : "hidden") */}
                        {purchasable? 
                        <div className={"col text-end my-auto" }>
                            <a className="btn btn-custom btn-lg page-scroll" onClick={handleOpen}>Buy Tickets</a>
                        </div>:<div></div>
                        }
                    </div>
                </div>
            </div>
            <PurchaseTicketModal show={toShowModal} handleBuyTickets={handleBuyTickets}  handleClose={handleClose} data={props.data}/>
        </div>
    )
}
