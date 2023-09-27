import { useEffect, useState } from "react";

import httpService from "../../../../services/httpService";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import InputListProductOut from "./input-list-product-out";

const ListProductOutOfMonth = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.postBody({ dates }, "productouts/all");
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
  const handleDelete = async (tob) => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    const err = await hlpCrud.persistDelete(tob, `url/del`, tobs);
    if (err) {
      setTobs(tobs);
    }
  };

  return <InputListProductOut tobs={tobs} onSelectedDate={onSelectedDates} handleDelete={handleDelete} loading={loading} />;
};

export default ListProductOutOfMonth;
