import jsonFile from "./../../assets/data/data.json";

const defaultState = { data: jsonFile };
//todo separate these stores, no need to recopy all of data when a language changes
const data = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default data;
