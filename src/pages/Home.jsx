import React, { useContext, useState, useEffect } from "react";
import ScheduleContext from "../context/schedule/scheduleContext";
import { addDays } from "date-fns";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Column from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { ArrowRightCircle, ArrowLeftCircle } from "react-bootstrap-icons";

import DailySchedule from "../components/schedule/DailySchedule";
import DatePick from "../components/date-picker/DatePicker";

export default function Home() {
  const context = useContext(ScheduleContext);
  const { loading, schedule, getSchedule } = context;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getSchedule(date);
    // eslint-disable-next-line
  }, [date]);

  const spinner = (
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
          <DatePick date={date} setDate={setDate} />
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
        {schedule.msg && (
          <Column md="12" sm="12">
            <small>{schedule.msg}</small>
          </Column>
        )}
      </Row>
      {loading ? spinner : !schedule.msg && <DailySchedule date={date} />}
    </div>
  );
}
