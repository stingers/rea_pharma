import { dateFormatter, getPeriodDateColor, isStaffSte, Product, ProductIn, removeDuplicateObjects } from "asv-hlps";
import { BtnAction, ModalBase, Toastify } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import classNames from "classnames";
import React, { useState } from "react";
import { Card, Table } from "react-bootstrap";

import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import DisplayPopover from "../../../shared/displays/display-popover";
import AdditStrNbrSelect from "../../../shared/forms/addit-str-nbr-select";
import { useShopCartContext } from "../shops/shop-cart-context";
import BtnOrderProduct from "./btn-order-product";
import hlpProduct from "./helpers/hlpProduct";
import LinkCardProduct from "./link-card-product";
import ListProductSubstitue from "./list-product-subtitue";
import OrderQityPerPackaging from "./order-qity-per-packaging";
import ProductPromoNotif from "./product-promo-notif";

type TobType = { product: Product; onUpdateStockReserved?: (product: Product) => void };

const authUser = authService.authUser();

const InputProduct = ({ product, onUpdateStockReserved }: TobType) => {
  // const shopCartItems: CartItem[] = sesStorageGet("basket");
  // const {cartItems} = useShopCartContext()
  const [modal, setModal] = useState(false);
  const [modalWanted, setModalWanted] = useState(false);
  // const { onClose } = useContext(ActionContext);
  // const { closeShopModal } = useContext(ShopCloseModal);

  const { setModalProducts } = useShopCartContext();

  const onDrop = async (evt) => {
    switch (evt.id) {
      case 1:
        try {
          await httpService.postId(product.stores[0].id, "productstores/updateStockReserved");
          Toastify.success();
        } catch (error) {
          Toastify.error();
        }

        break;
    }
  };

  const onProductSubstitute = () => {
    setModal(true);
  };

  const onWanted = () => {
    setModalWanted(true);
  };

  const onAddWanted = async (prop) => {
    setModalWanted(false);
    const wanted = { productId: product.id, nbr: prop.nbr };
    try {
      const { data } = await httpService.postBody(wanted, "productwanted/new");
      if (data) {
        Toastify.success();
      }
    } catch (error) {
      Toastify.error();
    }
  };

  const onCloseWantedModal = async () => {
    setModalWanted(false);
    const wanted = { productId: product.id, nbr: 1 };
    try {
      const { data } = await httpService.postBody(wanted, "productwanted/new");
      if (data) {
        Toastify.success();
      }
    } catch (error) {
      Toastify.error();
    }
  };

  const getColor = (pdtIn: ProductIn) => {
    if (!pdtIn) {
      return "secondary";
    }
    return getPeriodDateColor(pdtIn.expirationDate);
  };

  const expDateTable = () => {
    const ins = removeDuplicateObjects(product.ins, "lot");
    return (
      <span className="mx-2">
        <DisplayPopover
          title={"Date de péremption"}
          content={
            <Table className="table-sm table-striped">
              <thead>
                <tr>
                  <td>DATE</td>
                  <td>LOT</td>
                </tr>
              </thead>
              <tbody>
                {React.Children.toArray(
                  ins.map((pdt) => (
                    <tr>
                      <th>{dateFormatter(pdt.expirationDate)}</th>
                      <th>{pdt.lot}</th>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          }>
          <i className="far fa-calendar-times"></i>
        </DisplayPopover>
      </span>
    );
  };

  return (
    // <Card className=" shadow border border-success border-3 border-end-0 border-top-0 border-bottom-0">
    <Card
      className={classNames("border-" + getColor(product?.ins[0]), "shadow border  border-3 border-end-0 border-top-0 border-bottom-0")}>
      {/* <Card.Body className="py-1 pe-3"> */}
      <Card.Body className="p-1 ">
        {/* <div className={classNames("ribbon", "ribbon-primary", "float-start")}>
          <i className="mdi mdi-access-point me-1"></i> {product.designation}
        </div> */}
        {product.stores[0].promos.length > 0 && <ProductPromoNotif promos={product.stores[0].promos} />}

        {/* <h5 className={classNames("text-primary", "mt-0", "float-end")}>
          <Dropdown>
            <Dropdown.Toggle as="a" className="cursor-pointer text-body">
              <i className="mdi mdi-dots-vertical font-20"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item>Action</Dropdown.Item>
              <Dropdown.Item>Another action</Dropdown.Item>
              <Dropdown.Item>Something else here</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </h5> */}

        <div className="d-flex align-items-start">
          {/* <div className="avatar-md">
              <div className="avatar-title bg-light rounded-circle">
                <img src={image4} alt="" className="avatar-sm rounded-circle me-0" />
              </div>
            </div> */}
          <div className="flex-1">
            <div className="row">
              <div className="col">
                <Card.Title as="h5" className="mb-2 fw-bold text-black">
                  {product.dci ? (
                    <DisplayPopover title={"DCI"} content={product.dci?.name} placement="top">
                      <LinkCardProduct product={product} />
                    </DisplayPopover>
                  ) : (
                    <LinkCardProduct product={product} />
                  )}

                  {product.ins.length && isStaffSte(["cpa", "eqeer"], authUser.ste.name) && expDateTable()}
                  <span className="float-end " onClick={() => setModalProducts(false)}>
                    <i className="fas fa-times text-muted small"></i>
                  </span>
                </Card.Title>
                <Card.Subtitle as="h6" className="text-muted">
                  {product.ref}
                  <OrderQityPerPackaging product={product} />
                  {/* <!-- qtityLimit --> */}
                  {product?.stores[0]?.qtityLimit > 0 && <span className="text-warning ms-3"> QL : {product.stores[0].qtityLimit}</span>}
                  {/* orthers */}
                  {authService.getAuth({ roles: [...PHD, "tlm", "com", "sec", "rcm"] }) && (
                    // <!-- stock salable -->
                    <>
                      <DisplayTooltip content={"Stock magasin"}>
                        <span className="mx-2 text-warning">
                          Stock:
                          <span className="ms-1">{hlpProduct.stock(product, "salable")}</span>
                        </span>
                      </DisplayTooltip>
                      {/* <!-- stockReserved --> */}
                      <DisplayTooltip content={"Quantité réservée"}>
                        <>
                          {!authService.getAuth({ roles: PHD }) ? (
                            <span className="text-warning">QR: {product.stores[0].stockReserved}</span>
                          ) : (
                            <BtnAction
                              tob={product}
                              elpDrop
                              dropMenu={{
                                drops: [{ id: 1, label: "mettre à jour", icon: "fas fa-wrench" }],
                                label: (
                                  <DisplayTooltip content={"Quantité réservée"}>
                                    <span className="text-warning">QR: {product.stores[0].stockReserved}</span>
                                  </DisplayTooltip>
                                ),
                              }}
                              onDrop={onDrop}
                            />
                          )}
                        </>
                      </DisplayTooltip>
                      {/* <!-- reserves other depots --> */}
                      {hlpProduct.qtityInAllDepotsExeptStore(product.ins) > 0 &&
                        authService.getAuth({ roles: [...PHD, "tlm", "com", "sec", "rcm"] }) && (
                          <DisplayTooltip content={"Reserve depots"}>
                            <span className="ms-2 text-info">R: {hlpProduct.stock(product, "reserve")}</span>
                          </DisplayTooltip>
                        )}
                    </>
                  )}
                </Card.Subtitle>
                <hr className="my-1" />
                {/* <span className="text-muted text-truncate mb-0">
                  <i className="ri-map-pin-line align-bottom me-1"></i> {product.ref}
                </span> */}

                {!product.stores[0].isAvailable && !authService.getAuth({ client: { roles: ["ceo"] } }) && (
                  <DisplayTooltip content={"Produit demandé"}>
                    <span onClick={onWanted} className="ms-2">
                      <i className="fab fa-wpexplorer text-danger"></i>
                    </span>
                  </DisplayTooltip>
                )}
                <div className="float-end">
                  {!product.stores[0].isAvailable && product.dci && product.fg && (
                    <DisplayTooltip content={"Produit(s) similaires en stock"}>
                      <span onClick={onProductSubstitute}>
                        <i className="me-1 far fa-clone text-success"></i>
                      </span>
                    </DisplayTooltip>
                  )}
                  <BtnOrderProduct product={product} />
                  {/* <BtnOrderProduct item={item ? item : null} /> */}
                </div>
              </div>
              {/* <div className="col-4">
                  <span className="btn btn-sm btn-primary">commander</span>
                </div> */}
            </div>
          </div>
        </div>

        {/* <div className="text-muted">
          <div className="row">
            <div className="col-6">
              <p className="text-truncate mb-0">Revenue (USD)</p>
              <h5 className="mb-sm-0">{"item.revenue"}</h5>
            </div>
            <div className="col-6">
              <p className="text-truncate mb-0">Number of employees</p>
              <h5 className="mb-sm-0">{"po"}</h5>
            </div>
          </div>
        </div> */}
      </Card.Body>
      <ModalBase
        size="lg"
        title={`${product.designation} (${product?.dci?.name})`}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<ListProductSubstitue product={product} />}
      />
      <ModalBase
        title={`${product.designation} `}
        icon={"fas fa-open"}
        show={modalWanted}
        onCloseModal={onCloseWantedModal}
        content={<AdditStrNbrSelect schema="nbr" label={"quantite"} onSubmitForm={onAddWanted} />}
      />
    </Card>
  );
};

export default InputProduct;
