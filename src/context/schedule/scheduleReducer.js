import {
  GET_DAILY_SCHEDULE,
  SET_LOADING,
  GET_TEACHERS,
  CREATE_TEACHER,
  GET_NOTES,
  DELETE_NOTES,
  SET_NOTES,
  RESET_SCHEDULE,
  UPDATE_NOTES,
  GET_EXAMS,
  DELETE_EXAM,
  UPDATE_EXAM,
  CREATE_EXAM
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
        exams: [],
      };
    case GET_NOTES:
    case UPDATE_NOTES:
    case DELETE_NOTES:
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
    case CREATE_EXAM:
    case GET_EXAMS:
    case DELETE_EXAM:
    case UPDATE_EXAM:
      return {
        ...state,
        exams: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
