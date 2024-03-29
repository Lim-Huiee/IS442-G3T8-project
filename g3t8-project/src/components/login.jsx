import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

export const Login = ({ handleAction, userRole }) => {
  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value // Remove square brackets around event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let error = {};

    // Check email
    if (values.email === "") {
      error.emailError = "Email should not be empty";
    }

    // Check password
    if (values.password === "") {
      error.passwordError = "Password should not be empty";
    }

    setErrors(error);

    // If no error, proceed to send to backend
    if (Object.keys(error).length === 0) {
      // Send login data to backend
      axios
        .post("http://localhost:4567/login", values) // Modify URL to match your backend endpoint
        .then((response) => {
          console.log("Login successful");
          // Store the login token or user information in local storage
          console.log(response.data);
          const userid = response.data.userId; 
          const email = response.data.email;
          const name = response.data.name;
          localStorage.setItem("userId", userid); 
          localStorage.setItem("name", name); 
          localStorage.setItem("email", email); 
          // Redirect to the home page or any other page
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Login failed", error); // Handle login failure
        });
    }
  };

  return (
    <div>
      <div className="container justify-content-center">
        <div className="row">
          <div className="col-md-6 text-center mx-auto">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title">Login</h5>
                <p className="card-text">
                  Welcome back! {userRole=="customer"? <span>Log in to purchase your tickets!</span> : <span></span> }
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      name="email"
                      value={values.email}
                      placeholder={"Enter your email"}
                      onChange={handleInput}
                    ></input>
                    {errors.emailError && (
                      <span className="text-danger">{errors.emailError}</span>
                    )}
                  </div>
                  <br />
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      value={values.password}
                      placeholder={"Enter your password"}
                      onChange={handleInput}
                    ></input>
                    {errors.passwordError && (
                      <span className="text-danger">
                        {errors.passwordError}
                      </span>
                    )}
                  </div>
                  <br />
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
                {userRole==="customer"?
                   <p>
                    Don't have an account yet?{" "}
                      <span
                        onClick={() => handleAction("register")}
                        style={{ cursor: "default" }}>
                      <u>Register here</u>
                      </span>
                  </p> 
                 : <p></p> }
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
