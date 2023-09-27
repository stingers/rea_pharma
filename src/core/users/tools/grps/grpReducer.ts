import { UserGrp } from "asv-hlps";

interface Action {
  // state: UserGrp[];
  type: string;
}

const grpReducer = (state: UserGrp[], action: Action) => {
  switch (action.type) {
    case "ADD":
      break;

    default:
      return state;
      break;
  }
};

export default grpReducer;
