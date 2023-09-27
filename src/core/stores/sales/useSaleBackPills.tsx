import { BtnType } from "asv-hlps-react";
import { useState } from "react";

type TobProps = {
  onBtnAction?: (id: number | string) => void;
  labels: string[];
};

const useOnBtnPillAction = () => {
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [btnThree, setBtnThree] = useState({ variant: "btn-light" });
  const [treat, setTreat] = useState("notreat");
  const btns: BtnType[] = [
    { id: 1, label: "attente", btnClass: btnOne.variant },
    { id: 2, label: "acceptés", btnClass: btnTwo.variant },
    { id: 3, label: "refusés", btnClass: btnThree.variant },
  ];

  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-light" });
        setTreat("notreat");
        break;
      case 2:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-primary" });
        setBtnThree({ variant: "btn-light" });
        setTreat("valided");
        break;
      case 3:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-primary" });
        setTreat("rejected");
        break;

      default:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnThree({ variant: "btn-light" });
        setTreat("notreat");
        break;
    }
  };
  return { btns, onBtn, treat };
};

export default useOnBtnPillAction;
