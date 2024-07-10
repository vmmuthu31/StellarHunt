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
