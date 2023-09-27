import { useQueryFn } from "asv-hlps-react";
import { useEffect, useState } from "react";

type TobType = {
  /* url: string;
  httpService: any;
  options?: { */
  param?: string | number;
  // valueProp?: string;
  // labelProp?: string;
  one?: boolean;
  // layout?: boolean;
  clear?: boolean;

  // }
};

const useReadonlyFetchTobs = (
  httpService: any,
  url: string,
  opts?: TobType
  // param: number | string,
  // one,
  // opts: TobType = { param: null, valueProp: "id", labelProp: "name", one: false, layout: false }
) => {
  const [tobs, setTobs] = useState([]);
  const [tob, setTob] = useState(null);
  const [loading, setLoading] = useState(true);

  // const queryfetch = () => httpService.get(url).then((res) => res.data);

  const fetchTobs = async () => {
    try {
      const { data } = !opts?.param ? await httpService.get(url) : await httpService.getByParam(opts.param, url);
      !opts?.one ? setTobs(data) : setTob(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchTobs();
    if (opts?.clear) {
      return () => {};
    }
  }, []);

  return { tob, tobs };
};

export default useReadonlyFetchTobs;
// export default {tobs , options} ;
