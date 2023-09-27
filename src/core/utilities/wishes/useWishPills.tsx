import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import { useState } from "react";

const useWishPills = () => {
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [status, setStatus] = useState("toDo");

  const btns: BtnType[] = [
    { id: 1, label: "en attente", btnClass: btnOne.variant },
    { id: 2, label: "traité", btnClass: btnTwo.variant },
  ];

  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setStatus("toDo");
        break;

      case 2:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-primary" });
        setStatus("done");
        break;

      default:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setStatus("toDo");
        break;
    }
  };
  return { onBtn, btns, status };
};

export default useWishPills;
