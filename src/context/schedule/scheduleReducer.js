import {
  GET_DAILY_SCHEDULE,
  SET_LOADING,
  GET_TEACHERS,
  CREATE_TEACHER,
  GET_NOTES,
  SET_NOTES,
  RESET_SCHEDULE,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_DAILY_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        loading: false,
      };
    case RESET_SCHEDULE:
      return {
        ...state,
        schedule: [],
      };
    case GET_NOTES:
      return {
        ...state,
        notes: action.payload,
        loading: false,
      };
    case SET_NOTES:
      return {
        ...state,
        notes: action.payload,
        loading: false,
      };
    case GET_TEACHERS:
      return {
        ...state,
        teachers: action.payload,
        loading: false,
      };
    case CREATE_TEACHER:
      return {
        ...state,
        status: action.payload,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
