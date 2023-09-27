import { Toastify } from "asv-hlps-react/lib/cjs/reacts/helpers/Toastify";
import { useState } from "react";
import { COMPTA, PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import httpService from "../../services/httpService";
import DisplaySticks, { StickProps } from "../../shared/displays/display-sticks";
import AdditStrNbrSelect from "../../shared/forms/addit-str-nbr-select";
import AdditCreateSelect from "./addit-bill-concat";

const BillBazar = () => {
  const [loading, setLoading] = useState(false);
  const onDeleteMultiBillsFromCron = async (prop) => {
    try {
      setLoading(true);
      await httpService.postParam({ param: prop.str }, "zut/deleteMultiGenBillsFromCronJob");
      setLoading(false);
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }
  };

  const bazars: StickProps[] = [
    {
      id: 1,
      label: "Delete duplicates bill from cron ",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
      withModal: {
        content: <AdditStrNbrSelect label={"date"} type="date" onSubmitForm={onDeleteMultiBillsFromCron} />,
      },
    },
    {
      id: 2,
      label: "Restore duplicates bill from cron ",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
      withModal: {
        content: <AdditCreateSelect />,
      },
    },
  ];

  const handleAction = (prop) => {};

  return <DisplaySticks sticks={bazars} loading={loading} onStickAction={handleAction} onStickview={undefined} />;
};

export default BillBazar;
