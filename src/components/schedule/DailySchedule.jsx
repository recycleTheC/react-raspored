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
  ListGroupItem,
  Dropdown,
} from "react-bootstrap";
import { v4 as uuid } from "uuid";
import ReactMarkdown from "react-markdown";

import AddNote from "../notes/AddNote";

function DailySchedule({ date }) {
  const scheduleContext = useContext(ScheduleContext);
  const { schedule, notes } = scheduleContext;
  const authContext = useContext(AuthContext);

  const [showModal, setModal] = useState(false);
  const toggleModal = () => setModal(!showModal);

  const edit = (
    <ListGroupItem key="toolbar">
      <ButtonToolbar>
        <ButtonGroup style={{ margin: "auto" }}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-success" size="sm">
              Bilješke
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleModal}>
                Dodaj bilješku
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="outline-danger" size="sm">
              Ispiti
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Dodaj ispit</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="outline-info" size="sm">
              Izmjene
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Dodaj izmjenu</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
      </ButtonToolbar>
    </ListGroupItem>
  );

  /**
   * @todo Refactoring 'DailySchedule' component
   * @body Component should be constructed from few smaller components (`ScheduleItem`, etc.)
   */

  return (
    <ListGroup variant="flush" className="mt-2">
      {authContext.isAuthenticated && edit}

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
                  <Badge pill variant="light">
                    lokacija: {location}
                  </Badge>
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
      <AddNote show={showModal} close={toggleModal} date={date} />
    </ListGroup>
  );
}

export default DailySchedule;
