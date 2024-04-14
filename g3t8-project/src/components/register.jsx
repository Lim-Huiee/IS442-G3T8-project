import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

export const Register = ({ handleAction }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Helper functions
  const containSpecialChars = (str) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  };
  const containUpperCase = (str) => {
    return /[A-Z]/.test(str);
  };
  const containNumber = (str) => {
    return /\d/.test(str);
  };

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let error = {};

    // Check if name and address is empty
    if (values.name === "") {
      error.nameError = "Name should not be empty";
    }

    if (values.email === "") {
      // Check if email is empty
      error.emailError = "Email should not be empty";
    }
    // Check password
    if (values.password === "") {
      error.passwordError = "Password should not be empty";
    } else if (
      !containSpecialChars(values.password) ||
      !containUpperCase(values.password) ||
      !containNumber(values.password)
    ) {
      // Check if password contains at least a capital letter, a number, and a special character
      error.passwordError =
        "Password should at least contain a capital letter, special character, and a number.";
    }

    // Check if confirm password matches password
    if (values.password !== values.confirmPassword) {
      error.confirmPasswordError = "Passwords do not match";
    }

    setErrors(error);

    if (Object.keys(error).length === 0) {
      // Proceed to send to backend
      axios
        .post("http://localhost:4567/register", values) // Modify URL to match your backend endpoint
        .then((response) => {
          if (response.data=="Registered successfully!"){
            setShowSuccessPopup(true);
          }
          
        })
        .catch((error) => {
          console.error("Registration failed", error); // Handle registration failure
        });
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div>
      <div className="container justify-content-center">
        <div className="row">
          <div className="col-md-6 text-center mx-auto">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title">Register</h5>
                <p className="card-text">
                  First time here? Please register an account to purchase your
                  tickets!
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      name="name"
                      value={values.name}
                      placeholder={"Enter your name"}
                      onChange={handleInput}
                    />
                    {errors.nameError && (
                      <span className="text-danger">{errors.nameError}</span>
                    )}
                  </div>
                  <br />
                  <div className="input-group">
                    <input
                      className="form-control"
                      name="email"
                      value={values.email}
                      placeholder={"Enter your email"}
                      onChange={handleInput}
                    />
                    {errors.emailError && (
                      <span className="text-danger">
                        {errors.emailError}
                      </span>
                    )}
                  </div>
                  <br />
                  <div className="inupt-group">
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      value={values.password}
                      placeholder={"Enter your password"}
                      onChange={handleInput}
                    />
                    {errors.passwordError && (
                      <span className="text-danger">
                        {errors.passwordError}
                      </span>
                    )}
                  </div>
                  <br />
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      placeholder={"Confirm your password"}
                      onChange={handleInput}
                    />
                    {errors.confirmPasswordError && (
                      <span className="text-danger">
                        {errors.confirmPasswordError}
                      </span>
                    )}
                  </div>

                  <br />
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </form>
                <p>
                  Already have an account yet?{" "}
                  <span
                    onClick={() => handleAction("login")}
                    style={{ cursor: "pointer" }}
                  >
                    <u>Login here</u>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Pop-up */}
      {showSuccessPopup && (
        <div className="success-popup">
          <p>Registration Successful!</p>
          <button className="close-btn" onClick={closeSuccessPopup}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};
