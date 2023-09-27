import { ModalBase } from "asv-hlps-react";
import { useEffect, useRef, useState } from "react";

import httpService from "../../../services/httpService";
import InputListProduct from "./input-list-product";

const SearchProduct = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  // --------------------

  const fetchDatas = async (search) => {
    /* if (!search.trim() && search.length < 3) {
      setProducts([]);
    } else { */
    const { data } = await httpService.get(`products/search?search=${search}`);
    setProducts(data);
    // }
    setLoading(false);
  };
  useEffect(() => {
    fetchDatas(search);
    return () => {};
  }, [search]);
  // --------------------
  const onChange = (e) => {
    // console.log(searchRef.current);
    const term = e.target.value;
    setSearch(term);
    if (term.length > 2) {
      setModal(true);
    }
  };
  return (
    <>
      <div className="row  align-items-center">
        <div className="col-auto">
          <label className="col-form-label">
            <i className="fas fa-capsules"></i>
          </label>
        </div>
        <div className="col-sm">
          <input type="text" className="form-control" onChange={onChange} />
        </div>
      </div>
      <ModalBase
        title={"title"}
        size="xl"
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<InputListProduct products={products} />}
      />
    </>
  );
};

export default SearchProduct;
