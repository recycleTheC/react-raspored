import React, { useContext } from "react";
import ScheduleContext from "../../context/schedule/scheduleContext";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function AddClass() {
  const context = useContext(ScheduleContext);
  const { loading, status, createTeacher } = context;

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (values) => createTeacher(values.name);
  const reload = () => window.location.reload(false);

  if (status.msg) {
    setTimeout(reload, 3000);
  }

  return (
    <div>
      <h1>Dodaj predmet u bazu podataka</h1>
      <Form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="name">
          <Form.Label>
            Naziv predmeta{" "}
            {errors.name && <small>({errors.name.message})</small>}
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            ref={register({ required: "Obavezno" })}
          />
          <Button className="mt-4" type="submit">
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                  size="sm"
                />{" "}
                <span>Spremanje predmeta...</span>
              </>
            ) : (
              "Spremi predmet"
            )}
          </Button>
        </Form.Group>

        {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
      </Form>
    </div>
  );
}
