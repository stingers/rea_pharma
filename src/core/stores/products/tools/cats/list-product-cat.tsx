import { ColEditDel, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useEffect, useMemo, useState } from "react";

import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";
import { colNaCo } from "../../../../../shared/helpers/hlpColumn";
import hlpCrud from "../../../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../../../shared/helpers/Toastify";

const ListProductCat = ({ url }) => {
  const [tob, setTob] = useState(null);
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  // --------------------
  const fetchDatas = async () => {
    const { data: tobs } = await httpService.get(url);
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, []);
  // --------------------

  const handleRefresh = () => {
    fetchDatas();
  };

  const handleDelete = async (tob) => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    const err = await hlpCrud.persistDelete(tob, `${url}/del`, tobs);
    if (err) {
      setTobs(tobs);
      return Toastify.error();
    }
    Toastify.success();
  };

  const handleEdit = (tob) => {
    setTob(tob);
    setModal(true);
  };

  const onAdd = () => {
    setModal(true);
  };

  const handleSubmit = async (data) => {
    setModal(false);
    setTob(null);
    const nTobs = await hlpCrud.additPessimisticTob(data, tobs, "productcats");
    setTobs(nTobs);
  };

  const columns: ReactTableColumnType[] = useMemo(() => [...colNaCo, { ...ColEditDel({ handleDelete, handleEdit }) }], [handleDelete]);

  return (
    <>
      <TskTable
        headTitle={"catégories"}
        loading={loading}
        columns={columns}
        data={tobs}
        onAdd={onAdd}
        // onAsyncSearch={handleAsyncSearch}
      />
      <ModalBase
        title={<span>categorie</span>}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={() => {
          setModal(false);
          setTob(null);
        }}
        content={
          <AdditNaCoSh
            type="naco"
            url="productcats"
            tob={tob}
            onSubmitForm={handleSubmit}
            onCancelForm={() => {
              setModal(false);
              setTob(null);
            }}
          />
        }
      />
    </>
  );
};

export default ListProductCat;
