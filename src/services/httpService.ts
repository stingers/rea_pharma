import axios, { AxiosHeaders } from "axios";
import { toast } from "react-toastify";

import config from "../config";
import storageService from "./storageService";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.API_URL;
axios.interceptors.request.use((config) => {
  // const token = localStorage.getItem("awToken");
  const token = storageService.getStorage("awPharma");
  // config.headers.Authorization = token;
  if (config.headers) {
    (config.headers as AxiosHeaders).set("Authorization", token);
  }
  // config.headers.Authorization = token;
  return config;
});

// intercepting to capture errors
axios.interceptors.response.use(
  // (response) => {},
  null,
  (error) => {
    let message: string = "";
    const expertedError = error.response && error.response.status >= 400 && error.response.status < 500;
    if (expertedError) {
      switch (error.response.status) {
        case 401:
          message = "Invalid credentials";
          break;
        case 403:
          message = "Access Forbidden";
          break;
        case 404:
          message = "Sorry! the data you are looking for could not be found";
          break;
        default: {
          message = error.response && error.response.data ? error.response.data["message"] : error.message || error;
        }
      }
    } else {
      toast.error("Une erreur s'est produite. Nous pouvons pas traiter votre demande. Merci de votre comprehebsion");
      // alert("Une erreur s'est produite. Nous pouvons pas traiter votre demande. Merci de votre comprehebsion");
    }
    return Promise.reject(message);
  }
);
const create = (data, url: string) => axios.post(url, data);

const postDel = (url: string, data) => axios.post(url + "/del", data);
const del = (id: number | string, url: string) => axios.delete(`${url}/${id}`);

const getByQueryParam = (url: string, params: any) => axios.get(url, { params: params });

const getByParam = (param: string | number, url: string) => axios.get(`${url}/${param}`);
// const findById = (param: string | number, url: string) => axios.get(`${url}/${param}`);
const findById = (id: string | number, url: string) => axios.get(`${url}/${id}`);
const putBody = (id: string | number, data: any, url: string) => axios.put(`${url}/${id}`, data);
const getByTwoParams = <TData = any>(param: string | number, param2: string | number, url: string) =>
  axios.get<TData>(`${url}/${param}/${param2}`);
const getByDatesParams = <TData = any>(fromDate: string, toDate: string, url: string) => axios.get<TData>(`${url}/${fromDate}/${toDate}`);
const getByDates = <TData = any>(dates: { fromDate: string; toDate: string }, url: string) =>
  axios.get<TData>(`${url}/${dates?.fromDate}/${dates?.toDate}`);
const postId = (id: number | string, url: string) => axios.post(url, { id });
const postParam = <TData = any>(param: any, url: string) => axios.post<TData>(url, { param });
const postBody = <TData = any>(data: any, url: string) => axios.post<TData>(url, data);
const findWithDates = (url: string, dates?: any) => {
  // return !dates ? axios.get : getByDatesParams(url, dates.fromDate, dates.toDate);
  return !dates ? axios.get(`${url}`) : axios.get(`${url}/${dates.fromDate}/${dates.toDate}`);
};
const search = (search: string, url: string) => axios.get(`${url}/search?search=${search}`);
/* 
  if (!search.trim()) {
    return [];
  } */
export default {
  get: axios.get,
  delete: axios.delete,

  put: axios.post,
  create,
  post: axios.post,
  del,
  postDel,
  getByQueryParam,
  getByParam,
  findById,
  getByTwoParams,
  getByDates,
  search,
  postId,
  postParam,
  postBody,
  putBody,
  getByDatesParams,
  findWithDates,
};
