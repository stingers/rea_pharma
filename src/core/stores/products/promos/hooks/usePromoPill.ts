import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import { useState } from "react";

const usePromoPill = () => {
  // const [status, setStatus] = useState(param ? param : "current");
  const [status, setStatus] = useState("current");
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [btnTree, setBtnTree] = useState({ variant: "btn-light" });

  const btns: BtnType[] = [
    { id: 1, label: "en cours", btnClass: btnOne.variant },
    { id: 2, label: "terminés", btnClass: btnTwo.variant },
    { id: 3, label: "tout", btnClass: btnTree.variant },
  ];
  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnTree({ variant: "btn-light" });
        setStatus("current");
        break;
      case 2:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-primary" });
        setBtnTree({ variant: "btn-light" });
        setStatus("outdate");
        break;
      case 3:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-light" });
        setBtnTree({ variant: "btn-primary" });
        setStatus("all");
        break;

      /* default:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnTree({ variant: "btn-light" });
        setStatus("current");
        break; */
    }
  };

  return { onBtn, btns, status };
};

export default usePromoPill;
