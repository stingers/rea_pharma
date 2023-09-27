import { yupResolver } from "@hookform/resolvers/yup";
import { arrayMultiChecked, CBillPeriod, City, Country, Quarter, Region, UserRole, Zone } from "asv-hlps";
import { BtnSubmit, FormFieldReactSelect } from "asv-hlps-react";
import { Gender } from "asv-hlps/lib/cjs/models/entities/users/Gender";
import { useState } from "react";
import { Step, Steps, Wizard } from "react-albus";
import { Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import httpService from "../../services/httpService";
import DisplayRequiredStar from "../../shared/components/display-required-star";
import { FormInputGroup } from "../../shared/forms/FormInput";
import FormField from "../../shared/forms/input-form-h";
import useReadonlyFetchTobs from "../../shared/hooks/useReadonlyFetchTobs";
import { AuthTagSlot } from "./auth-tag-slot";
import EditFormFormated from "./forms/edit-form-formated";
import { UserStaffForm } from "./forms/user-staff-form";
import { UserSteForm } from "./forms/user-ste-form";
import { HlpUser } from "./helpers/hlpUser";

export type FormPropsType<T> = {
  onSubmitForm: (values) => any;
  onCancelForm: (value) => any;
  tob?: T;
  grp?: string;
  code: string;
};

interface UserFormType {
  address?: string;
  birthday?: string;
  cityId?: number;
  countryId: number;
  cp?: string;
  codeCompta?: number;
  email?: string;
  firstname: string;
  genderId: number;
  hasBillSafe?: boolean;
  id?: number;
  ip?: string;
  isActive?: boolean;
  isBadPayer?: boolean;
  isEqeerUser?: boolean;
  isSpecial?: boolean;
  isValided?: boolean;
  lastname: string;
  limitAmountSaleByMonth?: number;
  limitAmountSaleIsActive?: boolean;
  periodBill?: string;
  phoneP: string;
  phoneS?: string;
  quarterId?: number;
  regionId?: number;
  roleId?: number;
  signature?: string;
  titrId?: number;
  username?: string;
  zoneId?: number;
  tagsId?: number[];
  ste: {
    id?: number;
    name: string;
    shortname?: string;
    nif: string;
    approval?: string;
    approvalExpDate?: Date;
    grpId: number;
  };
}

// const AdditUser = ({ tob, onSubmitForm, onCancelForm }: FormPropsType<User>) => {
const AdditUser = ({ code, grp, tob, onSubmitForm, onCancelForm }: FormPropsType<any>) => {
  const [key, setKey] = useState<string | null>("info");
  const [checks, setChecks] = useState([]);

  let { tobs: roles } = useReadonlyFetchTobs(httpService, "userroles/menu");
  roles = HlpUser.getRoleMenuAccess(roles, authService.authUser());
  const { tobs: steGrps } = useReadonlyFetchTobs(httpService, "stegrps");
  const { tobs: genders } = useReadonlyFetchTobs(httpService, "genders");
  const { tobs: titrs } = useReadonlyFetchTobs(httpService, "usertitrs");
  const { tobs: countries } = useReadonlyFetchTobs(httpService, "countries");
  const { tobs: zones } = useReadonlyFetchTobs(httpService, "zones");
  // const periodBills = formatSelectOptions(CBillPeriod);
  const periodBills = CBillPeriod;

  const [selectedSteGrp, setSelectedSteGrp] = useState(tob ? tob.ste.grp : null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(tob ? tob?.role : null);
  const [selectedGender, setSelectedGender] = useState<Gender>(tob ? tob?.gender : null);
  const [selectedTitr, setSelectedTitr] = useState<string>(tob ? tob?.titrs : null);
  const [selectedCity, setSelectedCity] = useState<City>(tob ? tob?.city : null);
  const [selectedRegion, setSelectedRegion] = useState<Region>(tob ? tob?.region : null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(tob ? tob?.country : null);
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(tob ? tob?.quarter : null);
  const [selectedZone, setSelectedZone] = useState<Zone>(tob ? tob?.zone : null);
  const [selectedPeriodBill, setSelectedPeriodBill] = useState(tob ? tob.periodBill : null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const schema: yup.ObjectSchema<any> = code !== "sf" ? UserSteForm(tob) : UserStaffForm(tob);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<UserFormType>({
    defaultValues: tob ? EditFormFormated(tob) : { isActive: true, isValided: true },
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const handleSelectedGrp = (tob) => {
    setValue("ste.grpId", +tob.id);
    setSelectedSteGrp(tob);
  };
  const handleSelectedRole = (tob) => {
    setValue("roleId", +tob.id);
    setSelectedSteGrp(tob);
  };

  const handleSelectedPeriodBill = (tob) => {
    setValue("periodBill", tob.id);
    setSelectedPeriodBill(tob);
  };

  const handleSelectedCountry = async (country) => {
    setRegions([]);
    setCities([]);
    setValue("countryId", +country.id);
    setValue("regionId", null);
    setValue("cityId", null);
    setSelectedRegion(null);
    setSelectedCity(null);
    setSelectedCountry(country);
    // ------ get country ------
    // const { data } = await httpService.getByParam(country.id, "regions/country");
    httpService.getByParam(country.id, "regions/country").then(({ data }) => {
      setRegions(data);
    });

    // const { tobs: regions } = useReadonlyFetchTobs(httpService, "regions/");
  };
  const handleSelectedRegion = async (region) => {
    setCities([]);
    setValue("regionId", +region.id);
    setSelectedRegion(region);
    setSelectedCity(null);
    httpService.getByParam(region.id, "cities/region").then(({ data }) => {
      setCities(data);
    });
  };

  const handleSelectedCity = (city) => {
    setValue("cityId", +city.id);
    setSelectedCity(city);
  };

  // ------ tob effet ------
  /* useEffect(() => {
    if (tob && tob.city) {
      httpService.getByParam(tob?.city?.region.id, "cities/region").then(({ data: cities }) => {
        setCities(cities);
      });
      httpService.getByParam(tob?.city?.region?.country.id, "regions/country").then(({ data: regions }) => {
        setRegions(regions);
      });
    }
  }, []); */

  const handleSelectedTitr = (tob) => {
    setValue("titrId", +tob.id);
    setSelectedTitr(tob);
  };

  const handleSelectedZone = (tob) => {
    setValue("zoneId", +tob.id);
    setSelectedZone(tob);
  };

  const formSubmit = (data) => {
    // ------ add usergrp code ------
    data.grpCode = grp;
    // const nUser = { grp, user: data };

    // onSubmitForm(nUser);
    onSubmitForm(data);
    // reset();
  };

  const handleCancel = (props) => {
    onCancelForm(false);
    reset();
  };

  const getAccess = () => {
    return authService.getAuth({ roles: [...PHD, "cpt"] });
  };

  const getRoleAccess = () => {
    return authService.getAuth({ roles: PHD, client: { roles: ["ceo"] } });
    // return authService.getAuth({ roles: PHD });
  };

  const getAccessClient = () => {
    return authService.getAuth({ client: { roles: ["ceo"] } });
  };
  // ------ authtag ------
  let { tobs: tagCats } = useReadonlyFetchTobs(httpService, "authtagcats/menu");
  const userTags = tob?.tags ? tob.tags : [];
  tagCats = HlpUser.getPermissions(tagCats, userTags, checks);
  // --------------------
  const onCheckedTag = (event) => {
    const checked = event.checked;
    const tag = event.tag;
    tag.isChecked = checked;
    const nChecks = arrayMultiChecked(checks, checked, tag);
    setChecks(nChecks);
    const checkTags = checks.map((x) => x.id);
    setValue("tagsId", checkTags);
    // this.form.patchValue({ tagsId: checkTags });
  };
  // --------------------

  const userInfo = () => {
    return (
      <>
        {/* steGrps */}
        {code !== "sf" && (
          <FormFieldReactSelect
            label={"catégories"}
            labelColSize={2}
            control={control}
            errors={errors}
            name={"ste.grpId"}
            onChange={handleSelectedGrp}
            options={steGrps}
            selected={selectedSteGrp}
            defaultValue={tob ? tob.ste.grp : null}
            isDisabled={!getAccess()}
          />
        )}
        {/* role */}
        {/* {code === "sf" && ( */}
        {code === "sf" && getRoleAccess() && (
          <FormFieldReactSelect
            label={"role"}
            labelColSize={2}
            control={control}
            errors={errors}
            name={"roleId"}
            onChange={handleSelectedRole}
            options={roles}
            selected={selectedRole}
            defaultValue={tob ? tob.role : null}
            isDisabled={!getAccess()}
          />
        )}
        {/* ste */}
        {code !== "sf" && (
          <>
            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={2}>
                Société
              </Form.Label>
              <Col sm={10}>
                <Row className="align-items-center mb-1">
                  <Col>
                    <FormField
                      // requiredStar={false}
                      labelColSize={3}
                      name="ste.name"
                      label={"nom"}
                      control={control}
                      register={register}
                      errors={errors}
                      vertical
                      noLabel
                    />
                  </Col>
                  <Col>
                    <FormField
                      vertical
                      noLabel
                      requiredStar={false}
                      name="ste.shortname"
                      label="Abrégé"
                      control={control}
                      register={register}
                      errors={errors}
                    />
                  </Col>
                </Row>
                <Row className="align-items-center mb-1">
                  <Col>
                    <FormField
                      requiredStar={false}
                      labelColSize={4}
                      name="ste.approval"
                      label="Agrément"
                      control={control}
                      register={register}
                      errors={errors}
                    />
                  </Col>
                  <Col>
                    <FormField
                      labelColSize={4}
                      type="date"
                      name="ste.approvalExpDate"
                      label="Expire le"
                      control={control}
                      register={register}
                      errors={errors}
                      requiredStar={false}
                    />
                  </Col>
                </Row>

                <FormField
                  labelColSize={2}
                  requiredStar={false}
                  name="ste.nif"
                  label="N° nif"
                  control={control}
                  register={register}
                  errors={errors}
                />
              </Col>
            </Form.Group>
            <hr className="my-2" />{" "}
          </>
        )}
        {/* username */}
        {tob!! && (
          <>
            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={2}>
                id
              </Form.Label>
              <Col sm={10}>
                <Row>
                  <Col sm={6}>
                    <FormInputGroup
                      readOnly={!getAccess()}
                      name={"username"}
                      control={control}
                      register={register}
                      errors={errors}
                      label={"username"}
                    />
                  </Col>
                  <Col sm={6}>
                    <FormInputGroup
                      readOnly={!getAccess()}
                      textClassName="fs-6"
                      name="codeCompta"
                      label="compta"
                      control={control}
                      register={register}
                    />
                    {errors && errors.codeCompta ? (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.codeCompta["message"]}
                      </Form.Control.Feedback>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Form.Group>
            <hr className="my-2" />
          </>
        )}
        {/* responsable */}
        <Form.Group as={Row} className="mb-1">
          <Form.Label column sm={2}>
            {code !== "sf" ? "Responsable" : "Personnel"}
          </Form.Label>
          <Col sm={10}>
            <Row className="align-items-center mb-1">
              <Col sm={2}>
                <FormFieldReactSelect
                  label={"civilité"}
                  noLabel
                  labelColSize={2}
                  control={control}
                  errors={errors}
                  name={"genderId"}
                  onChange={(tob) => {
                    setValue("genderId", +tob.id);
                    setSelectedGender(tob);
                  }}
                  options={genders}
                  selected={selectedGender}
                  defaultValue={tob ? tob.gender : null}
                  // defaultValue={tob ? genders.filter((p) => p.id === tob.gender.id) : null}
                  labelProp={"abr"}
                  vertical
                />
              </Col>
              {/* lastname */}
              <Col>
                <FormField
                  vertical
                  name={"lastname"}
                  placeholder={"Nom"}
                  control={control}
                  errors={errors}
                  label="Nom"
                  register={register}
                  noLabel
                />
              </Col>
              {/* firstname */}
              <Col>
                <FormField
                  placeholder={"Prenom"}
                  control={control}
                  errors={errors}
                  label="prénom"
                  name={"firstname"}
                  register={register}
                  noLabel
                  vertical
                />
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col>
                <FormFieldReactSelect
                  label={"titre"}
                  onChange={handleSelectedTitr}
                  options={titrs}
                  selected={selectedTitr}
                  name="titrId"
                  errors={errors}
                  control={control}
                  requiredStar={false}
                  defaultValue={tob ? tob.titr : null}
                  // noLabel
                  // placeholder={<span className="text-secondary">select titre</span>}
                />
              </Col>
              {/* birthday */}
              <Col>
                <FormField
                  labelColSize={3}
                  type="date"
                  name="birthday"
                  label={"né(e) le"}
                  control={control}
                  register={register}
                  errors={errors}
                  requiredStar={false}
                />
              </Col>
            </Row>
          </Col>
        </Form.Group>
        <hr className="my-2" />
        {/* phones */}
        <Form.Group as={Row} className="mb-1">
          <Form.Label column sm={2}>
            Phones
          </Form.Label>
          <Col sm={10}>
            <Row className="align-items-center">
              <Col>
                <FormField
                  labelColSize={4}
                  control={control}
                  errors={errors}
                  label="principal"
                  name={"phoneP"}
                  register={register}
                  // noLabel
                />
              </Col>
              <Col>
                <FormField
                  control={control}
                  errors={errors}
                  label="autre"
                  name={"phoneS"}
                  register={register}
                  requiredStar={false}
                  // noLabel
                />
              </Col>
            </Row>
          </Col>
        </Form.Group>
        <hr className="my-2" />
        {/* coordonnées */}
        <Form.Group as={Row} className="mb-1">
          <Form.Label column sm={2} className="fs-6 ">
            coordonnées
          </Form.Label>
          <Col sm={10}>
            <Row className="align-items-center mb-1">
              <Col>
                <FormField
                  labelColSize={2}
                  placeholder={"email"}
                  name={"email"}
                  // noLabel
                  control={control}
                  register={register}
                  errors={errors}
                  label={"email"}
                  // vertical
                />
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              {/* adress */}
              <Col>
                <FormField
                  placeholder={"addresse"}
                  control={control}
                  errors={errors}
                  label="Addresse"
                  name={"address"}
                  register={register}
                  noLabel
                  vertical
                  requiredStar={false}
                />
              </Col>
              {/* cp */}
              <Col sm={3}>
                <FormField
                  placeholder={"code postal"}
                  control={control}
                  errors={errors}
                  label="code postal"
                  name={"cp"}
                  register={register}
                  noLabel
                  vertical
                  requiredStar={false}
                />
              </Col>
            </Row>
            {/* wold */}
            <Row className="align-items-center mb-1">
              <Col>
                <FormFieldReactSelect
                  label={"pays"}
                  // placeholder={"pays"}
                  onChange={(e) => handleSelectedCountry(e)}
                  options={countries}
                  selected={selectedCountry}
                  name="countryId"
                  errors={errors}
                  control={control}
                  noLabel
                  labelProp={"nameFr"}
                  defaultValue={tob ? tob?.country : null}
                  vertical
                />
              </Col>
              <Col>
                <FormFieldReactSelect
                  label={"region"}
                  // placeholder={"region"}
                  onChange={handleSelectedRegion}
                  options={regions}
                  selected={selectedRegion}
                  name="regionId"
                  errors={errors}
                  control={control}
                  defaultValue={tob ? tob?.region : null}
                  noLabel
                  vertical
                />
              </Col>
              <Col>
                <FormFieldReactSelect
                  label={"ville"}
                  // placeholder={"ville"}
                  onChange={handleSelectedCity}
                  options={cities}
                  selected={selectedCity}
                  name="cityId"
                  errors={errors}
                  control={control}
                  defaultValue={tob ? tob?.city : null}
                  noLabel
                  vertical
                />
              </Col>
            </Row>
          </Col>
        </Form.Group>
        <hr className="my-2" />
        {/* zones */}
        {code !== "sf" && (
          <>
            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={2}>
                Zones
              </Form.Label>
              <Col sm={10}>
                <Row className="align-items-center mb-1">
                  <Col>
                    <FormFieldReactSelect
                      label={"zone"}
                      // placeholder={"zone"}
                      onChange={handleSelectedZone}
                      options={zones}
                      selected={selectedZone}
                      name="zoneId"
                      errors={errors}
                      control={control}
                      noLabel
                      defaultValue={tob ? tob.zone : null}
                    />
                  </Col>
                </Row>
              </Col>
            </Form.Group>
            <hr className="my-2" />
          </>
        )}
        {/* mode de facturation */}
        <Form.Group as={Row} className="mb-1 ">
          <Form.Label column sm={2}>
            <DisplayRequiredStar label={"Mode de facturation"} />
          </Form.Label>
          <Col sm={10}>
            <Row className="align-items-center mb-1">
              <Col>
                <FormFieldReactSelect
                  label={"periode de facturation"}
                  // placeholder={"periode de facturation"}
                  onChange={handleSelectedPeriodBill}
                  options={periodBills}
                  selected={selectedPeriodBill}
                  name="periodBill"
                  errors={errors}
                  control={control}
                  valueProp={"name"}
                  noLabel
                  defaultValue={tob ? periodBills.filter((p) => p.id === tob.periodBill) : null}
                  isDisabled={!getAccess()}
                />
              </Col>
              <Col>
                <Col>
                  <Form.Check label="Ne pas bloquer après 4 factures impayées" {...register("hasBillSafe")} />
                </Col>
              </Col>
            </Row>
          </Col>
        </Form.Group>
        <hr className="my-1" />
        {/* sale limitation*/}
        {getAccess() && (
          <>
            <Form.Group as={Row} className="mb-1 ">
              <Form.Label column sm={2}>
                <DisplayRequiredStar label={"Limitation de vente "} />
              </Form.Label>
              <Col sm={10}>
                <Row className="align-items-center mb-1">
                  <Col>
                    <FormField
                      noLabel
                      name="limitAmountSaleByMonth"
                      label="par mois"
                      control={control}
                      register={register}
                      errors={errors}
                    />
                  </Col>
                  <Col>
                    <Form.Check label="Active" {...register("limitAmountSaleIsActive")} />
                  </Col>
                </Row>
              </Col>
            </Form.Group>
            <hr className="my-1" />
          </>
        )}
        {/* checks */}
        {getAccess() && (
          <>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={2}></Form.Label>
              <Col sm={10}>
                <Row>
                  <Col>
                    <Form.Check label="Active" {...register("isActive")} />
                  </Col>
                  <Col>
                    <Form.Check label="Validé" {...register("isValided")} />
                  </Col>
                  <Col>
                    <Form.Check label="Spécial" {...register("isSpecial")} />
                  </Col>
                  <Col>
                    <Form.Check label="Eqeer" {...register("isEqeerUser")} />
                  </Col>
                  <Col>
                    <Form.Check label="Mauvais payeur" {...register("isBadPayer")} />
                  </Col>
                </Row>
              </Col>
            </Form.Group>
            <hr className="my-1" />
          </>
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Wizard>
        <Steps>
          <Tabs
            id="controlled-tab-example"
            activeKey={key ? key : "info"}
            onSelect={(k) => setKey(k)}
            variant="pills"
            className="nav-justified form-wizard-header mb-2">
            <Tab
              eventKey="info"
              title={
                <>
                  <span className="number">1</span>
                  <span className="d-none d-sm-inline">Account</span>
                </>
              }>
              <Step id="info" render={({ next }) => userInfo()} />
            </Tab>
            {code === "sf" && (
              <Tab
                eventKey="permission"
                title={
                  <>
                    <span className="number">2</span>
                    <span className="d-none d-sm-inline">Autorisations</span>
                  </>
                }>
                <Step id="permission" render={({ next }) => <AuthTagSlot tagCats={tagCats} onCheckTag={onCheckedTag} />} />
              </Tab>
            )}
          </Tabs>
        </Steps>
      </Wizard>

      {/* <BtnSubmit disabled={isValid} onCancel={handleCancel} /> */}
      <BtnSubmit disabled={!isValid} onCancel={handleCancel} />
      {/* <BtnSubmit disabled={!isValid} className={"cursor-pointer not-allowed"} onCancel={handleCancel} /> */}
    </form>
  );
};

export default AdditUser;
