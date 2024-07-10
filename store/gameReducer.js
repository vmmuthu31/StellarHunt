const initialState = {
  map: null,
  time: 60,
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MAP":
      return {
        ...state,
        map: action.payload,
      };
    case "SET_TIME":
      return {
        ...state,
        time: action.payload,
      };
    default:
      return state;
  }
};

export default gameReducer;
