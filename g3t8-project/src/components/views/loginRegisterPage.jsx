import React, { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { Login } from "../login";
import { Register} from "../register";
import JsonData from "../../data/data.json";
import "./../../App.css";

export const LoginRegisterPage = (props) => {

  const [action, setAction] = useState("login");

  const handleAction = (action) => {
    setAction(action);
    console.log(action);
  }

  const renderComponent = () => {
    if (action === "login") {
      return <Login handleAction={handleAction}/>
    } else {
      return <Register handleAction={handleAction}/>
    }
  }

  return (
    <div style={{backgroundImage: "url(img/LoginRegisterBg.jpg)", height:"100%", backgroundRepeat: "no-repeat", backgroundSize:"cover", backgroundPosition: "center"}}>
      <Navigation/>
      <div style={{marginTop: "30px"}}>
        {renderComponent()}
      </div>
    </div>
  );
};