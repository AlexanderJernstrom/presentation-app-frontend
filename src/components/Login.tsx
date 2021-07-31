import React from "react";
import { Field, Form, Formik } from "formik";
import { Link, Redirect } from "react-router-dom";
import * as H from "history";
import axios from "axios";
import { apiURL } from "../App";

interface FormType {
  email: string;
  password: string;
}

interface RouteComponentProps {
  location: H.Location<{ email: string; name: string; password: string }>;
  history: H.History;
  staticContext?: any;
}

interface Props extends RouteComponentProps {}

export const Login: React.FC<Props> = ({ location }) => {
  const login = async (values: FormType) => {
    const response = await fetch(`${apiURL}/login`, {
      body: JSON.stringify(values),
      method: "POST",
    });
    console.log(response.status);
    if (response.status === 200) {
      console.log("Got here");
      const data = await response.text();
      console.log(data);
      localStorage.setItem("presentation-app-token", data);
    } else {
      alert("Something went wrong here");
    }
  };

  const getInitialValues = () => {
    console.log(location.state);
    if (location.state !== undefined && location.state.email) {
      return { email: location.state.email, password: location.state.password };
    } else {
      return { email: "", password: "" };
    }
  };

  return (
    <div>
      {localStorage.getItem("presentation-app-token") ? (
        <Redirect to="/" />
      ) : (
        <div
          style={{
            backgroundColor: "#efefef",
            width: "50%",
            marginLeft: "25%",
            padding: "1rem",
            borderRadius: "5px",
            marginTop: "5%",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Login</h1>
          <Formik
            initialValues={getInitialValues() || { email: "", password: "" }}
            onSubmit={(values) => login(values)}
          >
            {({ handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: "50%",
                  marginLeft: "25%",
                }}
              >
                <label>Email</label>
                <Field
                  name="email"
                  placeholder="Enter email"
                  className="login-input"
                />
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="login-input"
                />
                <button
                  style={{
                    borderRadius: "3px",
                    width: "20%",
                    marginLeft: "40%",
                    marginTop: "1rem",
                    color: "white",
                    backgroundColor: "#33CC77",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                  type="submit"
                >
                  Sign In
                </button>
                <Link to="/register">
                  <button
                    style={{
                      borderRadius: "3px",
                      width: "40%",
                      marginLeft: "30%",
                      marginTop: "1rem",
                      color: "white",
                      backgroundColor: "#33CC77",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    Don't have an account? Create one here!
                  </button>
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};
