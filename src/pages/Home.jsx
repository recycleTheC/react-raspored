import React, { useContext, useState, useEffect } from "react";
import ScheduleContext from "../context/schedule/scheduleContext";
import { format, addDays } from "date-fns";
import locale from "date-fns/locale/hr";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Column from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { ArrowRightCircle, ArrowLeftCircle } from "react-bootstrap-icons";

import DailySchedule from "../components/schedule/DailySchedule";

export default function Home() {
  const context = useContext(ScheduleContext);
  const { loading, schedule, getSchedule, getNotes } = context;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getNotes(date);
    getSchedule(date);
    // eslint-disable-next-line
  }, [date]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner animation="grow" variant="success" />
      </div>
    );
  } else {
    return (
      <div>
        <Row className="text-center">
          <Column>
            <Button
              variant="outline-primary"
              onClick={() => {
                setDate(addDays(date, -1));
              }}
            >
              <ArrowLeftCircle />
            </Button>
          </Column>
          <Column>
            <p>{format(date, "eeee, dd.MM.yyyy.", { locale })}</p>
            <p>
              <small>{schedule.msg && schedule.msg}</small>
            </p>
          </Column>
          <Column>
            <Button
              type="submit"
              variant="outline-primary"
              onClick={() => {
                setDate(addDays(date, 1));
              }}
            >
              <ArrowRightCircle />
            </Button>
          </Column>
        </Row>
        {!schedule.msg && <DailySchedule date={date} />}
      </div>
    );
  }
}
