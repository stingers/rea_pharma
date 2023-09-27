import { IPath } from "asv-hlps/lib/cjs/models/types/Type";
import React from "react";

import authService from "../../../auth/services/authService";
import DisplayTab from "../../../shared/displays/DisplayTab";
import { PHD } from "../../../auth/services/auth-menu";

const ProductMvtIndex = () => {
  const paths: IPath[] = [
    {
      id: "productmvts_memos",
      title: <i className="fas fa-memory"></i>,
      icon: "uil-home-alt",
      link: "./memos",
    },
    {
      id: "productmvts_in",
      title: "entrées",
      icon: "uil-home-alt",
      link: "./list/ins",
      auth: authService.getAuth({ tag: "mvt_in", roles: [...PHD, "rcm"] }),
    },
    {
      id: "productmvts_out",
      title: "sorties",
      icon: "uil-home-alt",
      link: "./list/outs",
      auth: authService.getAuth({ tag: "mvt_out", roles: [...PHD, "rcm"] }),
    },
    {
      id: "productmvts_inventory",
      title: "inventaires",
      icon: "uil-home-alt",
      link: "./list/inventory",
      auth: authService.getAuth({ tag: "mvt_inv", roles: [...PHD, "rcm"] }),
    },
    {
      id: "productmvts_transfert",
      title: "transferts",
      icon: "uil-home-alt",
      link: "./list/transfert",
      auth: authService.getAuth({ tag: "mvt_tr", roles: [...PHD, "rcm"] }),
    },
    {
      id: "productmvts_adjustment",
      title: "adjustements",
      icon: "uil-home-alt",
      link: "./list/adjustment",
      auth: authService.getAuth({ tag: "mvt_adjust", roles: [...PHD, "rcm"] }),
    },
  ];
  return <DisplayTab paths={paths} child />;
};

export default ProductMvtIndex;
