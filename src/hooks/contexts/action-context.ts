import { createContext } from "react";

interface ActionContextType {
  onClose: () => void;
}

const ActionContext = createContext<ActionContextType>({} as ActionContextType);

export default ActionContext;
