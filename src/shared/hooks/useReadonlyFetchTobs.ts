import { useEffect, useState } from "react";

type TobType = {
  // url: string;
  urlParam?: string | number;
  valueProp?: string;
  labelProp?: string;
  one?: boolean;
};

// const useReadonlyFetchTobs = ({ url, urlParam, valueProp = "id", labelProp = "name", one = false }: TobType) => {
const useReadonlyFetchTobs = (
  httpService: any,
  url: string,
  // opts: TobType = { urlParam: null, valueProp: "id", labelProp: "name", one: false }
  opts?: TobType
) => {
  const [tobs, setTobs] = useState([]);
  const [tob, setTob] = useState(null);

  const getDatas = async () => {
    try {
      if (!opts?.urlParam) {
        const { data: tobs } = await httpService.get(url);
        if (!opts?.one) {
          setTobs(tobs);
        } else {
          setTob(tobs);
        }
      } else {
        const { data: tobs } = await httpService.getByParam(opts?.urlParam, url);

        if (!opts?.one) {
          setTobs(tobs);
        } else {
          setTob(tobs);
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    getDatas();
    return () => {};
  }, []);
  // const options = useMemo(() => selectOptionsToLabelAndValue(tobs, valueProp, labelProp), []);
  // const options = selectOptionsToLabelAndValue(tobs, opts?.valueProp, opts?.labelProp);
  // return { tob, tobs, options };
  return { tob, tobs };
};

export default useReadonlyFetchTobs;
// export default {tobs , options} ;
