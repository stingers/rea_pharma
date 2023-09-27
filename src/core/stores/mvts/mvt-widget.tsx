import { ProductMvt } from "asv-hlps";
import { dateFormatter } from "asv-hlps/lib/cjs/utils";

import DisplayWidget from "../../../shared/displays/display-widget";

type TobType = {
  mvt: ProductMvt;
  tobs;
};

const MvtWidget = ({ mvt, tobs }: TobType) => {
  const widgets = [
    { title: "ref mvt", content: mvt?.ref },
    { title: "date de creation", content: dateFormatter(mvt?.createdAt, "dmy", "/") },
    { title: "nombre de produits", content: tobs?.length },
    { title: "author", content: mvt?.author?.fullname },
  ];
  const widgetIns = [
    { title: "ref mvt", content: mvt?.ref },
    { title: "date de creation", content: dateFormatter(mvt?.createdAt, "dmy", "/") },
    { title: "nombre de produits", content: tobs?.length },
    { title: "fournisseur", content: mvt?.pvd?.name },
    { title: "author", content: mvt?.author?.fullname },
  ];
  return <DisplayWidget widgets={mvt.motive === "ins" ? widgetIns : widgets} />;
};

export default MvtWidget;
