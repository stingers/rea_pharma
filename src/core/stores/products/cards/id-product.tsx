import { Product } from "asv-hlps";
import { useEffect, useState } from "react";

import httpService from "../../../../services/httpService";
import AdditProduct from "../addit-product";

type TobType = {
  product?: Product;
  productId?: number | string;
};
const IdProduct = ({ productId }: TobType) => {
  const [tob, setTob] = useState(null);

  const fetchTobs = async () => {
    const { data } = await httpService.getByParam(productId, "products/edit");
    setTob(data);
  };

  useEffect(() => {
    fetchTobs();
    return () => {};
  }, []);

  /*  useEffect(() => {
    httpService
      .getByParam(productId, "products/edit")
      .then(({ data }) => {
        setTob(data);
      })
      .catch(() => Toastify);
  }, []); */

  const handleSubmit = (tobValues) => {};

  return tob && <AdditProduct tob={tob} onSubmitForm={handleSubmit} />;
};

export default IdProduct;
