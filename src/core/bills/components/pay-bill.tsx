import { yupResolver } from "@hookform/resolvers/yup";
import { Account, Bank, Bill, BillPaymentMethod, currencyFormatterCfa } from "asv-hlps";
import { FormFieldReactSelect } from "asv-hlps-react/lib/cjs/reacts/forms";
import BtnSubmit from "asv-hlps-react/lib/cjs/reacts/minton/btns/BtnSubmit";
import { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../services/httpService";
import Btn from "../../../shared/btns/Btn";
import hlpForm from "../../../shared/forms/hlpForm";
import FormField from "../../../shared/forms/input-form-h";
import PayBillWithBack from "./pay-bill-with-back";
import PayBillWithTwice from "./pay-bill-with-twice";

type TobProps = {
  bill: Bill;
  onCancel: (tob) => void;
  onValided: (tob) => void;
  // onPay: (tob) => void;
  // show: boolean;
};

/* interface FormType {
  mode;
  amount;
  account?;
  bank?;
  checkDate?: Date | string;
  checkNumber?: string;
} */

const PayBill = ({ bill, onCancel, onValided }: TobProps) => {
  const [twice, setTwice] = useState(null);
  const [backBills, setBackBills] = useState<Bill[]>([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedBank, setSelectedBank] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [all, setAll] = useState(false);
  // --------------------
  const [modes, setModes] = useState<BillPaymentMethod[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  // const text = bill.type != "avoir" ? "<b>solder<b>" : "<b>payer<b>";

  // ------ pay twice bill ------
  // const { options: modes } = useReadonlyFetchTobs("billpaymentmodes");
  /* const { tobs: modes } = useReadonlyFetchTobs(httpService, "billpaymentmodes");
  const { tobs: accounts } = useReadonlyFetchTobs(httpService, "accounts");
  const { tobs: banks } = useReadonlyFetchTobs(httpService, "banks"); */
  // console.log(modes);
  // console.log(accounts);
  // console.log(banks);
  // console.log(bill);
  // --------------------
  /* const fetchDatas = async () => {
    const { data: modes } = await httpService.get("billpaymentmodes");
    setModes(modes);
    const { data: accounts } = await httpService.get("accounts");
    setAccounts(accounts);
    const { data: banks } = await httpService.get("banks");
    setBanks(banks);
    // --------------------
    const { data: twice } = await httpService.findById(bill.id, "bills/withSameTotalAmount");
    if (twice) {
      setTwice(twice);
    } else {
      const { data: backs } = await httpService.findById(bill.client.id, "bills/backBills");
      if (backs) {
        setBackBills(backs);
      }
    }
  };
 */

  const fetchDatas = async () => {
    const { data: modes } = await httpService.get("billpaymentmodes");
    setModes(modes);
    const { data: accounts } = await httpService.get("accounts");
    setAccounts(accounts);
    const { data: banks } = await httpService.get("banks");
    setBanks(banks);
    // --------------------
    const { data: twice } = await httpService.findById(bill.id, "bills/withSameTotalAmount");
    if (twice) {
      setTwice(twice);
    } else {
      const { data: backs } = await httpService.findById(bill.client.id, "bills/backBills");
      if (backs) {
        setBackBills(backs);
      }
    }
  };

  // --------------------

  /* const getDatas = async () => {
    const { data: twice } = await httpService.findById(bill.id, "bills/withSameTotalAmount");
    if (twice) {
      setTwice(twice);
    } else {
      const { data: backs } = await httpService.findById(bill.client.id, "bills/backBills");
      if (backs) {
        setBackBills(backs);
      }
    }
  }; */

  useEffect(() => {
    // getDatas();
    fetchDatas();
  }, []);

  const schema = yup.object({
    mode: yup.number().required(),
    // amount: yup.number().required(FormErrors.REQUIRED).positive(FormErrors.DIGIT).integer(FormErrors.DIGIT),
    amount: hlpForm.yupRequiredNumber(),
    // account: yup.string(),
    account: yup.number().when("mode", {
      // is: 3,
      is: (value) => [2, 3, 5].includes(value),
      // then: () => yup.number().required(),
      then: () => hlpForm.yupNoRequiredNumber(),
      // otherwise: () => yup.number().notRequired(),
      otherwise: () => hlpForm.yupNoRequiredNumber(),
    }),
    bank: yup.number().when("mode", {
      // is: 3,
      is: (value) => [2, 3, 5].includes(value),
      then: () => yup.number().required(),
      otherwise: () => yup.number().notRequired(),
    }),
    checkDate: yup.string().when("mode", {
      // is: (value) => value === 3,
      // is: (value) => value === 3,
      is: (value) => [2, 3, 5].includes(value),
      then: () => yup.string().required(),
    }),
    checkNumber: yup.string().when("mode", {
      // is: (value) => value === 3,
      is: (value) => [2, 3, 5].includes(value),
      then: () => yup.string().required(),
    }),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<FormType>({
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await httpService.putBody(bill.id, values, "bills/payamount");
      onValided(data);
      reset();
    } catch (error) {}
  };

  const watchMode = watch("mode");

  const inputCash = () => {
    return (
      <>
        <Form.Group as={Row} className="mb-2">
          <Form.Label htmlFor="exampleEmail3" column sm={3}>
            A Solder
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              className="fs-5 fw-bold text-dark border-0"
              disabled
              value={currencyFormatterCfa(+bill.dueAmount)}
              // name="dueAmount"
              // {...register("dueAmount")}
            />
          </Col>
          <Col sm={2}>
            <Btn label={"tout"} onBtn={payAll} />
          </Col>
        </Form.Group>

        <FormField label="Montant" control={control} name={"amount"} register={register} errors={errors} />
      </>
    );
  };

  const handleSelectedMode = (mode) => {
    setValue("mode", +mode.id);
    setSelectedMode(mode);
  };

  const handleSelectedAccount = (account) => {
    setValue("account", +account.id);
    setSelectedAccount(account);
  };

  const handleSelectedBank = (bank) => {
    setValue("bank", +bank.id);
    setSelectedBank(bank);
  };

  useEffect(() => {
    if (watchMode === 1) {
      setValue("account", null);
      setValue("bank", null);
      setValue("checkDate", "");
      setValue("checkNumber", "");
      // --------------------
      setSelectedAccount(null);
      setSelectedBank(null);
    }
  }, [watchMode]);

  const handlCancel = () => {
    reset();
    onCancel(onCancel);
  };

  // console.log(banks);
  const payAll = () => {
    setAll(true);
    setValue("amount", +bill.dueAmount);
  };
  const handleTwiceNo = () => {
    setTwice(null);
  };
  const handleBackNo = () => {
    setBackBills([]);
  };
  const handleBackYes = (data) => {
    onValided(data);
  };

  /* useEffect(
    () => {
      payAll();
    },
    all === true ? [all] : []
  ); */

  return (
    <>
      {twice && <PayBillWithTwice bill={bill} twice={twice} onNo={handleTwiceNo} />}

      {backBills?.length > 0 && <PayBillWithBack bill={bill} billBacks={backBills} onNo={handleBackNo} onYes={handleBackYes} />}
      {backBills?.length <= 0 && !twice && (
        <form onSubmit={handleSubmit(onSubmit)} className="text-uppercase fs-6">
          <FormFieldReactSelect
            name={"mode"}
            control={control}
            errors={errors}
            label="Mode"
            options={modes}
            selected={selectedMode}
            onChange={handleSelectedMode}
          />
          {selectedMode?.id === 1 && (
            <Card>
              <Card.Header className="p-1 color-primary">
                <h5 className="my-1 header-title">
                  Règlement en espèces <span className="fw-bold float-end">{currencyFormatterCfa(+bill.dueAmount)}</span>
                </h5>
              </Card.Header>
              <Card.Body>{inputCash()}</Card.Body>
            </Card>
          )}
          {[2, 3, 5].includes(selectedMode?.id) && (
            // {selectedMode === 3 && (
            <Card>
              <Card.Header className="p-1">
                <h5 className="my-1 header-title fw-lighter">
                  Règlement par cheque/virement <span className="fw-bold float-end">{currencyFormatterCfa(+bill.dueAmount)}</span>
                </h5>
              </Card.Header>
              <Card.Body>
                {inputCash()}
                <FormField label="N° Chq/Virt" control={control} name={"checkNumber"} register={register} errors={errors} />
                <FormField type="date" label="date" control={control} name={"checkDate"} register={register} errors={errors} />
                <FormFieldReactSelect
                  label="Banque"
                  options={banks}
                  name={"bank"}
                  control={control}
                  selected={selectedBank}
                  onChange={handleSelectedBank}
                  errors={errors}
                />
                <FormFieldReactSelect
                  label="Compte dépot"
                  name={"account"}
                  formatLabel={(tob) => `${tob.bank.name} ${tob.name}`}
                  control={control}
                  options={accounts}
                  selected={selectedAccount}
                  onChange={handleSelectedAccount}
                  errors={errors}
                  requiredStar={false}
                />
              </Card.Body>
            </Card>
          )}
          <BtnSubmit disabled={!isValid} onCancel={handlCancel} />
          {/* <BtnSubmit disabled={isValid} onCancel={handlCancel} /> */}
        </form>
      )}
    </>
  );
};

export default PayBill;
