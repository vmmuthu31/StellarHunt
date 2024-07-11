const initialState = {
  map: null,
  time: 60,
  value: null,
  gameid: null,
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
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload,
      };
    case "SET_GAMEID":
      return {
        ...state,
        gameid: action.payload,
      };
    default:
      return state;
  }
};

export default gameReducer;
