import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import { useState } from "react";

const useBillPills = () => {
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [btnThree, setBtnThree] = useState({ variant: "btn-light" });
  const [btnFour, setBtnFour] = useState({ variant: "btn-light" });
  const [btnFive, setBtnFive] = useState({ variant: "btn-light" });
  const [status, setStatus] = useState("nopaid");

  const btns: BtnType[] = [
    { id: 1, label: "impayées", btnClass: btnOne.variant },
    { id: 2, label: "payées", btnClass: btnTwo.variant },
    { id: 3, label: "avoir", btnClass: btnThree.variant },
    { id: 4, label: "retour", btnClass: btnFour.variant },
    { id: 5, label: "tout", btnClass: btnFive.variant },
  ];

  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-light" });
        setBtnFour({ variant: "btn-light" });
        setBtnFive({ variant: "btn-light" });
        setStatus("nopaid");
        break;
      case 2:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-primary" });
        setBtnThree({ variant: "btn-light" });
        setBtnFour({ variant: "btn-light" });
        setBtnFive({ variant: "btn-light" });
        setStatus("paid");
        break;

      case 3:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-primary" });
        setBtnFour({ variant: "btn-light" });
        setBtnFive({ variant: "btn-light" });
        setStatus("avoir");
        break;

      case 4:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-light" });
        setBtnFour({ variant: "btn-primary" });
        setBtnFive({ variant: "btn-light" });
        setStatus("back");
        break;
      case 5:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-light" });
        setBtnFour({ variant: "btn-light" });
        setBtnFive({ variant: "btn-primary" });
        setStatus("all");
        break;

      default:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-light" });
        setBtnFour({ variant: "btn-light" });
        setBtnFive({ variant: "btn-light" });
        setStatus("nopaid");
        break;
    }
  };
  return { onBtn, btns, status };
};

export default useBillPills;
