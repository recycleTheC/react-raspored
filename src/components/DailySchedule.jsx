import React, { useContext } from "react";
import ScheduleContext from "../context/schedule/scheduleContext";
import { ListGroup, Badge, Col, Row } from "react-bootstrap";

function DailySchedule() {
  const context = useContext(ScheduleContext);
  const { schedule, notes } = context;

  /**
   * @todo Refactoring 'DailySchedule' component
   * @body Component should be constructed from few smaller components (`ScheduleItem`, etc.)
   */

  return (
    <ListGroup variant="flush">
      {schedule.map((x) => {
        const { name, teacher } = x.class;
        const { location, id, timeStart, timeEnd } = x;
        return (
          <ListGroup.Item key={x.id}>
            <Row>
              <Col md="6" sm={12}>
                <Badge pill variant="primary">
                  {id}. sat
                </Badge>{" "}
                <Badge pill variant="success">
                  {timeStart} - {timeEnd}
                </Badge>{" "}
                <Badge pill variant="light">
                  lokacija: {location}
                </Badge>
                <div>
                  <h4 className="mt-2">{name}</h4>
                  <small>
                    {teacher
                      .map((t) => t.name)
                      .reduce((prev, curr) => [prev, " / ", curr])}
                  </small>
                </div>
              </Col>
              <Col md={6} sm={12} className="px-0">
                {notes.filter((k) => k.classId === id).length > 0 && (
                  <Col md="auto" sm={12} className="mt-2">
                    <Badge pill variant="light">
                      Bilješke
                    </Badge>
                    <ul className="pl-4">
                      {notes
                        .filter((k) => k.classId === id)
                        .map((n) => (
                          <li key={n._id}>
                            <small>{n.note}</small>
                          </li>
                        ))}
                    </ul>
                  </Col>
                )}
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default DailySchedule;
