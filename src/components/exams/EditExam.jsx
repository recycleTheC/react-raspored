import React, { useContext, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { format } from "date-fns";
import ScheduleContext from "../../context/schedule/scheduleContext";
import { useForm } from "react-hook-form";

function EditExam({ schedule, show, close, date }) {
  const context = useContext(ScheduleContext);
  const { createExam, deleteExam, exams, updateExam } = context;

  const { handleSubmit, register, errors, setValue, watch } = useForm({
    defaultValues: { examId: "0" },
  });

  const onSubmit = (values) => {
    const classKey = values.class.split(":")[0];
    const classId = values.class.split(":")[1];
    const content = values.content;
    const id = values.examId;

    if (id === "0") {
      createExam(date, classKey, classId, content);
    } else {
      updateExam(id, classKey, classId, content);
    }
    close({ target: { name: "exams" } });
  };

  const { examId } = watch();

  useEffect(() => {
    if (examId !== "0") {
      const selected = exams.find((exam) => exam._id === examId);
      setValue("content", selected.content);
      setValue("class", selected.classKey._id + ":" + selected.classId);
    }
    // eslint-disable-next-line
  }, [examId]);

  const onDelete = (values) => {
    deleteExam(values.examId);
    close({ target: { name: "exams" } });
  };

  const hide = () => {
    close({ target: { name: "exams" } });
  };

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>Ispiti za {format(date, "dd.MM.yyyy.")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              as="select"
              name="examId"
              ref={register({ required: "Obavezno" })}
            >
              <option key={0} value={0}>
                Novi ispit
              </option>
              {exams.map((x) => {
                return (
                  <option key={x._id} value={x._id}>
                    Ispit "{x.content}" ({x.classId}. sat)
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Predmet {errors.class && <small>({errors.class.message})</small>}
            </Form.Label>
            <Form.Control
              as="select"
              name="class"
              ref={register({ required: "Obavezno" })}
            >
              {schedule.map((x) => {
                return x.classes.map((y) => {
                  return (
                    <option key={y._id + ":" + x.id} value={y._id + ":" + x.id}>
                      {x.id}. sat - {y.name}
                    </option>
                  );
                });
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="textArea">
            <Form.Label>
              Sadržaj ispita
              {errors.content && <small>({errors.content.message})</small>}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              name="content"
              ref={register({ required: "Obavezno" })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {examId !== "0" && (
          <Button variant="danger" onClick={handleSubmit(onDelete)}>
            Obriši ispit
          </Button>
        )}

        <Button variant="success" onClick={handleSubmit(onSubmit)}>
          Spremi ispit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditExam;
