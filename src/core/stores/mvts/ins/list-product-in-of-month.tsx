import { useEffect, useState } from "react";

import httpService from "../../../../services/httpService";
import InputListProductIn from "./input-list-product-in";

const ListProductIn0fMonth = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    // const { data: tobs } = await httpService.postBody(dates, "productins");
    const { data: tobs } = await httpService.postBody({ dates }, "productins");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [dates]);
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  return (
    <InputListProductIn tobs={tobs} onSelectedDate={onSelectedDates} handleDelete={undefined} handleEdit={undefined} loading={loading} />
  );
};

export default ListProductIn0fMonth;
