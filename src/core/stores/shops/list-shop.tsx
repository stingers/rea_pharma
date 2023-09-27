import DisplayHeader from "asv-hlps-react/lib/cjs/reacts/displays/display-header";
import { Product } from "asv-hlps/lib/cjs/models/entities/products/Product";
import { removeDuplicateObjects } from "asv-hlps/lib/cjs/utils";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import httpService from "../../../services/httpService";
import { SkTreeBounce } from "../../../shared/spinkit/sk-spinner";
import InputProduct from "../products/input-product";

const ListShop = () => {
  const [tobs, setTobs] = useState<Product[]>([]);
  const [filteredTobs, setFilteredTobs] = useState<Product[]>([]);
  const [labos, setLabos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState({
    id: 0,
    name: "tous",
  });

  const { param } = useParams();
  const getParam = param ? param : "arrivals";

  const getMenuLabos = (datas: any[]) => {
    let menuLabos: any[] = [];
    datas.map((data) => {
      if (data.labo) {
        menuLabos.push({ id: data.labo.id, name: data.labo?.ste?.name });
      }
    });
    menuLabos = removeDuplicateObjects(menuLabos);
    menuLabos.splice(0, 0, { id: 0, name: "Tous" });
    return menuLabos;
  };

  const fetchTobs = async () => {
    setLoading(true);
    const { data } = await httpService.get(`products/${getParam}`);

    setLoading(false);
    setSelectedOption({ id: 0, name: "tous" });
    setLabos(getMenuLabos(data));
    setTobs(data);
    setFilteredTobs(data);
  };

  useEffect(() => {
    fetchTobs();

    // return () => {};
  }, [getParam]);

  const getTitle = (param: string) => {
    switch (param) {
      case "arrivals":
        return "arrivage";
      case "promos":
        return "promos";
      case "cpa":
        return "gamme cpa";
      case "eqeer":
        return "gamme eqeer";
      case "accessories":
        return "accessoires";
      default:
        return "arrivage";
    }
  };

  const onSelectedOption = (opt) => {
    setSelectedOption(opt);
    let filterTobs = [];
    if (opt.id === 0) {
      filterTobs = tobs;
      setFilteredTobs(filterTobs);
    } else {
      filterTobs = tobs.filter((x) => x?.labo?.id === opt.id);
      setFilteredTobs(filterTobs);
    }
  };

  return (
    <>
      <div className="mb-3">
        <DisplayHeader
          countLength={filteredTobs.length}
          rSelect={{ className: "mx-1", options: labos, onSelectedOption: onSelectedOption, defaultValue: selectedOption }}
          headTitle={getTitle(param)}
          authRSelect={["arrivals", "promos"].includes(getParam || "arrivals")}
        />
      </div>
      {/* <SkSpinner loading={loading} spinner="grow" /> */}
      {loading && <SkTreeBounce />}
      <Row>
        {React.Children.toArray(
          (filteredTobs || []).map((item) => (
            <Col sm={4}>
              <InputProduct product={item} />
            </Col>
          ))
        )}
      </Row>
    </>
  );
};

export default ListShop;
