import React, { useContext, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";

const Login = (props) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const authContext = useContext(AuthContext);
  const { login, isAuthenticated, error } = authContext;

  const { handleSubmit, register, errors, clearErrors } = useForm();

  const onSubmit = (values) => {
    login({ email: values.email, password: values.password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    if (error) {
      setAlert("Pogreška", error);
      clearErrors();
    }
    console.log(error);
    // eslint-disable-next-line
  }, [isAuthenticated, props.history, error]);

  return (
    <Form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <h1>Prijava u aplikaciju</h1>
      <Form.Group controlId="email">
        <Form.Label>
          E-mail adresa{" "}
          {errors.email && <small>({errors.email.message})</small>}
        </Form.Label>
        <Form.Control
          type="text"
          name="email"
          ref={register({ required: "Obavezno" })}
        />

        <Form.Group controlId="password">
          <Form.Label>
            Lozinka{" "}
            {errors.password && <small>({errors.password.message})</small>}
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            ref={register({ required: "Obavezno" })}
          />
        </Form.Group>

        <Button className="mt-4" type="submit">
          Prijava
        </Button>
      </Form.Group>
    </Form>
  );
};

export default Login;
