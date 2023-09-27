import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, colToolTip, FormField, FormFieldReactSelect, useQueryAdd, useQueryUpdate } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import {
  Product,
  ProductCat,
  ProductDci,
  ProductDos,
  ProductFg,
  ProductLoc,
  ProductSof,
  ProductTcl,
} from "asv-hlps/lib/cjs/models/entities/products";
import { User } from "asv-hlps/lib/cjs/models/entities/users/User";
import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../services/httpService";
import hlpProduct from "./helpers/hlpProduct";
import { ProductSchema } from "./product-form";

type TobType = {
  productId?: number;
  onSubmitForm?;
  onCancelForm?;
  tob?: Product;
};

const formEdit = (tob) => {
  tob.catId = tob.cat?.id;
  tob.sofId = tob.sof?.id;
  tob.dciId = tob.dci?.id;
  tob.dosId = tob.dos?.id;
  tob.agcyId = tob.agcy?.id;
  tob.pvdId = tob.pvd?.id;
  tob.locId = tob.loc?.id;
  tob.laboId = tob.labo?.id;
  tob.tclId = tob.tcl?.id;
  tob.store = tob?.stores[0];
  return tob;
};

// productId, "products/edit"

const AdditProduct = ({ tob, onSubmitForm, onCancelForm, productId }: TobType) => {
  const { tobs: cats } = useReadonlyFetchTobs(httpService, "productcats");
  const [selectedCat, setSelectedCat] = useState<ProductCat>(null);
  const { tobs: dcis } = useReadonlyFetchTobs(httpService, "productdcis");
  const [selectedDci, setSelectedDci] = useState<ProductDci>();
  const { tobs: sofs } = useReadonlyFetchTobs(httpService, "productsofs");
  const [selectedSof, setSelectedSof] = useState<ProductSof>();
  const { tobs: doss } = useReadonlyFetchTobs(httpService, "productdosages");
  const [selectedDos, setSelectedDos] = useState<ProductDos>();
  const { tobs: pvds } = useReadonlyFetchTobs(httpService, "users/menu/pvds");
  const [selectedPvd, setSelectedPvd] = useState<User>(tob ? tob.pvd : null);
  const { tobs: agcys } = useReadonlyFetchTobs(httpService, "users/menu/agcys");
  const [selectedAgcy, setSelectedAgcy] = useState<User>();
  const { tobs: labos } = useReadonlyFetchTobs(httpService, "users/menu/labos");
  const [selectedLabo, setSelectedLabo] = useState<User>();
  const { tobs: locs } = useReadonlyFetchTobs(httpService, "productlocs");
  const [selectedLoc, setSelectedLoc] = useState<ProductLoc>();
  const { tobs: tcls } = useReadonlyFetchTobs(httpService, "producttcls");
  const [selectedTcl, setSelectedTcl] = useState<ProductTcl>();
  const { tobs: fgs } = useReadonlyFetchTobs(httpService, "productfgalenics");
  const [selectedFg, setSelectedFg] = useState<ProductFg>();
  // --------------------
  const [pght, setPght] = useState<number>(tob?.store?.pght || 0);
  const [pvdPrice, setPvdPrice] = useState<number>(tob?.store?.pvdPrice || 0);
  const [fees, setFees] = useState<number>(tob?.store?.fees || 0);
  const [profit, setProfit] = useState<number>(tob?.store?.profit || 0);
  const [profitPhcie, setProfitPhcie] = useState<number>(tob?.store?.profitPhcie || 0);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    getValues,
    reset,
    setValue,
    watch,
    // } = useForm<ProductForm>({
  } = useForm<FormType>({
    defaultValues: tob ? formEdit(tob) : {},
    resolver: yupResolver<any>(ProductSchema),
    mode: "onChange",
  });

  type FormType = yup.InferType<typeof ProductSchema>;

  // --------------------

  const getPvdPrice = (e) => {
    setPvdPrice(+e.target.value);
  };
  const getPght = (e) => {
    setPght(+e.target.value);
  };
  const getFees = (e) => {
    setFees(+e.target.value);
  };
  const getProfit = (e) => {
    setProfit(+e.target.value);
  };
  const getProfitPhcie = (e) => {
    setProfitPhcie(+e.target.value);
  };
  /* start: queries -------------------------------------- */
  const addProduct = useQueryAdd(httpService, ["products"], "products/new");
  const editProduct = useQueryUpdate(httpService, ["products"], "products/edit");

  const formSubmit = (tobValues) => {
    tobValues.id ? editProduct.mutate(tobValues) : addProduct.mutate(tobValues);

    onSubmitForm(tobValues);
    reset();
  };

  /* end: queries ---------------------------------------- */

  const calculPghtPrice = () => {
    return pvdPrice * pght;
    // return watchPvdPrice * watchCoef;
  };

  const calculCostPrice = () => {
    // return calculPghtPrice() * getValues("store.fees");
    return calculPghtPrice() * fees;
  };

  const calculSalePrice = (): number => {
    // return calculCostPrice() * getValues("store.profit");
    return calculCostPrice() * profit;
  };

  const calculPuplicPrice = (): number => {
    // return calculSalePrice() * getValues("store.profitPhcie");
    return calculSalePrice() * profitPhcie;
  };

  // --------------------
  const productTarification = () => {
    // const watchPvdPrice = watch("store.pvdPrice");

    return (
      <Row className="bg-light mt-2 ">
        <h5 className="mb-2 text-uppercase bg-light p-2">
          <i className="fas fa-map-marked-alt"></i> Tarification
        </h5>
        <Row>
          {/* <!-- pvdPrice --> */}
          <Col md={4}>
            <FormField
              addon
              name={"store.pvdPrice"}
              labelColSize={2}
              control={control}
              onChange={(e) => getPvdPrice(e)}
              errors={errors}
              label={colToolTip("P.F", "Prix fournisseur")}
              register={register}
              defaultValue={tob ? tob.store.pvdPrice : 0}
              // value={pghtPrice}
            />
          </Col>
          {/* <!-- pght --> */}
          <Col md={4}>
            <FormField
              addon
              name={"store.pght"}
              control={control}
              errors={errors}
              onChange={(e) => getPght(e)}
              label={colToolTip("Coef", "Coef pght")}
              register={register}
              defaultValue={tob ? tob?.store?.pght : 0}
            />
          </Col>
          {/* <!-- calcul pghtPrice --> */}
          <Col md={4}>
            <FormField addon value={calculPghtPrice()} label={colToolTip("PGHT", "Prix pght")} disabled />
          </Col>
        </Row>
        <Row>
          {/* <!-- calcul pghtPrice --> */}
          <Col md={4}>
            <FormField addon value={calculPghtPrice()} label="pght" disabled />
          </Col>
          {/* <!-- fees --> */}
          <Col md={4}>
            <FormField
              addon
              name={"store.fees"}
              // name={"store.pvdPrice"}
              onChange={(e) => getFees(e)}
              labelColSize={3}
              control={control}
              errors={errors}
              label={colToolTip("F.F.D", "Frêt Formalités douanières")}
              register={register}
              defaultValue={tob ? tob?.store?.fees : 0}
            />
          </Col>
          <Col md={4}>
            <FormField label={colToolTip("P.R", "Prix de reviens")} addon value={calculCostPrice()} disabled />
          </Col>
        </Row>
        {/* calculCostPrice */}
        <Row>
          <Col md={3}>
            <FormField label={colToolTip("P.R", "Prix de reviens")} addon value={calculCostPrice()} disabled />
          </Col>
          <Col md={3}>
            <FormField
              addon
              name={"store.profit"}
              onChange={(e) => getProfit(e)}
              labelColSize={5}
              control={control}
              errors={errors}
              label={<span>Marge</span>}
              register={register}
              defaultValue={tob ? tob?.store?.profit : 0}
            />
          </Col>
          <Col md={3}>
            <FormField addon value={calculSalePrice()} label={colToolTip("P.C", "Prix de cession")} disabled />
          </Col>
          {/* <!-- taux de marque --> */}
          <Col md={3}>
            <FormField addon labelColSize={4} value={calculSalePrice()} label={colToolTip("T.M", "Taux de marge")} disabled />
          </Col>
        </Row>
        {/* calculSalePrice */}
        <Row>
          <Col md={4}>
            <FormField addon value={calculSalePrice()} label={colToolTip("P.C", "Prix de cession")} disabled />
          </Col>
          {/* <!-- start: marge pharmacien --> */}
          <Col md={4}>
            <FormField
              addon
              name={"store.profitPhcie"}
              onChange={(e) => getProfitPhcie(e)}
              labelColSize={3}
              control={control}
              errors={errors}
              label={colToolTip("M.P", "Marge Pharmacien")}
              register={register}
              defaultValue={tob ? tob?.store?.profitPhcie : 0}
            />
          </Col>
          {/* <!-- publicPrice --> */}
          <Col md={4}>
            <FormField addon value={calculPuplicPrice()} label={colToolTip("P.P", "Prix public")} disabled />
          </Col>
        </Row>
        {/* tva */}
        <Row>
          <Col md={4}>
            <FormField
              addon
              name={"tva"}
              // name={"store.pvdPrice"}
              labelColSize={3}
              control={control}
              errors={errors}
              register={register}
              label={<span>TVA</span>}
              defaultValue={tob ? tob?.tva : 0}
            />
          </Col>
          <Col md={4}>
            <FormField
              addon
              name={"store.discountRate"}
              // name={"store.pvdPrice"}
              labelColSize={6}
              control={control}
              errors={errors}
              register={register}
              label={<span>Remise en %</span>}
              defaultValue={tob ? tob?.store?.discountRate : 0}
            />
          </Col>
          <Col md={4}>
            <FormField
              addon
              name={"store.publicPrice"}
              // name={"store.pvdPrice"}
              labelColSize={6}
              control={control}
              errors={errors}
              register={register}
              label={<span>Prix réel</span>}
              defaultValue={tob ? tob?.store?.publicPrice : 0}
            />
          </Col>
        </Row>
      </Row>
    );
  };

  useEffect(() => {
    calculPghtPrice();
    calculCostPrice();
    calculSalePrice();
    calculPuplicPrice();
  }, [setValue, pght, pvdPrice, fees, profit, profitPhcie]);

  const productStock = () => {
    return (
      <Row className="bg-light mt-2 ">
        <h5 className="mb-2 text-uppercase bg-light p-2">
          <i className="fas fa-map-marked-alt"></i> Stock
        </h5>

        <Row>
          {/* <!-- stock --> */}
          <Col md={6}>
            <FormField addon value={tob ? hlpProduct.stock(tob, "all") : 0} label={<span>Stock</span>} disabled />
          </Col>
          {/* <!-- stockLimit --> */}
          <Col md={6}>
            <FormField
              addon
              name={"store.stockLimit"}
              labelColSize={6}
              control={control}
              errors={errors}
              label={<span>Stock limit</span>}
              register={register}
              defaultValue={tob ? tob?.store?.stockLimit : 0}
            />
          </Col>
        </Row>
        <Row>
          {/* <!-- stockReserved --> */}
          <Col md={6}>
            <FormField labelColSize={6} addon value={tob?.store?.stockReserved || 0} label={<span>Stock réservé</span>} disabled />
          </Col>
          {/* <!-- stockSalable --> */}
          <Col md={6}>
            <FormField labelColSize={6} addon value={tob?.store?.stockSalable || 0} label={<span>Stock vendable</span>} disabled />
          </Col>
        </Row>
        <Row>
          {/* <!-- stockMax--> */}
          <Col md={6}>
            <FormField
              addon
              name={"store.stockMax"}
              labelColSize={6}
              control={control}
              errors={errors}
              label={<span>Stock max</span>}
              register={register}
              defaultValue={tob ? tob?.store?.stockMax : 0}
            />
          </Col>
          {/* <!-- stockReap--> */}
          <Col md={6}>
            <FormField
              addon
              name={"store.stockReappro"}
              labelColSize={6}
              control={control}
              errors={errors}
              label={<span>Stock de reapro</span>}
              register={register}
              defaultValue={tob ? tob?.store?.stockReap : 0}
            />
          </Col>
        </Row>
      </Row>
    );
  };
  const productQtities = () => {
    return (
      <Row className="bg-light mt-2 ">
        <h5 className="mb-2 text-uppercase bg-light p-2">
          <i className="fas fa-map-marked-alt"></i> quantités
        </h5>

        <Row>
          {/* <!-- qtityLimit--> */}
          <Col md={4}>
            <FormField
              addon
              name={"store.qtityLimit"}
              labelColSize={8}
              control={control}
              errors={errors}
              label={<span>Qtite limité par client</span>}
              register={register}
              defaultValue={tob ? tob?.store?.qtityLimit : 0}
            />
          </Col>
          {/* <!-- qtityPerBox--> */}
          <Col md={4}>
            <FormField
              addon
              name={"qtityPerBox"}
              labelColSize={8}
              control={control}
              errors={errors}
              label={<span>Qtite par boite</span>}
              register={register}
              defaultValue={tob ? tob?.qtityPerBox : 0}
            />
          </Col>
          {/* <!-- qtityPerPackaging--> */}
          <Col md={4}>
            <FormField
              addon
              name={"qtityPerPackaging"}
              labelColSize={8}
              control={control}
              errors={errors}
              label={<span>Qtite par Carton</span>}
              register={register}
              defaultValue={tob ? tob?.qtityPerPackaging : 0}
            />
          </Col>
        </Row>
      </Row>
    );
  };

  const productStatus = () => {
    return (
      <Row className="bg-light mt-2 ">
        <h5 className="mb-2 text-uppercase bg-light p-2">
          <i className="fas fa-map-marked-alt"></i> Statut
        </h5>

        <Row>
          {/* <!-- isActive --> */}

          <Col>
            <Form.Check label="Active" {...register("store.isActive")} defaultChecked={true} />

            {/* <FormField
                type="checkbox"
                name={"store.isActive"}
                // labelColSize={8}
                control={control}
                errors={errors}
                label={"Actif"}
                register={register}
                defaultValue={tob ? tob.store.isActive : null}
              /> */}
          </Col>

          {/* <!-- isAvailable --> */}
          <Col>
            <Form.Check label="Disponible" {...register("store.isAvailable")} />
            {/* <FormField
              type="checkbox"
              name={"store.isAvailable"}
              // labelColSize={8}
              control={control}
              errors={errors}
              label={"Disponible"}
              register={register}
              defaultValue={tob ? tob.store.isAvailable : null}
            /> */}
          </Col>
          {/* <!-- inPharma --> */}
          <Col>
            <Form.Check label="En pharmacie" {...register("inPharma")} />

            {/* <FormField
              type="checkbox"
              name={"inPharma"}
              // labelColSize={8}
              control={control}
              errors={errors}
              label={"En pharmacie"}
              register={register}
              // defaultValue={tob ? tob.inPharma : null}
            /> */}
          </Col>
          {/* <!-- inEqeer --> */}
          <Col>
            <Form.Check label="En eqeer" {...register("inEqeer")} />

            {/* <FormField
              type="checkbox"
              name={"inEqeer"}
              // labelColSize={8}
              control={control}
              errors={errors}
              label={"En eqeer"}
              register={register}
              defaultValue={tob ? tob.inEqeer : null}
            /> */}
          </Col>
          {/* <!-- isPublished --> */}
          <Col>
            <Form.Check label="Publié" {...register("store.isPublished")} />

            {/* <FormField
              type="checkbox"
              name={"store.isPublished"}
              // labelColSize={8}
              control={control}
              errors={errors}
              label={"Publié"}
              register={register}
            /> */}
          </Col>
        </Row>
      </Row>
    );
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Row className="bg-light">
        <h5 className="mb-2 text-uppercase p-2">
          <i className="fas fa-house-user"></i> Info
        </h5>
        <Col md={6}>
          <FormField name={"ref"} control={control} errors={errors} label="reférence" register={register} labelColSize={4} />
        </Col>

        <Col md={6}>
          <FormField
            labelColSize={4}
            name={"codeCompta"}
            control={control}
            errors={errors}
            label="Code compta"
            register={register}
            requiredStar={false}
          />
        </Col>

        <Col md={12}>
          <FormField labelColSize={2} name={"designation"} control={control} errors={errors} label="designation" register={register} />
        </Col>
        {/* <Col md={4}>
          <FormField labelColSize={3} name={"ref"} control={control} errors={errors} label="ref" register={register} />
        </Col> */}
        {/* catId */}
        <Col md={6} className={"pb-0"}>
          <FormFieldReactSelect
            label={"categories"}
            onChange={(tob) => {
              setValue("catId", tob.id);
              setSelectedCat(tob);
            }}
            labelColSize={4}
            valueProp="name"
            options={cats}
            selected={selectedCat}
            name="catId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.cat : null}
            // defaultValue={tob ? selectedCat : null}
            // className={"pb-0"}
          />
        </Col>
        {/* dciId */}
        <Col md={6} className={"mb-0"}>
          <FormFieldReactSelect
            label={"dci"}
            valueProp="name"
            onChange={(tob) => {
              setValue("dciId", tob.id);
              setSelectedDci(tob);
            }}
            labelColSize={4}
            options={dcis}
            selected={selectedDci}
            name="dciId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.dci : null}
            requiredStar={false}
          />
        </Col>
        {/* sofId */}
        <Col md={6}>
          <FormFieldReactSelect
            label={"format"}
            valueProp="name"
            onChange={(tob) => {
              setValue("sofId", tob.id);
              setSelectedSof(tob);
            }}
            labelColSize={4}
            options={sofs}
            selected={selectedSof}
            name="sofId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.sof : null}
          />
        </Col>
        {/* agence */}
        <Col md={6}>
          <FormFieldReactSelect
            formatLabel={(opt) => `${opt["ste"]["name"]}`}
            label={"agence"}
            onChange={(tob) => {
              setValue("agcyId", tob.id);
              setSelectedAgcy(tob);
            }}
            labelColSize={4}
            options={agcys}
            selected={selectedAgcy}
            name="agcyId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.agcy : null}
          />
        </Col>
        {/* pvd */}
        <Col md={6}>
          <FormFieldReactSelect
            formatLabel={(opt) => `${opt["ste"]["name"]}`}
            label={"fournisseur"}
            onChange={(tob) => {
              setValue("pvdId", tob.id);
              setSelectedPvd(tob);
            }}
            labelColSize={4}
            options={pvds}
            selected={selectedPvd}
            name="pvdId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.pvd : null}
          />
        </Col>
        {/* labo */}
        <Col md={6}>
          <FormFieldReactSelect
            formatLabel={(opt) => `${opt["ste"]["name"]}`}
            label={"labo"}
            onChange={(tob) => {
              setValue("laboId", tob.id);
              setSelectedLabo(tob);
            }}
            labelColSize={4}
            options={labos}
            selected={selectedLabo}
            name="laboId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.labo : null}
          />
        </Col>
        {/* dosage */}
        <Col md={6}>
          <FormFieldReactSelect
            label={"dosage"}
            onChange={(tob) => {
              setValue("dosId", tob.id);
              setSelectedDos(tob);
            }}
            labelColSize={4}
            options={doss}
            selected={selectedDos}
            name="dosId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.dos : null}
            requiredStar={false}
          />
        </Col>
        {/* locId */}
        <Col md={6}>
          <FormFieldReactSelect
            label={"emplacement"}
            onChange={(tob) => {
              setValue("locId", tob.id);
              setSelectedLoc(tob);
            }}
            labelColSize={4}
            options={locs}
            selected={selectedLoc}
            name="locId"
            errors={errors}
            control={control}
            requiredStar={false}
            defaultValue={tob ? tob.loc : null}
          />
        </Col>
        {/* fgId */}
        <Col md={6}>
          <FormFieldReactSelect
            // formatLabel={(opt) => `${opt["ste"]["name"]}`}
            label={"F.galenique"}
            onChange={(tob) => {
              setValue("fgId", tob.id);
              setSelectedFg(tob);
            }}
            labelColSize={4}
            options={fgs}
            selected={selectedFg}
            name="fgId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.fg : null}
            requiredStar={false}
          />
        </Col>
        {/* tclId */}
        <Col md={6}>
          <FormFieldReactSelect
            // formatLabel={(opt) => `${opt["ste"]["name"]}`}
            label={"cl.therapeutique"}
            onChange={(tob) => {
              setValue("tclId", tob.id);
              setSelectedTcl(tob);
            }}
            labelColSize={4}
            options={tcls}
            selected={selectedTcl}
            name="tclId"
            errors={errors}
            control={control}
            requiredStar={false}
            defaultValue={tob ? tob.tcl : null}
          />
        </Col>
        {/* codeHs */}
        <Col md={6}>
          <FormField
            labelColSize={4}
            name={"codeHs"}
            control={control}
            errors={errors}
            label="Code Hs"
            register={register}
            requiredStar={false}
            defaultValue={tob ? tob.codeHs : null}
          />
        </Col>
        {/* codeInam */}
        <Col md={6}>
          <FormField
            labelColSize={4}
            name={"codeInam"}
            control={control}
            errors={errors}
            label="Code Inam"
            register={register}
            requiredStar={false}
            defaultValue={tob ? tob.condeInam : null}
          />
        </Col>
        {/* codeEan */}
        <Col md={6}>
          <FormField
            labelColSize={4}
            name={"codeEan"}
            control={control}
            errors={errors}
            label="Code EAN"
            register={register}
            requiredStar={false}
            defaultValue={tob ? tob.codeEan : null}
          />
        </Col>
        {/* codeCip7 */}
        <Col md={6}>
          <FormField
            labelColSize={4}
            name={"codeCip7"}
            control={control}
            errors={errors}
            label="Code cip 7"
            register={register}
            requiredStar={false}
            defaultValue={tob ? tob.codeCip7 : null}
          />
        </Col>
        {/* codeCip12 */}
        <Col md={6}>
          <FormField
            labelColSize={4}
            name={"codeCip"}
            control={control}
            errors={errors}
            label="Code cip 12"
            register={register}
            requiredStar={false}
            defaultValue={tob ? tob.codeCip : null}
          />
        </Col>
        {/* image */}
        <Col md={12}>
          <FormField
            labelColSize={2}
            name={"image"}
            control={control}
            errors={errors}
            label="image"
            register={register}
            requiredStar={false}
          />
        </Col>
        {/* description */}
        <Col md={12}>
          <FormField
            labelColSize={2}
            name={"description"}
            control={control}
            errors={errors}
            label="description"
            register={register}
            requiredStar={false}
          />
        </Col>
      </Row>
      {/* tarification */}
      {productTarification()}
      {productStock()}
      {productQtities()}
      {productStatus()}
      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
        {/* <BtnSubmit disabled={isValid} size="sm" onCancel={onCancelForm} /> */}
      </div>
    </form>
  );
};

export default AdditProduct;
// export default AdditProduct.__isStatic = true;
