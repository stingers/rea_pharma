import { useEffect, useState } from "react";
import { Col, Form, ProgressBar, Row } from "react-bootstrap";

import httpService from "../../../services/httpService";
import InputListProduct from "./input-list-product";

type TobProps = {
  onCloseAll?: () => void;
};

const SearchProductModal = ({ onCloseAll }: TobProps) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // --------------------
  const fetchDatas = async () => {
    const { data } = await httpService.get(`products/search?search=${search}`);
    setProducts(data);
    setLoading(false);
  };
  useEffect(() => {
    if (search && search.length > 2) {
      fetchDatas();
    }
    // fetchDatas();
    // return () => {};
  }, [search]);
  // --------------------

  const onChange = (e) => {
    let term = e.target.value;
    if (term.trim() && term.length > 0) {
      setSearch(term);
    }
  };
  const onClear = () => {
    setSearch("");
    setProducts([]);
  };

  return (
    <>
      <div className="row  align-items-center mb-2">
        <div className="col-auto">
          <label className="col-form-label">
            <i className="fas fa-pills"></i>
          </label>
        </div>
        <div className="col">
          <div className="input-group ">
            {/* <input value={search} type="search" onEmptied={onClear} className="form-control fw-bold text-uppercase" onChange={onChange} /> */}
            <input value={search} type="text" className="form-control fw-bold text-uppercase" onChange={onChange} />

            <span className="input-group-text" onClick={onClear}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          {search && search.length < 3 && <Form.Text className="text-danger">minimum 3 lettres.</Form.Text>}
        </div>
        <div className="col-auto">
          <label className="col-form-label">
            <span className={products.length > 0 ? "text-success" : "text-danger"}>{products.length || 0} </span>trouvé(s)
          </label>
        </div>
      </div>
      {products.length > 0 && (
        <Row>
          <Col>
            <ProgressBar now={100} className=" mb-2" variant="danger" label={"- de 3 mois"} />
          </Col>
          <Col>
            <ProgressBar now={100} className="mb-2" variant="warning" label={"- de 6 mois"} />
          </Col>
          <Col>
            <ProgressBar now={100} className="mb-2" variant="purple" label={"- de 9 mois"} />
          </Col>
          <Col>
            <ProgressBar now={100} className="mb-2" variant="success" label={"- de 12 mois"} />
          </Col>
          <Col>
            <ProgressBar now={100} className="mb-2" variant="info" label={"+ de 12 mois"} />
          </Col>
        </Row>
      )}

      <InputListProduct products={products} />
    </>
  );
};

export default SearchProductModal;
