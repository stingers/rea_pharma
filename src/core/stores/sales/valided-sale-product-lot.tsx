import { dateFormatter, reduceSum, SaleProduct, SaleProductLot } from "asv-hlps";
import { BtnSubmit, colToolTip, ModalConfirm } from "asv-hlps-react";
import React, { useRef, useState } from "react";

type TobType = {
  sp: SaleProduct;
  onValidedLot: (sp: SaleProduct) => void;
};
const ValidedSaleProductLot = ({ sp, onValidedLot }: TobType) => {
  const [lots, setLots] = useState<SaleProductLot[]>(sp.lots);
  const [totalQtityFund, setTotalQtityFund] = useState<number>(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const refQtiyFund = useRef();

  // --------------------

  const onGetQtityLot = (data) => {
    const index = lots.findIndex((x) => x.id === data.lot.id);
    // --------------------
    const qtityFund = data.refQtiyFund.current.value;
    if (qtityFund > lots[index].qtityOut) {
      setModalConfirm(true);
      data.refQtiyFund.current.value = 0;
    } else {
      lots[index].qtityFund = +qtityFund;
      setTotalQtityFund(reduceSum(lots, "qtityFund"));
    }

    // if()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.preventDefault();
    setTotalQtityFund(reduceSum(lots, "qtityFund"));

    const nSp = { ...sp, lots, qtityFund: totalQtityFund };
    onValidedLot(nSp);
    // console.log(e.currentTarget.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        {/*  <FormFieldReactSelect
          label={"raison"}
          onChange={(tob) => {
            setValue("reasonId", +tob.id);
            setSelected(tob);
          }}
          options={reasons}
          selected={selected}
          name="reasonId"
          errors={errors}
          control={control}
          className={"text-uppercase mb-2"}
        /> */}
        {/* <BtnReactSelect className={"fs-6 p-0 m0"} tob={sp} options={reasons} onSelectedOption={onSelected} minWidth={200} maxWidth={200} /> */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr className="mb-0 mt-0">
                <th scope="col">#</th>
                <th scope="col">lot</th>
                <th scope="col">{colToolTip("Exp", "Date de péremption")}</th>
                <th scope="col">{colToolTip("Qte", "Quantité")} </th>
                <th className="text-center" scope="col">
                  {colToolTip("Q.T", "Quantité trouvée")}{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {React.Children.toArray(
                lots.map((lot, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{lot.lot}</td>
                    <td>{dateFormatter(lot.lotExp, "dmy", "/")}</td>
                    <td>{lot.qtityOut}</td>
                    <td width={"20%"}>
                      <input
                        ref={refQtiyFund}
                        onChange={() => onGetQtityLot({ lot, refQtiyFund })}
                        type="text"
                        className="form-control form-control-sm text-center"
                        name="lot.qtityFund"
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        // defaultValue={lot.qtityOut}
                        defaultValue={0}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <BtnSubmit disabled={false} />
        </div>
      </form>
      <ModalConfirm
        title={"impossible s'effectuer cette action"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={() => setModalConfirm(false)}
        approveLabel={"ok"}
        content={`<b> La Quantité à livrée ne peut  supérieur à la quantité commandée</b>`}
      />
    </>
  );
};

export default ValidedSaleProductLot;
