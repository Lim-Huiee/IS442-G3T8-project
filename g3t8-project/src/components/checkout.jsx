import React, { useState ,useEffect} from "react";
import Button from "react-bootstrap/Button";
import JsonData from "../data/data.json";


const Checkout = (props) => {


  const [eventsInCart, setEventsInCart] = useState([]);
  const [userInfo, setUserInfo] = useState({
    userId: localStorage.getItem("userId") || "",
    email: localStorage.getItem("email") || "",
    name: localStorage.getItem("name") || "",
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("events")) || {};
    const userId = localStorage.getItem("userId");
    if (userId && storedData[userId]) {
      setEventsInCart(storedData[userId]);
    }
    
  }, []);
  

  
  const increaseQuantity = (eventId) => {
    const updatedEvents = eventsInCart.map(event => {
        if (event.eventID === eventId && event.numTickets < 5) {
            return { ...event, numTickets: event.numTickets + 1 };
        }
        return event;
    });
    console.log(localStorage)
    setEventsInCart(updatedEvents);
    updateEventsInLocalStorage(updatedEvents);
};

const decreaseQuantity = (eventId) => {
    const updatedEvents = eventsInCart.map(event => {
        if (event.eventID === eventId && event.numTickets > 1) {
            return { ...event, numTickets: event.numTickets - 1 };
        }
        return event;
    });
    setEventsInCart(updatedEvents);
    updateEventsInLocalStorage(updatedEvents);
};

const updateEventsInLocalStorage = (updatedEvents) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
        const storedData = JSON.parse(localStorage.getItem("events")) || {};
        storedData[userId] = updatedEvents;
        localStorage.setItem("events", JSON.stringify(storedData));
    }
};

  const calculateEventTotal = (event) => {
    return event.ticketPrice * event.numTickets;
  };

  const calculateTotalPrice = () => {
      return eventsInCart.reduce((total, event) => total + calculateEventTotal(event), 0);
  };

  return (
    <div id="portfolio" style={{ padding: "20px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1300px", margin: "auto", display: "flex" }}>
            <div id='cart'style={{ width: "100%"}}>
                <h2 style={{ paddingLeft: "15px", fontSize: "24px" }}>Events</h2>
                <div style={{ border: "1px solid #f9f9f9", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                    {eventsInCart.map((event) => (
                        <div id='eachEvent' key={event.eventName} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "10px", backgroundColor: "#f9f9f9", padding: "15px", marginBottom: "15px" }}>
                          <img src={JsonData.images[1]} alt="Event" style={{ width: "100%", maxWidth: "250px", height: "auto", alignSelf: "center" }} />
                          {/* image is still static for now */}
                            <div >
                                <h3 style={{ fontSize: "20px" }}>{event.eventName}</h3>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <p style={{ fontSize: "16px" }}><strong>Date:</strong> {event.eventDateTime.replace("T", " ")}</p>
                                        <p style={{ fontSize: "16px" }}><strong>Venue:</strong> {event.venue}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "16px" }}><strong>Price per Ticket:</strong> ${event.ticketPrice}</p>
                                        <p style={{ fontSize: "16px" }}><strong>Quantity:</strong> {event.numTickets}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Button variant="outline-primary" onClick={() => decreaseQuantity(event.id)} style={{ fontSize: "20px", padding: "5px 10px" }}>-</Button>
                                    <span style={{ margin: "0 10px", fontSize: "1.2rem", fontWeight: "bold" }}>{event.numTickets}</span>
                                    <Button variant="outline-primary" onClick={() => increaseQuantity(event.id)} style={{ fontSize: "20px", padding: "5px 10px" }}>+</Button>
                                </div>
                                <p style={{ fontSize: "16px" }}>Total Price: ${calculateEventTotal(event)}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <div id='profile'  style={{ width: "30%",height:"100%", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "5px" }}>
                <h2 style={{ fontSize: "24px" }}>Profile</h2>
                <div>
                    <p style={{ fontSize: "16px" }}>User ID:{userInfo.userId}</p>
                    <p style={{ fontSize: "16px" }}>Email: {userInfo.email}</p>
                    <p style={{ fontSize: "16px" }}>Name: {userInfo.name}</p>
                    {/* <p style={{ fontSize: "16px" }}>Amount Available: $ {}</p> */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <div style={{ fontWeight: "bold", color: "rgba(0,0,0,0.8)", fontSize: "18px" }}>Total Price: ${calculateTotalPrice()}</div>
                    <Button variant="outline-primary"  style={{ backgroundColor: " #608dfd", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "none", outline: "none", fontSize: "20px" }}>Checkout</Button>
                </div>
            </div>
        </div>
    </div>
);
};

export {Checkout };