import { dateFormatter } from "asv-hlps";
import classNames from "classnames";

import "dayjs/locale/fr";

type TobType = {
  dates;
  // fromDate: string | Date;
  // toDate: string | Date;
  dateClass?: any;
  datesClass?: any;
};

const DisplayDate = ({ dates, dateClass, datesClass }: TobType) => {
  if (!dates) {
    const newDate = new Date();
    dates = { fromDate: dateFormatter(newDate), toDate: dateFormatter(newDate) };
  }
  return (
    <>
      {dates?.fromDate === dates?.toDate ? (
        <span className={classNames(dateClass ? dateClass : "fs-5", "fw-bold")}>{dateFormatter(dates.fromDate, "dmy", "/")}</span>
      ) : (
        <span className={classNames(datesClass ? datesClass : "fs-6", "fw-bold")}>
          {dateFormatter(dates.fromDate, "dmy", "/") + " - " + dateFormatter(dates.toDate, "dmy", "/")}
        </span>
      )}
    </>
  );
};

export default DisplayDate;
