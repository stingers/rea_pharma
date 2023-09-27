import { BtnSubmit, ModalWarning, useReadonlyFetchTobs } from "asv-hlps-react";
import DisplayAlert from "asv-hlps-react/lib/cjs/reacts/displays/display-alert";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";

import httpService from "../../services/httpService";
import DatePickerRange from "../../shared/dates/date-picker-range";

const GenBill = ({ onCancel, onSubmit }) => {
  const [tob, setTob] = useState<number>(null);
  const [empty, setEmpty] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("vous devez choisir une des options");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [dates, setDates] = useState(null);
  const [sales, setSales] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const { tobs: saleRefs } = useReadonlyFetchTobs(httpService, "sales/menuSalesWithBillIdNull");
  let { tobs: clients } = useReadonlyFetchTobs(httpService, "sales/menuUsersBills");
  let param;

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // check inputs
    if (tob === null) {
      setEmpty(true);
      return;
    } else {
      if (tob === 2 && !dates) {
        setMsg("Vous devez choisir au moins une date");
        setEmpty(true);
        return;
      }
      if (tob === 3 && !selectedClient) {
        setMsg("Vous devez selectinner  un client");
        setEmpty(true);
        return;
      }
      if (tob === 4 && !sales.length) {
        setMsg("Vous devez selectinner au moins  un numéro de commande");
        setEmpty(true);
        return;
      }
    }

    switch (tob) {
      case 1:
        param = { genAll: "tout" };
        break;
      case 2:
        param = { dates: dates };
        break;
      case 3:
        param = { clientId: selectedClient.id };
        break;
      case 4:
        param = { saleRefs: sales };
        break;
    }

    onSubmit({ param });
  };

  const handleOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = +e.currentTarget.value;
    // const value = getOption;
    // const param = { genAll: "tout" };

    setTob(value);
    if (tob === 1) {
      setDisabled(false);
    }
  };

  const handleClient = (client) => {
    setSelectedClient(client);
    setDates(null);
    setSales([]);
    setDisabled(false);
  };

  const handleDates = (dates) => {
    setDates(dates);
    setSelectedClient(null);
    setSales([]);
    setDisabled(false);
  };

  const handleSales = async (sales) => {
    setSales(sales);
    setDates(null);
    setSelectedClient(null);
    setDisabled(false);
  };

  return (
    <>
      <DisplayAlert variant="warning" icon="fas fa-exclamation-triangle">
        <span>
          Cette action se fait en tache de fond. Vous n'êtes pas obligé d'attendre. Pour voir le résultat de votre action vous devez
          rafraichir la vue en cliquant sur <i className="fas fa-sync-alt"></i> situé en haut à droite
        </span>
      </DisplayAlert>
      <form onSubmit={handleSubmit}>
        {/* manquantes */}
        <Row>
          <Col>
            <Form.Check type="radio" name="genOption" value={1} onChange={(e) => handleOption(e)} label="Factures Manquantes" />
          </Col>
          <Col>
            {tob && tob === 1 && (
              <span className="text-success">
                <i className="fas fa-handshake fa-2x "></i>
              </span>
            )}
          </Col>
        </Row>
        {/* by period */}
        <Row>
          <Col>
            <Form.Check type="radio" name="genOption" value={2} onChange={(e) => handleOption(e)} label="Par periode" />
          </Col>
          <Col>{tob && tob === 2 && <DatePickerRange onDateChange={handleDates} />}</Col>
        </Row>

        {/* by client */}
        <Row>
          <Col sm={3}>
            <Form.Check type="radio" name="genOption" value={3} onChange={(e) => handleOption(e)} label="Par client" />
          </Col>
          <Col>
            {tob && tob === 3 && (
              <>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  // isLoading={true}
                  isClearable={true}
                  isSearchable={true}
                  name="color"
                  options={clients}
                  onChange={handleClient}
                  getOptionLabel={(tob) => `${tob.username} ( ${tob.steName} ) `}
                />
              </>
            )}
          </Col>
        </Row>
        {/* by bills numbers */}
        <Row>
          <Col sm={4}>
            <Form.Check type="radio" name="genOption" value={4} onChange={(e) => handleOption(e)} label="Par N° factures" />
          </Col>
          <Col>
            {tob && tob === 4 && (
              <>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  // isLoading={true}
                  // isClearable={true}
                  // isSearchable={true}
                  name="color"
                  options={saleRefs}
                  onChange={handleSales}
                  isMulti={true}
                  closeMenuOnSelect={false}
                  getOptionLabel={(tob) => `${tob.ref} ( ${tob.steName} ) `}
                />
              </>
            )}
          </Col>
        </Row>
        <Row className="my-2 text-end">
          <BtnSubmit onCancel={onCancel} approveLabel={"générer"} disabled={disabled} />
        </Row>
      </form>
      <ModalWarning show={empty} content={msg} onCloseModal={() => setEmpty(false)} />
    </>
  );
};

export default GenBill;
