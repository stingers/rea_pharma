const tobReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return [...state, action.tob];

    case "del":
      return state.filter((tob) => tob !== action.tob);

    default:
      return state;
  }
};

export default tobReducer;
