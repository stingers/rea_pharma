import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { SaleProduct } from "asv-hlps/lib/cjs/models/entities/sales/SaleProduct";
import React, { useState } from "react";

import { PdfSaleTables } from "../../../pdfs/sales/PdfSaleTables";
import { SaleDefinition } from "../../../pdfs/sales/SaleDefinition";
import pdfService from "../../../services/pdfService";
import { Toastify } from "../../../shared/helpers/Toastify";

type TobType = {
  sale: Sale;
};

const ValidedSaleProduct = ({ sale }: TobType) => {
  const [btnSubmit, setBtnSubmit] = useState(false);

  const onGenPdf = (action: string) => {
    pdfService.generatePdf(action, SaleDefinition.generic(sale, PdfSaleTables.detailSaleForMagTable(sale.saleProducts)));
  };

  const onAddQtityFund = (sp: SaleProduct, qtityFund: number = 0) => {
    const totalQtity = +sp.qtityOdr + (+sp.qtityFree || 0);

    if (+qtityFund >= 0 && +qtityFund <= +totalQtity) {
      setBtnSubmit(true);
      const qtityDlvr = +sp.qtityFree === 0 ? qtityFund : +qtityFund - +sp.qtityFree;
      // --------------------
      const saleProduct = sale.saleProducts.find((x) => x.id === sp.id);
      saleProduct.qtityDlvr = +qtityDlvr;
      saleProduct.qtityFund = +qtityFund;
      // --------------------
      let countError = 0;
      sessionStorage.setItem("validedQtityDlr", JSON.stringify(sale));
      // ------ check cor ------
      const getSale: Sale = JSON.parse(sessionStorage.getItem("validedQtityDlr"));
      // --------------------
      for (const obj of getSale.saleProducts) {
        if (obj.qtityFund > +obj.qtityOdr + +obj.qtityFree) {
          countError++;
        }
      }
      if (countError > 0) {
        setBtnSubmit(false);
        Toastify.error("la Quantité entrée ne peut pas être supérieur à la quantité commandée");
        // modalService.confirmError("la Quantité entrée ne peut pas être supérieur à la quantité commandée");
      }
    } else if (qtityFund > totalQtity) {
      // countError++
      setBtnSubmit(false);
      Toastify.error("la Quantité entrée ne peut pas être supérieur à la quantité commandée");

      // modalService.confirmError("la Quantité entrée ne peut pas être supérieur à la quantité commandée");
    }
  };

  return <div>ValidedSaleProduct</div>;
};

export default ValidedSaleProduct;
