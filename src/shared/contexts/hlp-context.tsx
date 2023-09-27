import { createContext, ReactNode, useContext, useState } from "react";

interface HlpType {
  hlpDates: any;
  setHlpDates: any;
}

type TobProps = {
  children: ReactNode;
};

const HlpContext = createContext<HlpType>({} as HlpType);

export const useHlpContext = () => useContext(HlpContext);

const HlpProvider = ({ children }: TobProps) => {
  const [hlpDates, setHlpDates] = useState(null);

  return <HlpContext.Provider value={{ hlpDates, setHlpDates }}>{children}</HlpContext.Provider>;
};

export default HlpProvider;
