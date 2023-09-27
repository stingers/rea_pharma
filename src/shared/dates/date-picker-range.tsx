import dayjs from "dayjs";
import React, { useState } from "react";

import MintonDatepicker from "../../shared/components/Datepicker";

const DatePickerRange = ({ onDateChange }) => {
  // const [dateRange, setDateRange] = useState<any>([new Date(), new Date().setDate(new Date().getDate() + 7)]);
  const [dateRange, setDateRange] = useState<any>([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  // const [fromDate, toDate] = dateRange;
  // const years = range(1990, getYear(new Date()) + 1, 1);
  const handleDate = (date) => {
    setDateRange(date);
    // onDateChange(date);
    const nDate = [...date];

    const fromDate = dayjs(nDate[0]).format("YYYY-MM-DD");
    const toDate = nDate[1] ? dayjs(nDate[1]).format("YYYY-MM-DD") : fromDate;
    // if (fromDate && toDate) {
    onDateChange({ fromDate, toDate });
    // }
  };
  return (
    <>
      <MintonDatepicker
        // <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        // hideAddon={false}
        dateFormat={"dd/MM/yyyy"}
        onChange={(date) => {
          handleDate(date);
        }}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        // dropdownMode="select"
        inline
      />
    </>
  );
};

export default DatePickerRange;
