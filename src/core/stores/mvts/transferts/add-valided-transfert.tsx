import { AdditModalFormProps } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";

import httpService from "../../../../services/httpService";
import AdditStrNbrSelect from "../../../../shared/forms/addit-str-nbr-select";

const AddValidedTransfert = ({ tob, onSubmitForm, onCancelForm }: AdditModalFormProps) => {
  const { tobs } = useReadonlyFetchTobs(httpService, "users/staffs");

  const nTobs = tobs.map((tob) => {
    return { id: tob.id, name: `${tob.username} (${tob.fullname})` };
  });

  const getLabel = (opt) => {
    return `${opt["username"]} (${opt["fullname"]})`;
  };

  return (
    <AdditStrNbrSelect
      onCancelForm={onCancelForm}
      onSubmitForm={onSubmitForm}
      label="Opéré(e) par"
      schema="select"
      options={nTobs}
      // formatLabel={(opt) => `${opt["username"]} (${opt["fullname"]})`}
      // formatOptionLabel={(opt) => getLabel(opt)}
    />
  );
};

export default AddValidedTransfert;
