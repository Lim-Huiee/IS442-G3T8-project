import React, { useState } from "react";

export const Register = ({handleAction}) => {

  const [values, setValues] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  //helper functions
  const containSpecialChars = (str) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }
  const containUpperCase = (str) => {
    return /[A-Z]/.test(str);
  }
  const containNumber = (str) => {
    return /\d/.test(str);
  }

  const handleInput = (event) => {
    setValues(prev => (
      {
        ...prev,
        [event.target.name]: [event.target.value]
      }
    ))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let error = {}

    //check if name and address is empty
    if (values.name === "") {
        error.nameError = "Name should not be empty"
    }
    if (values.address === "") {
        error.addressError = "Address should not be empty"
    }
    
    if (values.email === "") {
        //check if email is empty
        error.emailError = "Email should not be empty"
    }
    // check if email already exist in the database

    //check password
    if (values.password === "") {
      error.passwordError = "Password should not be empty"
    } else if (!containSpecialChars(values.password) || !containUpperCase(values.password) || !containNumber(values.password)) {
        // check if password contains at least a capital letter; a number; a special character
        error.passwordError = "Password should at least contain a capital letter, special character and a number."
    }

    // check if confirm password matches password
    if (values.password[0] !== values.confirmPassword[0]) {
        error.confirmPasswordError = "Passwords do not match"
    }

    setErrors(error);

    if (Object.keys(error).length === 0) {
      //proceed to send to backend
    }
  }

  return (
    <div>
      <div className="container justify-content-center">
        <div className="row">
          <div className="col-md-6 text-center mx-auto">
            <div className="card mt-5">
              <div className="card-body">
                  <h5 className="card-title">Register</h5>
                  <p className="card-text">First time here? Please register an account to purchase your tickets!</p>
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                          className="form-control" 
                          name="name"
                          value={values.name} 
                          placeholder={"Enter your name"} 
                          onChange={handleInput}>
                        </input>
                        {errors.nameError && <span className="text-danger">{errors.nameError}</span>}
                    </div>
                    <br/>
                    <div className="input-group">
                        <input 
                          className="form-control" 
                          name="email"
                          value={values.email} 
                          placeholder={"Enter your email"} 
                          onChange={handleInput}>
                        </input>
                        {errors.emailError && <span className="text-danger">{errors.emailError}</span>}
                    </div>
                    <br/>
                    <div className="input-group">
                        <input 
                          className="form-control" 
                          name="address"
                          value={values.address} 
                          placeholder={"Enter your address"} 
                          onChange={handleInput}>
                        </input>
                        {errors.addressError && <span className="text-danger">{errors.addressError}</span>}
                    </div>
                    <br/>
                    <div className="inupt-group">
                        <input 
                        className="form-control" 
                        type="password"
                        name="password"
                        value={values.password} 
                        placeholder={"Enter your password"} 
                        onChange={handleInput}>
                        </input>
                        {errors.passwordError && <span className="text-danger">{errors.passwordError}</span>}
                    </div>
                    <br/>
                    <div className="input-group">
                        <input 
                        className="form-control" 
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword} 
                        placeholder={"Confirm your password"} 
                        onChange={handleInput}>
                        </input>
                        {errors.confirmPasswordError && <span className="text-danger">{errors.confirmPasswordError}</span>}
                    </div>

                    <br/>
                    <button type="submit" className="btn btn-primary">Register</button>
                  </form>
                  <p>Already have an account yet? <span onClick={() => handleAction("login")} style={{cursor:"default"}}><u>Login here</u></span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
