import React, { useState } from "react";

export const Login = ({handleAction}) => {

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})

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

    //check email
    if (values.email === "") {
      error.emailError = "Email should not be empty"
    }

    //check password
    if (values.password === "") {
      error.passwordError = "Password should not be empty"
    }

    setErrors(error);

    //if no error, proceed to send to backend
    if (Object.keys(error).length === 0) {
      //proceed to send to backend
      //expects a JWT token
      console.log("backend");
    }
  }

  return (
    <div>
      <div className="container justify-content-center">
        <div className="row">
          <div className="col-md-6 text-center mx-auto">
            <div className="card mt-5">
              <div className="card-body">
                  <h5 className="card-title">Login</h5>
                  <p className="card-text">Welcome back! Log in to purchase your tickets!</p>
                  <form onSubmit={handleSubmit}>
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
                          type="password"
                          name="password"
                          value={values.password} 
                          placeholder={"Enter your password"} 
                          onChange={handleInput}>
                        </input>
                        {errors.passwordError && <span className="text-danger">{errors.passwordError}</span>}
                    </div> 
                    <br/>
                    <button type="submit" className="btn btn-primary">Login</button>
                  </form>
                  <p>Don't have an account yet? <span onClick={() => handleAction("register")} style={{cursor:"default"}}><u>Register here</u></span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
