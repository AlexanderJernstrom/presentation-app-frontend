import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { apiURL } from "../App";

export const Register = () => {
  const [redirect, setRedirect] = useState(false);

  return (
    <div>
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
        <h1 style={{ textAlign: "center" }}>Register</h1>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={async (values) => {
            const res = await fetch(`${apiURL}/register`, {
              method: "POST",
              body: JSON.stringify(values),
            });
            const data = await res.json();
            if (data.success === true) {
              setRedirect(true);
            }
          }}
        >
          {({ handleSubmit, values }) => (
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
              {redirect === true ? (
                <Redirect to={{ pathname: "/login", state: values }} />
              ) : null}
              <label>Name</label>
              <Field
                name="name"
                placeholder="Enter name"
                className="login-input"
              />

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
                Register
              </button>
              <Link to="/login">
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
                  Already have an account? Sign in here!
                </button>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
