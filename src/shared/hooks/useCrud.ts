import { Toastify } from "asv-hlps-react";
import { HlpCrud } from "asv-hlps-react/lib/cjs/reacts/helpers/hlpCrud";
import { useEffect, useState } from "react";

export type TobCrudProps = {
  url: string;
  httpService: any;
  // getByParam?: any;
  getByParam?: string | number;
  idProp?: string;
  // getByParam?: string | number;
  postParam?: any;
  postProp?: string;
  urlToggle?: string;
  urlDel?: string;
  urlUpdate?: string;
  withDates?: boolean;
  withGet?: boolean;
  urlOther?: string;
  opti?: boolean;

  // params?: { name?: any; url?: string; withDates?: boolean; urlDel?: string };
};

const useCrud = (crud: TobCrudProps) => {
  const hlpCrud = new HlpCrud(crud.httpService);
  const [isLoading, setisLoading] = useState(true);
  const [tobs, setTobs] = useState([]);
  const [tob, setTob] = useState(null);
  const [dates, setDates] = useState<any>(null);
  const [modal, setModal] = useState(false);

  const fetchDatas = async () => {
    if (crud.getByParam) {
      setisLoading(true);
      const { data } = await crud.httpService.getByParam(crud.getByParam, crud.url);
      setisLoading(false);
      setTobs(data);
    }

    if ((crud.withDates && crud.postParam) || (crud.postParam && crud.withDates)) {
      setisLoading(true);
      // const name = crud.postParam;
      const { data } = await crud.httpService.postBody({ ...crud.postParam, dates }, crud.url);
      setisLoading(false);
      setTobs(data);
      return;
    }

    if (crud.withDates) {
      setisLoading(true);
      const { data } = await crud.httpService.postBody({ dates }, crud.url);
      setisLoading(false);
      setTobs(data);
      return;
    }

    if (crud.postParam) {
      const name = crud.postParam;
      const { data } = await crud.httpService.postBody({ name }, crud.url);
      setisLoading(false);
      setTobs(data);
      return;
    }

    const { data } = await crud.httpService.get(crud.url);
    setisLoading(false);
    setTobs(data);
  };

  useEffect(
    () => {
      // setisLoading(true);
      fetchDatas();
      return () => {};
      // }, [dates]);
      // }, [crud?.getByParam, crud?.postParam, dates]);
    },

    // [dates, crud.getByParam, crud?.postParam]
    // [dates, crud.getByParam, crud?.postParam?.grpCode]
    // [dates, crud.getByParam, crud?.postParam["grpCode"]]
    // [dates, crud.getByParam, crud?.postParam[crud.postParam]]
    [dates, crud.getByParam, crud.postParam && crud.postParam[crud.postProp]]
    // [dates, crud?.getByParam, crud?.postParam && [Object.keys(crud.postParam)[0]]]
  );

  const onAdd = () => {
    setModal(true);
  };

  const handleRefresh = () => {
    fetchDatas();
  };

  const handleSelectedDates = (dates) => {
    setDates(dates);
    fetchDatas();
  };

  const handleToggle = async (tob, propertyName) => {
    const url = !crud?.urlToggle ? crud?.url : crud?.urlToggle;
    try {
      const nTobs = await hlpCrud.toggleAction(tob, tobs, propertyName, url);
      setTobs(nTobs);
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }
  };

  const handleDelete = async (tob) => {
    const url = !crud.urlDel ? crud.url : crud.urlDel;
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    const err = await hlpCrud.persistDel(tob.id, url, tobs);
    if (err) {
      Toastify.error();
      setTobs(tobs);
    } else {
      Toastify.success();
    }
  };

  const showModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    /* e.preventDefault();
    e.stopPropagation(); */
    setModal(false);
    setTob(null);
  };

  /* const onEmitTob = () => {
    return emitTob;
  }; */

  const cancelForm = () => {
    /* e.preventDefault();
    e.stopPropagation(); */
    setModal(false);
    setTob(null);
  };

  const handleSubmit = async (tobValues) => {
    const { nTobs, toast } = !crud.opti
      ? await hlpCrud.additTobPes(tobValues, tobs, crud?.url, crud?.urlOther, crud?.urlUpdate, crud?.idProp)
      : await hlpCrud.additTob(tobValues, tobs, crud?.url, crud?.urlOther, crud?.urlUpdate);
    // : await hlpCrud.additTob(tobValues, tobs, crud?.url, crud?.urlOther, crud?.urlUpdate, crud?.idProp);

    toast === "error" ? Toastify.error() : Toastify.success();

    setTobs(nTobs);
    setModal(false);
  };

  const handleEdit = (tob) => {
    showModal();
    setTob(tob);
  };

  // --------------------
  return {
    handleSubmit,
    cancelForm,
    closeModal,
    handleDelete,
    handleEdit,
    handleToggle,
    isLoading,
    modal,
    setModal,
    setTobs,
    showModal,
    tob,
    tobs,
    onAdd,
    dates,
    handleRefresh,
    handleSelectedDates,
  };
};

export default useCrud;
