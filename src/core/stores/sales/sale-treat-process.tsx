import { Toastify } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { Button } from "react-bootstrap";

import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import pipeSale from "./helpers/pipeSale";

type TobType = {
  sale: Sale;
  // onProcess: (sale: Sale, treat: string) => void;
  onProcess;
};

const SaleTreatProcess = ({ sale, onProcess }: TobType) => {
  const handleProcess = (treat) => {
    onProcess({ sale, treat });
  };

  const onResetIsOnProcessed = async (sale) => {
    try {
      const { data } = await httpService.postId(sale.id, "sales/resetIsOnPrecessed");
      if (data) {
        Toastify.success();
      }
    } catch (error) {
      Toastify.error();
    }
  };

  const waiting = () => {
    if (pipeSale.treat(sale, "waiting")) {
      if (authService.getAuth({ tag: "sdc_at_act", roles: [...PHD, "mag", "mac"] })) {
        return (
          <Button className="btn-xs" variant="danger" size="sm" onClick={() => handleProcess("processing")}>
            <span className="text-uppercase"> attente</span>
          </Button>
        );
      } else {
        return (
          <Button className="btn-xs" variant="danger" size="sm">
            <span className="text-uppercase"> attente</span>
          </Button>
        );
      }
    }
  };

  const processing = () => {
    if (pipeSale.treat(sale, "processing")) {
      if (authService.getAuth({ tag: "sdc_et_act", roles: [...PHD, "mac"] })) {
        return (
          <Button className=" btn-xs" variant="info" size="sm" onClick={() => handleProcess("processed")}>
            <span className="text-uppercase"> traitement</span>
          </Button>
        );
      } else {
        return (
          <Button className="btn-xs" variant="info" size="sm">
            <span className="text-uppercase"> traitement</span>
          </Button>
        );
      }
    }
  };

  const processed = () => {
    if (pipeSale.treat(sale, "processed")) {
      if (!sale.isOnProcessed && authService.getAuth({ tag: "sdc_tr_act", roles: [...PHD, "mag", "mcc", "rcm"] })) {
        return (
          <Button className="btn-xs" variant="primary" size="sm" onClick={() => handleProcess("picking")}>
            <span className="text-uppercase">traitée</span>
          </Button>
        );
      }
      if (sale.isOnProcessed && authService.getAuth({ tag: "sdc_tr_act", roles: [...PHD, "mag", "mcc", "rcm"] })) {
        return (
          <>
            <Button className="btn-xs" variant="primary" size="sm">
              <span className="text-uppercase">en contrôle</span>
            </Button>
            {authService.getAuth({ tag: "sale_reset_isOnProcessed", roles: [...PHD, "rcm"] }) && (
              <span className="mx-1 d-block-inline cursor-pointer" onClick={() => onResetIsOnProcessed(sale)}>
                <i className="fas fa-undo"></i>
              </span>
            )}
          </>
        );
      }

      return (
        <Button variant="primary" size="sm">
          <span className="text-uppercase">{!sale.isOnProcessed ? "traitée" : "en controle"}</span>
        </Button>
      );
    }
  };

  const picking = () => {
    if (pipeSale.treat(sale, "picking")) {
      if (authService.getAuth({ tag: "sdc_pic_act", roles: [...PHD, "cha"] })) {
        return (
          <Button className="btn-xs" variant="dark" size="sm" onClick={() => handleProcess("delivering")}>
            <span className="text-uppercase">prête</span>
          </Button>
        );
      } else {
        return (
          <Button className="btn-xs" variant="dark" size="sm">
            <span className="text-uppercase">prête</span>
          </Button>
        );
      }
    }
  };

  const delivering = () => {
    if (pipeSale.treat(sale, "delivering")) {
      if (authService.getAuth({ tag: "sdc_el_act", roles: [...PHD, "com", "tlm", "cha"] })) {
        return (
          <Button className="btn-xs" variant="warning" size="sm" onClick={() => handleProcess("delivered")}>
            <span className="text-uppercase">livraison</span>
          </Button>
        );
      } else {
        return (
          <Button className="btn-xs" variant="warning" size="sm">
            <span className="text-uppercase">livraison</span>
          </Button>
        );
      }
    }
  };

  const delivered = () => {
    if (pipeSale.treat(sale, "delivered")) {
      /* if (authService.getAuth({ tag: "sdc_lv_act", roles: [...PHD] })) {
        return (
          <Button variant="success" size="sm" onClick={() => handleProcess("delivered")}>
            <span className="text-uppercase">livrée</span>
          </Button>
        );
      } else { */
      return (
        <Button className="btn-xs" variant="success" size="sm">
          <span className="text-uppercase"> livrée</span>
        </Button>
      );
      // }
    }
  };

  return (
    <>
      {/* <!-- waiting --> */}
      {waiting()}
      {/* <!-- isProcessing --> */}
      {processing()}

      {/* <!-- isProcessed --> */}
      {processed()}

      {/* <!-- isPicking --> */}
      {picking()}

      {/* <!-- isDelivering --> */}
      {delivering()}

      {/* <!-- isDelivered --> */}
      {delivered()}
    </>
  );
};

export default SaleTreatProcess;
