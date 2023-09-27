import { currencyFormatter, SaleProduct } from "asv-hlps";
import { BtnDel, colToolTip, ModalBase, ModalConfirm, Toastify, useReadonlyFetchTobs } from "asv-hlps-react";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import httpService from "../../../../services/httpService";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import CheckSaleProductLot from "./check-sale-product-lot";

const GenBackSale = () => {
  const { state } = useLocation();
  // const [tobs, setTobs] = useState<SaleProduct[]>(state.saleProducts);
  const [tobs, setTobs] = useState<any[]>(state.saleProducts);
  const [sp, setSp] = useState<SaleProduct>(null);
  const { tobs: reasons } = useReadonlyFetchTobs(httpService, "product-out-reasons/back");
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const navigate = useNavigate();

  const onCheckSaleProductLot = (sp) => {
    setSp(sp);
    setModal(true);
  };

  const onValidedLot = (sp) => {
    setModal(false);
    const nTobs = hlpCrud.updateTobOnList(sp, tobs);
    setTobs(nTobs);
  };

  const spAmount = (sp: SaleProduct) => {
    return sp.qtityBack * (+sp.unitPrice + (+sp.unitPrice * sp.tva) / 100);
  };

  const onDelete = (sp) => {
    const nTobs = tobs.filter((x) => x.id !== sp.id);
    setTobs(nTobs);
  };

  const onGenBack = async () => {
    // ------ check if backProduct ------
    let countBack = 0;

    for (const tob of tobs) {
      if (tob.qtityBack <= 0) {
        countBack++;
      }
    }
    // ------ if error on back ------
    if (countBack > 0) {
      setModalConfirm(true);
      return;
    } else {
      // --------------------
      const backProducts = { saleId: state.sale.id, saleProducts: tobs };
      try {
        const { data } = await httpService.postBody(backProducts, "salesback/new");
        navigate("/dash/sales/delivered", { state });
        Toastify.success();
      } catch (error) {
        Toastify.error();
      }
    }
  };

  return (
    <>
      <div className="table-responsive">
        <Table className="text-uppercase table-sm" size="sm" striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th style={{ width: "3%" }}>
                <i className="fas fa-trash"></i>
              </th>
              <th>ref</th>
              <th>designation</th>
              <th>{colToolTip("Q.L", "Quantité livrée")}</th>
              <th className="text-center">{colToolTip("Q.R", "Quantité à retourner")}</th>
              <th>{colToolTip("P.U", "Prix unitaire")}</th>
              <th>TVA</th>
              <th>Raison</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {React.Children.toArray(
              (tobs || []).map((sp, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td style={{ width: "3%" }}>
                    <BtnDel tob={sp} onDelete={onDelete} />
                  </td>
                  <td>{sp.product.ref}</td>
                  <td>{sp.product.designation}</td>
                  <td>{sp.qtityDlvr}</td>
                  <td>
                    <input
                      className="form-control form-control-sm  form-control-plaintext text-center"
                      onClick={() => onCheckSaleProductLot(sp)}
                      // name=""
                      readOnly
                      value={sp.qtityBack}
                    />
                  </td>
                  <td>{parseInt(sp.unitPrice)}</td>
                  <td>{sp.tva}</td>
                  <td>
                    <span onClick={() => onCheckSaleProductLot(sp)}>{reasons.find((x) => x.id === +sp.backReason)?.name}</span>
                  </td>
                  <td>{currencyFormatter(spAmount(sp))}</td>
                </tr>
              ))
            )}
            <tr className="fw-bold">
              <td colSpan={9}>Montant total</td>
              <td> {currencyFormatter(tobs.reduce((prev, curr) => prev + spAmount(curr), 0))}</td>
            </tr>
          </tbody>
        </Table>
        <div className="text-end">
          <Button onClick={onGenBack} variant="success" size="sm" className="text-uppercase">
            Confirmer le retour
          </Button>
          <Button onClick={() => navigate("/dash/sales/delivered")} variant="secondary" size="sm" className="text-uppercase mx-1">
            annuler
          </Button>
        </div>
      </div>

      <ModalBase
        icon="fas fa-pen"
        onCloseModal={() => setModal(false)}
        show={modal}
        title={sp?.product?.designation}
        content={<CheckSaleProductLot sp={sp} onValidedLot={onValidedLot} />}
      />
      <ModalConfirm
        content={"Veuillez choisir une quantité à retourner pour chaque product"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={() => setModalConfirm(false)}
        approveLabel={"ok"}
      />
    </>
  );
};

export default GenBackSale;
