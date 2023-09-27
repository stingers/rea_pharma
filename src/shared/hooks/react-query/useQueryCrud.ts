import { UseQueryOptions } from "@tanstack/react-query";
import { useState } from "react";

import httpService from "../../../services/httpService";
import useQueryCreate from "./useQueryCreate";
import useQueryCreateOpti from "./useQueryCreateOpti";
import useQueryDel from "./useQueryDel";
import useQueryRead from "./useQueryRead";
import useQueryToggle from "./useQueryToggle";
import useQueryUpdate from "./useQueryUpdate";
import useQueryUpdateOpti from "./useQueryUpdateOpti";

export type TobCrudProps = {
  error?: Error;
  getByParam?: string | number;
  idProp?: string;
  keys: string[];
  firstKeys?: string[];
  opti?: boolean;
  queryConfigs?: UseQueryOptions;
  postParam?: any;
  postProp?: string;
  toggleProp?: string;
  url: string;
  urlDel?: string;
  urlCreate?: string;
  urlOther?: string;
  urlToggle?: string;
  urlUpdate?: string;
  withDates?: boolean;
  withGet?: boolean;

  // params?: { name?: any; url?: string; withDates?: boolean; urlDel?: string };
};

const useQueryCrud = (crud: TobCrudProps) => {
  // const hlpCrud = new HlpCrud(httpService);
  // const [loading, setLoading] = useState(true);
  // const [tobs, setTobs] = useState([]);
  // let tobs;
  const [tob, setTob] = useState(null);
  const [dates, setDates] = useState<any>(null);
  const [modal, setModal] = useState(false);

  const fetchDatas = () => {
    if (crud.getByParam) {
      return httpService.getByParam(crud.getByParam, crud.url).then((res) => res.data);
    }

    if ((crud.withDates && crud.postParam) || (crud.postParam && crud.withDates)) {
      return httpService.postBody({ ...crud.postParam, dates }, crud.url).then((res) => res.data);
    }

    if (crud.withDates) {
      return httpService.postBody({ dates }, crud.url).then((res) => res.data);
    }

    if (crud.postParam) {
      const name = crud.postParam;
      console.log("------ postParam ------");
      console.log(crud.postParam);
      console.log("------ postParam ------");
      // return httpService.postBody({ name }, crud.url).then((res) => res.data);
      return httpService.postBody({ ...crud.postParam }, crud.url).then((res) => res.data);
    }
    // if (crud.withGet) {
    return httpService.get(crud.url).then((res) => res.data);
    // setTobs(res.data);
    // }
  };

  // ------ data query ------
  const {
    data: tobs,
    error,
    isLoading,
  } = useQueryRead(
    crud.keys,
    fetchDatas,

    {
      staleTime: crud?.queryConfigs?.staleTime,
      cacheTime: crud?.queryConfigs?.cacheTime,
      refetchOnWindowFocus: crud?.queryConfigs?.refetchOnWindowFocus,
    }
  );

  const getUrl = (crud: TobCrudProps) => {
    if (crud?.urlOther) {
      return crud.urlOther;
    }
    return crud.url;
  };

  const getUrlUpdate = (crud: TobCrudProps) => {
    return !crud.urlUpdate ? crud.url : crud.urlUpdate;
  };

  const getKeys = (crud: TobCrudProps) => {
    /* if (crud.firstKeys) {
      return crud.firstKeys;
    } */
    return crud?.keys;
  };

  // ------ data mutation ------
  /* const createTob = useQueryCreate(httpService, getKeys(crud), getUrl(crud));
  const createTobOpti = useQueryCreateOpti(httpService, getKeys(crud), getUrl(crud));
  const updateTob = useQueryUpdate(httpService, getKeys(crud), getUrl(crud));
    const updateTobOpti = useQueryUpdateOpti(httpService, getKeys(crud), getUrl(crud));

  const delTob = useQueryDel(httpService, getKeys(crud), !crud.urlDel ? crud.url : crud.urlDel);
  const toggleTob = useQueryToggle(getKeys(crud), !crud?.urlToggle ? crud?.url : crud?.urlToggle, crud?.toggleProp); */
  const createTob = useQueryCreate(getKeys(crud), getUrl(crud));
  const createTobOpti = useQueryCreateOpti(getKeys(crud), getUrl(crud));
  const updateTob = useQueryUpdate(getKeys(crud), getUrlUpdate(crud));
  const updateTobOpti = useQueryUpdateOpti(getKeys(crud), getUrlUpdate(crud));
  const delTob = useQueryDel(getKeys(crud), !crud.urlDel ? crud.url : crud.urlDel);
  const toggleTob = useQueryToggle(getKeys(crud), !crud?.urlToggle ? crud?.url : crud?.urlToggle);

  const onAdd = () => {
    setModal(true);
  };

  const handleSubmit = async (tobValues) => {
    setModal(false);
    if (!crud.urlUpdate) {
      !crud.opti ? createTob.mutate(tobValues) : createTobOpti.mutate(tobValues);
    } else {
      if (tobValues.id) {
        !crud.opti ? updateTob.mutate(tobValues) : updateTobOpti.mutate(tobValues);
      } else {
        !crud.opti ? createTob.mutate(tobValues) : createTobOpti.mutate(tobValues);
      }
    }
    setTob(null);
  };

  const handleToggle = async (tob, propertyName) => {
    toggleTob.mutate({ tob: tob, propertyName: propertyName });
  };

  const handleEdit = (tob) => {
    showModal();
    setTob(tob);
  };

  const handleDelete = async (tob) => {
    delTob.mutate(tob);
  };

  const showModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setTob(null);
  };

  const cancelForm = () => {
    setModal(false);
    setTob(null);
  };

  const handleSelectedDates = (dates) => {
    setDates(dates);
    fetchDatas();
  };

  const handleRefresh = () => {
    fetchDatas();
  };

  const getDates = (values) => {
    setDates(values);
  };

  // --------------------
  return {
    cancelForm,
    closeModal,
    dates,
    error,
    handleDelete,
    handleEdit,
    handleRefresh,
    handleSelectedDates,
    handleSubmit,
    handleToggle,
    isLoading,
    getDates,
    modal,
    onAdd,
    setModal,
    showModal,
    tob,
    tobs,
  };
};

export default useQueryCrud;
