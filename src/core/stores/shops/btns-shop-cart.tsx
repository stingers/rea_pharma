import { sesStorageGet, sesStorageSet } from "asv-hlps";
import { BtnAction, DropMenuType, ModalBase, ModalConfirm, pathName, Toastify } from "asv-hlps-react";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import AdditStrNbrSelect from "../../../shared/forms/addit-str-nbr-select";
import CartShopSum from "./cart-shop-sum";
import { useShopCartContext } from "./shop-cart-context";

type TobProps = {
  onDeleteSale?: () => void;
  onCheckout?: () => void;
};

const BtnsShopCart = ({ onDeleteSale, onCheckout }: TobProps) => {
  const navigate = useNavigate();
  // const location = ;
  const url = pathName(useLocation());

  const [modal, setModal] = useState(false);
  const [modalDel, setModalDel] = useState(false);
  const [modalOption, setModalOption] = useState(false);
  const [labelOption, setLabelOption] = useState(null);
  const [option, setOption] = useState<string>(null);
  let { sale, setSale } = useShopCartContext();

  const onApprove = () => {
    setModal(false);
    onCheckout();
  };
  const handleSaleDel = () => {
    setModalDel(false);
    onDeleteSale();
  };

  const pathCheckout = (url) => {
    return ["checkout", "proformacheckout"].includes(url);
  };

  const pathShop = (url) => {
    return ["shopcart", "proformacart"].includes(url);
  };

  const onContinueSale = () => {
    const isProforma = sesStorageGet("isProforma");
    if (isProforma) {
      navigate("/dash/proformacart");
    } else {
      navigate("/dash/shopcart");
    }
  };

  const dropMenu: DropMenuType = {
    label: "options",
    drops: [
      { id: "shippingFee", label: "Frais d'envoi" },
      { id: "otherFee", label: "Autres frais" },
      { id: "discount", label: "Faire une remise" },
    ],
  };

  const onDrop = (option) => {
    switch (option) {
      case "shippingFee":
        setModalOption(true);
        setLabelOption("Frais d'envoi");
        setOption(option);
        break;
      case "otherFee":
        setModalOption(true);
        setLabelOption("Autre frais ");
        setOption(option);
        break;
      case "discount":
        setModalOption(true);
        setLabelOption("Remise %");
        setOption(option);
        break;
    }
  };

  const onSubmitOption = (obj) => {
    switch (option) {
      case "shippingFee":
        setModalOption(false);
        const nSale = { ...sale, shippingFee: +obj.nbr };
        sesStorageSet("sale", nSale);
        setSale(nSale);
        break;
      case "otherFee":
        setModalOption(false);
        const oSale = { ...sale, otherFee: +obj.nbr };
        sesStorageSet("sale", oSale);
        setSale(oSale);
        break;
      case "discount":
        setModalOption(false);
        const dSale = { ...sale, discountRate: +obj.nbr };
        sesStorageSet("sale", dSale);
        setSale(dSale);
        break;
    }
  };

  return (
    <>
      <Row className="mt-3">
        <Col className="align-self-center">
          <Button className="btn-sm text-uppercase me-2 " variant="danger" onClick={() => setModalDel(true)}>
            supprimer la commande
          </Button>
          {pathCheckout(url) && (
            <Button className="btn-sm text-uppercase me-2 " variant="success" onClick={() => setModal(true)}>
              confirmer la commande
            </Button>
          )}
          {pathShop(url) && (
            <Button
              className="btn-sm text-uppercase me-2 "
              variant="success"
              onClick={() => {
                const client = sesStorageGet("client");
                const proforma = sesStorageGet("isProforma");
                if (client) {
                  if (proforma) {
                    navigate("/dash/proformacheckout");
                  } else {
                    navigate("/dash/checkout");
                  }
                } else {
                  Toastify.warning("Veuillez sélectionner un client pour cette commande");
                }
              }}>
              valider la commande
            </Button>
          )}

          {/* continue sale */}
          {pathCheckout(url) && (
            <Button className="btn-sm text-uppercase me-2 " variant="info" onClick={onContinueSale}>
              continuer la commande
            </Button>
          )}
          {pathCheckout(url) && authService.getAuth({ roles: [...PHD, "rcm"] }) && <BtnAction dropMenu={dropMenu} onDrop={onDrop} />}
        </Col>
        <Col sm={4} md={3} className="align-self-center">
          <CartShopSum />
        </Col>
      </Row>
      {/* modal option */}
      <ModalBase
        onCloseModal={() => setModalOption(false)}
        show={modalOption}
        icon="fas fa-pen"
        title={`Ajout ${labelOption}`}
        content={<AdditStrNbrSelect schema="nbr" label={labelOption} onSubmitForm={onSubmitOption} />}
      />

      <ModalConfirm
        title={"Veuillez confirmer la commande"}
        content={
          <div className="text-center">
            Etes-vous sûr de vouloir valider cette commande? <br></br>
            Toute commande <b>validée</b> ne peut plus être modifiée.
          </div>
        }
        show={modal}
        onCloseModal={() => setModal(false)}
        onCancel={() => setModal(false)}
        onApprove={onApprove}
      />
      <ModalConfirm
        title={"Veuillez confirmer la suppression"}
        content={
          <div className="text-center ">
            La commande sera <b className="fw-bold">supprimée définitivement</b>.<br></br> Cette action est irrévocable. Confirmer pour
            valider votre action.
          </div>
        }
        show={modalDel}
        onCloseModal={() => setModalDel(false)}
        onCancel={() => setModalDel(false)}
        // onApprove={onCheckout}
        onApprove={handleSaleDel}
      />
    </>
  );
};

export default BtnsShopCart;
