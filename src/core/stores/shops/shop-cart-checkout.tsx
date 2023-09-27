import pipeTva from "../pipes/pipeTva";
import SearchProductModal from "../products/search-product-modal";
import BtnsShopCart from "./btns-shop-cart";
import hlpShop from "./hlpShop";
import ProformaAlert from "./proforma-alert";
import { useShopCartContext } from "./shop-cart-context";
import ShopSaleInfo from "./shop-sale-info";
import shopService from "./shopService";
import { currencyFormatter, inSteGrp, Sale, sesStorageGet, sesStorageSet, User } from "asv-hlps";
import { colToolTip, ModalBase, pathName, Toastify } from "asv-hlps-react";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { ADM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import DisplayPgTitle from "../../../shared/displays/DisplayPgTitle";

const ShopCartCheckout = () => {
  const getIsProforma = sesStorageGet("isProforma");
  const sale: Sale = sesStorageGet("sale");
  const [seller, setSeller] = useState({} as User);
  const [modalProducts, setModalProducts] = useState(false);
  const { removeAllFormCart, cartItems, client, setClient } = useShopCartContext();
  const navigate = useNavigate();
  const pathShop = pathName(useLocation());

  // --------------------

  const onDiscount = (item) => {};

  const onCheckout = () => {
    hlpShop.checkout(cartItems).then((data) => {
      navigate("/dash/shopcart");
      Toastify.success();
    });
  };

  useEffect(() => {
    if (["proformacheckout", "proformacart"].includes(pathShop)) {
      sesStorageSet("isProforma", "isProforma");
      sesStorageGet("isProforma");
    } else {
      sessionStorage.removeItem("isProforma");
    }
  });

  return (
    <>
      <DisplayPgTitle pgTitle={<span className="text-uppercase fw-bold">valider la commande</span>} />
      <ProformaAlert path={pathShop} isProforma={sesStorageGet("isProforma")} />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {/* {loading && <Loader />} */}
              {cartItems.length > 0 && sale && <ShopSaleInfo />}

              {cartItems.length > 0 && sale && (
                <Table responsive borderless className="table table-centered mb-0 table-sm table-bordered">
                  <thead>
                    <tr className="mb-0 mt-0">
                      <th scope="col">#</th>
                      <th scope="col">REF</th>
                      <th scope="col">Designation</th>
                      <th scope="col" style={{ width: "10%" }} className="text-center">
                        {colToolTip("QTE", "Quantite")}
                      </th>
                      <th scope="col" style={{ width: "7%" }} className="text-center">
                        {colToolTip("U.G", "Unités gratuites")}
                      </th>
                      {/* <!-- salePrice --> */}
                      <th scope="col" className="text-center">
                        {colToolTip("PU", "Prix unitaire")}
                      </th>
                      {/* <!-- speUnitPrice --> */}
                      {client?.isSpecial && (
                        <th style={{ width: "10%" }} scope="col">
                          {colToolTip(<i className="fa fa-user-plus"></i>, "Client spécial")}
                        </th>
                      )}
                      {/* <!-- tva--> */}
                      <th scope="col" className="text-center">
                        TVA
                      </th>
                      {/* <!-- getSubtotal --> */}
                      <th scope="col" className="text-center">
                        {colToolTip("MONTANT", "Montant hors tva")}
                      </th>
                      {/* <!-- publicPrice --> */}
                      {client && inSteGrp(["ph"], client) && (
                        <th className="text-center" scope="col">
                          {colToolTip("PP", "Prix Public")}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {React.Children.toArray(
                      (cartItems || []).map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>

                          {/* ref */}
                          <td>{item.product.ref}</td>
                          {/* designation */}
                          <td>
                            {item.product.designation}
                            <span className="ms-1">
                              {item.product.qtityWarning &&
                                item.qtityOdr === 0 &&
                                colToolTip(<i className="fas fa-exclamation-triangle text-warning"></i>, "Ajuster la Quantité")}
                            </span>
                            {authService.getAuth({ roles: [...ADM, "rcm"] }) && item.product.discountRate > 0 && (
                              <span onClick={() => onDiscount(item)} className={item.addDiscount ? "text-success" : "text-danger"}>
                                <i className="fas fa-money"></i> {Math.ceil(+item.product.discountRate) + " %"}
                              </span>
                            )}
                          </td>
                          {/* qtity */}
                          <td className="text-center">{item.qtityOdr}</td>
                          {/* qtityFree */}
                          <td className="text-center">{item.qtityFree}</td>
                          {/* unitPrice */}
                          <td className="text-center">
                            {currencyFormatter(shopService.unitPriceByClientCat(item.product, client, item.speUnitPrice, item.addDiscount))}
                          </td>
                          {/* speClientPrice */}
                          {client.isSpecial && <td className="text-center">{item.speUnitPrice}</td>}
                          {/* product montant tva  */}
                          <td className="text-center">
                            <span>
                              {Math.ceil(
                                pipeTva.tva(
                                  shopService.unitPriceByClientCat(item.product, client, item.speUnitPrice, item.addDiscount),
                                  +item.product.tva
                                ) * item.qtityOdr
                              )}
                            </span>
                          </td>

                          {/* total montant product  with tva  */}
                          <td className="text-center">
                            {currencyFormatter(
                              Math.ceil(
                                shopService.unitPriceByClientCat(item.product, client, item.speUnitPrice, item.addDiscount) * item.qtityOdr
                              )
                            )}
                          </td>
                          {/* publicPrice  */}
                          {client && inSteGrp(["ph"], client) && (
                            <td className="text-center">{currencyFormatter(+item.product.stores[0].publicPrice)}</td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
              {cartItems.length > 0 && (
                <BtnsShopCart
                  onDeleteSale={() => {
                    removeAllFormCart();
                    setClient(null);
                    navigate("/dash/shopcart");
                  }}
                  onCheckout={onCheckout}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ModalBase
        className={"bg-light"}
        size="xl"
        title={"produits"}
        show={modalProducts}
        onCloseModal={() => setModalProducts(false)}
        content={<SearchProductModal />}
      />
    </>
  );
};

export default ShopCartCheckout;
