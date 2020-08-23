import React, { useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import ScheduleContext from "../../context/schedule/scheduleContext";

function AddNote({ show, close }) {
  /**
   * @todo Implement adding notes on homepage
   * @body Add funtionality to App so authenticated users can add notes for individuall classes by using Bootstrap Modals & React Hook Form
   */

  const context = useContext(ScheduleContext);
  const { setNotes } = context;

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>XYZ (dd.mm.yyyy, XY. sat)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="textArea">
            <Form.Label>Bilješka</Form.Label>
            <Form.Control as="textarea" rows="4" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={close}>
          Spremi bilješku
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNote;
