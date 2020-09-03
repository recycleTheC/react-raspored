import React from "react";
import { format } from "date-fns";
import locale from "date-fns/locale/hr";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DatePick = ({ date, setDate }) => {
  const filterDays = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      customInput={<p>{format(date, "eeee, dd.MM.yyyy.", { locale })}</p>}
      locale={locale}
      filterDate={filterDays}
      popperPlacement="auto"
    />
  );
};

export default DatePick;
