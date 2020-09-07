import React, { useContext, useState } from "react";
import ScheduleContext from "../../context/schedule/scheduleContext";
import AuthContext from "../../context/auth/authContext";
import {
  ListGroup,
  Badge,
  Col,
  Row,
  ButtonToolbar,
  ButtonGroup,
  Button,
  ListGroupItem,
  Alert,
} from "react-bootstrap";
import { v4 as uuid } from "uuid";
import ReactMarkdown from "react-markdown";
import { ExclamationTriangle } from "react-bootstrap-icons";

import EditNote from "../notes/EditNote";
import EditExam from "../exams/EditExam";

function DailySchedule({ date }) {
  const scheduleContext = useContext(ScheduleContext);
  const { schedule, notes, exams } = scheduleContext;
  const authContext = useContext(AuthContext);

  const [showModal, setModal] = useState({ notes: false, exams: false });

  const toggleModal = (e) => {
    setModal({
      [e.target.name]: !showModal[e.target.name],
    });
  };

  const edit = (
    <ListGroupItem key="toolbar">
      <ButtonToolbar>
        <ButtonGroup style={{ margin: "auto" }}>
          <Button
            variant="outline-success"
            size="sm"
            name="notes"
            onClick={toggleModal}
          >
            Bilješke
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            name="exams"
            onClick={toggleModal}
          >
            Ispiti
          </Button>
          <Button variant="outline-info" size="sm">
            Izmjene
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </ListGroupItem>
  );

  const examList = (
    <Alert variant="dark" className="my-2">
      <Row>
        <div className="col-auto align-self-start">
          <ExclamationTriangle color="red" size="30px" />
        </div>
        <Col style={{ margin: "auto" }}>
          <strong>Pisane provjere: </strong>
          {exams.length > 0 &&
            exams
              .map((exam) => {
                return (
                  <Badge pill variant="danger" key={exam._id}>
                    {exam.classKey.name}
                  </Badge>
                );
              })
              .reduce((prev, curr) => [prev, " ", curr])}
        </Col>
      </Row>
    </Alert>
  );

  /**
   * @todo Refactoring 'DailySchedule' component
   * @body Component should be constructed from few smaller components (`ScheduleItem`, etc.)
   */

  return (
    <ListGroup variant="flush" className="mt-2">
      {authContext.isAuthenticated && schedule.length > 0 && edit}
      {exams.length > 0 && examList}

      {schedule.map((x) => {
        const { location, id, timeStart, timeEnd } = x;
        return (
          <ListGroup.Item key={x.id}>
            <Row>
              <Col>
                <div className="mb-2">
                  <Badge pill variant="primary">
                    {id}. sat
                  </Badge>{" "}
                  <Badge pill variant="success">
                    {timeStart} - {timeEnd}
                  </Badge>{" "}
                  {location !== "-" && (
                    <Badge pill variant="light">
                      lokacija: {location}
                    </Badge>
                  )}
                </div>
                {x.class
                  .map((_class) => {
                    return (
                      <Row key={_class._id}>
                        <Col md="6" key={_class._id} className="mb-2">
                          <div>
                            <h4>{_class.name}</h4>
                            <small>
                              {_class.teacher
                                .map((t) => t.name)
                                .reduce((prev, curr) => [prev, " / ", curr])}
                            </small>
                            {exams.find(
                              (exam) => exam.classKey._id === _class._id
                            ) && (
                              <div className="mt-2">
                                <Badge pill variant="danger">
                                  Ispit
                                </Badge>{" "}
                                <small>
                                  {exams
                                    .filter(
                                      (exam) => exam.classKey._id === _class._id
                                    )
                                    .map((item) => (
                                      <strong key={item._id}>
                                        {item.content}
                                      </strong>
                                    ))
                                    .reduce((prev, curr) => [
                                      prev,
                                      " / ",
                                      curr,
                                    ])}
                                </small>
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col md={6} sm={12} className="px-0">
                          {notes.filter(
                            (k) => k.classId === id && k.classKey === _class._id
                          ).length > 0 && (
                            <Col md="auto" sm={12}>
                              <Badge pill variant="light">
                                Bilješke
                              </Badge>
                              <ul className="pl-4">
                                {notes
                                  .filter(
                                    (k) =>
                                      k.classId === id &&
                                      k.classKey === _class._id
                                  )
                                  .map((n) => (
                                    <li key={n._id}>
                                      <small>
                                        <ReactMarkdown
                                          source={n.note}
                                          renderers={{
                                            paragraph: (props) => {
                                              return (
                                                <p className="mb-1" style={{}}>
                                                  {props.children}
                                                </p>
                                              );
                                            },
                                          }}
                                        />
                                      </small>
                                    </li>
                                  ))}
                              </ul>
                            </Col>
                          )}
                        </Col>
                      </Row>
                    );
                  })
                  .reduce((prev, curr) => [prev, <hr key={uuid()} />, curr])}
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
      <EditNote
        show={showModal.notes}
        name="notes"
        close={toggleModal}
        date={date}
      />
      <EditExam
        show={showModal.exams}
        name="exams"
        close={toggleModal}
        date={date}
      />
    </ListGroup>
  );
}

export default DailySchedule;
