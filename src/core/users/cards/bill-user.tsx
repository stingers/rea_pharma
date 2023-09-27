import ListBill from "../../bills/list-bill";

type TobProps = {
  clientId?: number;
};

const BillUser = ({ clientId }: TobProps) => {
  return (
    <>
      <ListBill url={"bills"} clientId={clientId} />;
    </>
  );
};

export default BillUser;
