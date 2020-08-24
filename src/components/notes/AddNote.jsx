import React, { useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { format } from "date-fns";
import ScheduleContext from "../../context/schedule/scheduleContext";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

function AddNote({ show, close, date }) {
  const context = useContext(ScheduleContext);
  const { setNotes, schedule } = context;

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (values) => {
    const classKey = values.class.split(":")[0];
    const id = values.class.split(":")[1];
    setNotes(date, classKey, id, values.note);
    close();
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>
          Dodaj bilješku za {format(date, "dd.MM.yyyy.")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="textArea">
            <Form.Label>
              Predmet {errors.class && <small>({errors.class.message})</small>}
            </Form.Label>
            <Form.Control
              as="select"
              name="class"
              ref={register({ required: "Obavezno" })}
            >
              {schedule.map((x) => {
                return x.class.map((y) => {
                  return (
                    <option key={uuid()} value={y._id + ":" + x.id}>
                      {x.id}. sat - {y.name}
                    </option>
                  );
                });
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="textArea">
            <Form.Label>
              Bilješka{errors.note && <small>({errors.note.message})</small>}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              name="note"
              ref={register({ required: "Obavezno" })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit(onSubmit)}>
          Spremi bilješku
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNote;
