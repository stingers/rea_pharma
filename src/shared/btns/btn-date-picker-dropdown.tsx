import { dateFormatter } from "asv-hlps";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";

import DatePickerRange from "../dates/date-picker-range";

type TobType = {
  format?: "year" | "month" | "day";
  onSelectedDate: (dates: any) => void;
};

const BtnDatePickerDropdown = ({ format, onSelectedDate }: TobType) => {
  const date = new Date();
  // const [fromDate, setFromDate] = useState(new Date().toLocaleDateString());
  const [fromDate, setFromDate] = useState(date);
  // const [toDate, setToDate] = useState(new Date().toLocaleDateString());
  const [toDate, setToDate] = useState(date);

  const handleDates = (props) => {
    // setFromDate(new Date(props["fromDate"]).toLocaleDateString());
    setFromDate(new Date(props["fromDate"]));
    // setToDate(new Date(props["toDate"]).toLocaleDateString());
    setToDate(new Date(props["toDate"]));
    onSelectedDate(props);
  };

  const dates = () => {
    if (fromDate === toDate) {
      if (format == "year") {
        return <span className="text-uppercase fs-6 fw-bold">{dateFormatter(fromDate, "y")}</span>;
      }
      if (format === "month") {
        return <span className="text-uppercase fs-6 fw-bold">{dateFormatter(fromDate, "myfr")}</span>;
      }
      if (format === "day") {
        return <span className="text-uppercase fs-6 fw-bold"> {dateFormatter(fromDate, "dmyfr")}</span>;
        // return dayjs(date).locale("fr").format("dddd DD MMMM YYYY");
      }
    }
    return <span className="fs-6 fw-bold">{dateFormatter(fromDate, "dmy", "/") + " - " + dateFormatter(toDate, "dmy", "/")}</span>;
  };
  return (
    <Dropdown>
      <Dropdown.Toggle variant="link" className="p-0">
        {dates()}
        <i className="mdi mdi-chevron-down"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0">
        <DatePickerRange onDateChange={handleDates} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BtnDatePickerDropdown;
