export const setMap = (map) => {
  return {
    type: "SET_MAP",
    payload: map,
  };
};

export const setTime = (time) => {
  return {
    type: "SET_TIME",
    payload: time,
  };
};

export const setValue = (value) => {
  return {
    type: "SET_VALUE",
    payload: value,
  };
};

export const setGameid = (gameid) => {
  return {
    type: "SET_GAMEID",
    payload: gameid,
  };
};
