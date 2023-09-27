import { BtnType } from "asv-hlps-react";
import { useState } from "react";

type TobProps = {
  onBtnAction?: (id: number | string) => void;
  labels: string[];
};

const useOnBtnPillAction = ({ onBtnAction, labels }: TobProps) => {
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const btns: BtnType[] = [
    { id: 1, label: labels[0], btnClass: btnOne.variant },
    { id: 2, label: labels[1], btnClass: btnTwo.variant },
  ];

  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        onBtnAction(id);
        // setTreat("valided");
        break;
      case 2:
        setBtnTwo({ variant: "btn-primary" });
        setBtnOne({ variant: "btn-light" });
        onBtnAction(id);

        // setTreat("rejected");
        break;

      default:
        break;
    }
  };
  return { btns, onBtn };
};

export default useOnBtnPillAction;
