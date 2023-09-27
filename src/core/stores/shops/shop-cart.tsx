import { currencyFormatter, hasRole, inSteGrp, isStaffSte, Sale, sesStorageGet, sesStorageSet, User } from "asv-hlps";
import { colToolTip, ModalBase, pathName } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import SimpleBar from "simplebar-react";

import { ADM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import DisplayPgTitle from "../../../shared/displays/DisplayPgTitle";
import pipeTva from "../pipes/pipeTva";
import BtnOrderProduct from "../products/btn-order-product";
import SearchProductModal from "../products/search-product-modal";
import BtnsShopCart from "./btns-shop-cart";
import hlpShop from "./hlpShop";
import ProformaAlert from "./proforma-alert";
import { useShopCartContext } from "./shop-cart-context";
import shopService from "./shopService";

const ShopCart = () => {
  const getClient: User = sesStorageGet("client");
  const getSale: Sale = sesStorageGet("sale");
  // const [client, setClient] = useState(getClient);
  // const [clients, setClients] = useState<User[]>([getClient]);
  const [seller, setSeller] = useState(true);
  // const [sale, setSale] = useState<Sale>(getSale);
  // const location = useLocation();
  const pathShop = pathName(useLocation());
  const authUser: User = authService.authUser();

  const {
    removeItemFormCart,
    cartItems,
    modalProducts,
    onModalProducts,
    client,
    setClient,
    sale,
    setSale,
    setModalProducts,
    removeAllFormCart,
    clients,
    addSpeUnitPrice,
    addDiscount,
  } = useShopCartContext();

  // --------------------
  /* const fetchDatas = async () => {
    const { data } = await httpService.get("users");
    setClients(data);
  }; */

  useEffect(() => {
    if (["proformacheckout", "proformacart"].includes(pathShop)) {
      sesStorageSet("isProforma", "isProforma");
      sesStorageGet("isProforma");
    } else {
      sessionStorage.removeItem("isProforma");
    }
    // --------------------
    if (!isStaffSte(["cpa"], authUser.ste.name)) {
      setSeller(false);
      if (hasRole(["ceo"], authUser.role)) {
        sesStorageSet("client", authUser);
      } else {
        httpService.findById(authUser.clientId, "users").then((user) => {
          sesStorageSet("client", user);
        });
      }
      setClient(sesStorageGet("client"));
    }
    // --------------------
    setSale(getSale);
  }, [pathShop]);

  /* useEffect(() => {
    fetchDatas();
    return () => {};
  }, []); */
  // --------------------
  const onClientChange = (client) => {
    setClient(client);
    sesStorageSet("client", client);
  };

  const onDiscount = (item) => {
    addDiscount(cartItems, item);
  };

  const onAddSpeUnitPrice = (e, product) => {
    addSpeUnitPrice(product, e.target.value);
  };

  return (
    <>
      <DisplayPgTitle
        pgTitle={<span className="text-uppercase fw-bold">{pathShop === "proformacart" ? "créer un proforma" : "faire une commande"}</span>}
      />
      {/* {(pathShop === "proformacart" || getIsProforma) && <ProformaAlert />} */}
      <ProformaAlert path={pathShop} isProforma={sesStorageGet("isProforma")} />
      <Row>
        <Col>
          <Card>
            <Card.Body className="py-2 px-3 border-bottom border-light   ">
              <div className="d-flex py-1">
                {/* <img src={"selectedUser.avatar"} className="me-2 rounded-circle" height="36" alt="Brandon Smith" /> */}
                <div className="flex-1">
                  <h5 className="mt-0 mb-0 ">
                    <Row>
                      <Col>
                        <div className="row  align-items-center">
                          <div className="col-auto">
                            <label className="col-form-label">
                              <i className="fas fa-user"></i>
                            </label>
                          </div>
                          <div className="col-sm">
                            <Select
                              formatOptionLabel={(tob) => (
                                <span className="fw-bold">
                                  {tob.username} {tob.ste.name}
                                  <span className="text-info ms-2">
                                    <i className="fa fa-phone me-1"></i>
                                    {!tob.phoneS ? tob.phoneP : tob.phoneP + " / " + tob.phoneS}
                                  </span>
                                </span>
                              )}
                              getOptionLabel={(tob) => `${tob["username"]} (${tob["ste"]["name"]}) ${tob["phoneP"]}`}
                              options={clients}
                              onChange={onClientChange}
                              styles={{ menu: (base) => ({ ...base, minWidth: 300 }) }}
                              defaultValue={client ? clients.find((client) => client.id === getClient?.id) : null}
                              isOptionDisabled={(opt) => opt.disabled !== false}
                              isDisabled={!seller}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="align-items-center" onClick={onModalProducts}>
                          <span className="p-2 cursor-pointer">
                            {" "}
                            <i className="fas fa-pills pt-2"></i>
                          </span>
                        </div>
                      </Col>
                    </Row>
                    {/* {getSaleRef && ( */}
                    {/* {sale && (
                      <Row>
                        <Col className="text-center text-uppercase mt-2 fs-4 fw-bold text-info">{`Commande N° ${sale?.ref}`}</Col>
                      </Row>
                    )} */}
                    {/* <Row>
                      <Col className="my-2">
                        <SearchProduct />
                      </Col>
                      <Col></Col>
                    </Row> */}
                  </h5>
                </div>
                <div>
                  {/* <OverlayTrigger placement="top" overlay={<Tooltip id="">Voice Call</Tooltip>}>
                    <Link to="#" className="text-reset font-19 py-1 px-2 d-inline-block">
                      <i className="fe-phone-call"></i>
                    </Link>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip id="">Video Call</Tooltip>}>
                    <Link to="#" className="text-reset font-19 py-1 px-2 d-inline-block">
                      <i className="fe-video"></i>
                    </Link>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip id="">Add Users</Tooltip>}>
                    <Link to="#" className="text-reset font-19 py-1 px-2 d-inline-block">
                      <i className="fe-user-plus"></i>
                    </Link>
                  </OverlayTrigger> */}
                  <DisplayTooltip content={"supprimer la commande"}>
                    <span onClick={() => removeAllFormCart()} className="text-reset font-19 py-1 px-2 d-inline-block">
                      <i className="fe-trash-2"></i>
                    </span>
                  </DisplayTooltip>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              {/* {loading && <Loader />} */}

              <SimpleBar style={{ maxHeight: "465px", width: "100%", overflowX: "hidden" }}>
                {/* {cartItems.length > 0 && sale && ( */}
                {cartItems.length > 0 && (
                  <Table responsive borderless className="table-centered mb-0 table-sm">
                    <thead>
                      <tr className="mb-0 mt-0">
                        <th scope="col">#</th>
                        <th scope="col" style={{ width: "3%" }}>
                          <i className="fa fa-trash"></i>
                        </th>
                        {/* <th scope="col">REF</th> */}
                        <th scope="col">Designation</th>
                        <th scope="col" style={{ width: "15%" }} className="text-center">
                          {colToolTip("QTE", "Quantite")}
                        </th>
                        <th scope="col" style={{ width: "7%" }} className="text-center">
                          {colToolTip("U.G", "Unités gratuites")}
                        </th>
                        {/* <!-- salePrice --> */}
                        <th scope="col">{colToolTip("PU", "Prix unitaire")}</th>
                        {/* <!-- speUnitPrice --> */}
                        {client?.isSpecial && (
                          <th style={{ width: "10%" }} scope="col">
                            {colToolTip(<i className="fa fa-user-plus"></i>, "Client spécial")}
                          </th>
                        )}
                        {/* <!-- tva--> */}
                        <th scope="col"> TVA</th>
                        {/* <!-- getSubtotal --> */}
                        <th scope="col">{colToolTip("MONTANT", "Montant hors tva")}</th>
                        {/* <!-- publicPrice --> */}

                        {client && inSteGrp(["ph"], client) && <th scope="col">{colToolTip("PP", "Prix Public")}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {React.Children.toArray(
                        (cartItems || []).map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <span onClick={() => removeItemFormCart(item.product)}>
                                <i className="fas fa-trash text-danger"></i>
                              </span>
                            </td>
                            {/* ref */}
                            {/* <td>{item.product.ref}</td> */}
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
                            <td width={"20%"}>
                              <BtnOrderProduct product={item.product} item={item} />
                            </td>
                            {/* qtityFree */}
                            <td className="text-center">
                              <input
                                className="form-control forn-control-sm py-0 px-1 text-center"
                                aria-describedby="inputGroup-sizing-sm"
                                name="qtityFree"
                                disabled={!item.product.hasPromo}
                                value={item.qtityFree}
                                readOnly
                              />
                            </td>
                            {/* unitPrice */}
                            <td>
                              {currencyFormatter(hlpShop.unitPriceByClientCat(item.product, client, item.speUnitPrice, item.addDiscount))}
                            </td>
                            {/* speClientPrice */}
                            {client?.isSpecial && (
                              <td>
                                <input
                                  onKeyUp={(e) => onAddSpeUnitPrice(e, item.product)}
                                  className="form-control form-control-sm  input-number"
                                  name="speUnitPrice"
                                  disabled={!client.isSpecial}
                                  aria-label="Small"
                                  aria-describedby="inputGroup-sizing-sm"
                                  defaultValue={item.speUnitPrice}
                                />
                              </td>
                            )}
                            {/* product montant tva  */}
                            <td>
                              <span>
                                {currencyFormatter(
                                  Math.ceil(
                                    pipeTva.tva(
                                      shopService.unitPriceByClientCat(item.product, client, item.speUnitPrice, item.addDiscount),
                                      +item.product.tva
                                    ) * item.qtityOdr
                                  )
                                )}
                              </span>
                            </td>
                            {/* total montant product  with tva  */}
                            <td>
                              {client &&
                                currencyFormatter(
                                  Math.ceil(
                                    shopService.unitPriceByClientCat(item.product, client, item.speUnitPrice, item.addDiscount) *
                                      item.qtityOdr
                                  )
                                )}
                            </td>
                            {/* publicPrice  */}
                            {/* {client && shopService.ppPhcie(client) && <td>{+item.product.stores[0].publicPrice}</td>} */}
                            {client && inSteGrp(["ph"], client) && <td>{currencyFormatter(+item.product.stores[0].publicPrice)}</td>}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </SimpleBar>
              {/* {cartItems.length > 0 && sale && ( */}
              {cartItems.length > 0 && (
                <BtnsShopCart
                  onDeleteSale={() => {
                    setClient(null);
                    removeAllFormCart();
                  }}
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

export default ShopCart;
