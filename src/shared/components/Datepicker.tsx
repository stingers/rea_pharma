import classNames from "classnames";
import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";

interface DatepickerInputProps {
  onClick?: () => void;
  value?: string;
  inputClass: string;
  children?: React.ReactNode;
}

/* Datepicker with Input */
const DatepickerInput = forwardRef<HTMLInputElement, DatepickerInputProps>((props, ref) => {
  const onDateValueChange = () => {};
  return (
    <input
      type="text"
      className={classNames("form-control", props.inputClass)}
      onClick={props.onClick}
      value={props.value}
      onChange={onDateValueChange}
      ref={ref}
    />
  );
});

/* Datepicker with Addon Input */
const DatepickerInputWithAddon = forwardRef<HTMLInputElement, DatepickerInputProps>((props, ref) => (
  <div className="input-group position-relative" ref={ref}>
    <input type="text" className={classNames("form-control", props.inputClass)} onClick={props.onClick} value={props.value} readOnly />
    <span className="input-group-text">
      <i className="ri-calendar-event-fill"></i>
    </span>
  </div>
));

interface MintonDatepickerProps {
  value?: Date;
  selectsRange?: boolean;
  startDate?: Date;
  endDate?: Date;
  calendarClassName?: string;
  onChange: (date: any) => void;
  hideAddon?: boolean;
  inputClass?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  tI?: number;
  timeCaption?: string;
  timeFormat?: string;
  showTimeSelectOnly?: boolean;
  monthsShown?: number;
  inline?: boolean;
  peekNextMonth?: boolean;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
}

const MintonDatepicker = (props: MintonDatepickerProps) => {
  // handle custom input
  /* const input =
    (props.hideAddon || false) === true ? (
      <DatepickerInput inputClass={props.inputClass!} />
    ) : (
      <DatepickerInputWithAddon inputClass={props.inputClass!} />
    ); */

  return (
    <>
      {/* date picker control */}
      <DatePicker
        calendarClassName={props.calendarClassName || "shadow"}
        selectsRange={props.selectsRange}
        startDate={props.startDate}
        endDate={props.endDate}
        selected={props.value}
        onChange={(date) => props.onChange(date)}
        // customInput={input}
        timeIntervals={props.tI}
        showTimeSelect={props.showTimeSelect}
        timeFormat={props.timeFormat || "hh:mm a"}
        timeCaption={props.timeCaption}
        dateFormat={props.dateFormat || "MM/dd/yyyy"}
        minDate={props.minDate}
        maxDate={props.maxDate}
        monthsShown={props.monthsShown}
        showTimeSelectOnly={props.showTimeSelectOnly}
        peekNextMonth={props.peekNextMonth}
        inline={props.inline}
        autoComplete="off"
        showMonthDropdown={props.showMonthDropdown}
        showYearDropdown={props.showYearDropdown}
        dropdownMode="select"
        // locale={"fr"}
      />
    </>
  );
};

export default MintonDatepicker;
