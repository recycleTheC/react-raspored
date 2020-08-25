import React, { useReducer } from "react";
import axios from "axios";
import { getWeek, format } from "date-fns";
import locale from "date-fns/locale/hr";

import ScheduleContext from "./scheduleContext";
import ScheduleReducer from "./scheduleReducer";

import {
  GET_DAILY_SCHEDULE,
  SET_LOADING,
  GET_TEACHERS,
  CREATE_TEACHER,
  GET_NOTES,
  SET_NOTES,
} from "../types";

const ScheduleState = (props) => {
  const initialState = {
    schedule: [],
    teachers: [],
    loading: false,
    notes: [],
    status: {},
  };

  const [state, dispatch] = useReducer(ScheduleReducer, initialState);

  // Get schedule

  /**
   * @todo Schedule is determined by date on server
   * @body Client should send a request with date only, not the additional data. Server should interpret the date and determine the exact schedule which should be returned to the client.
   */

  const getSchedule = async (date) => {
    setLoading();

    const week = getWeek(date) % 2 === 0 ? "parni" : "neparni"; // this should happen on server
    const day = format(date, "eeee", { locale, weekStartsOn: 2 });

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(`/api/schedule/${week}/${day}/`, options); // send just date

      dispatch({
        type: GET_DAILY_SCHEDULE,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: GET_DAILY_SCHEDULE,
        //payload: err.data.msg,
        payload: { msg: "Raspored nije pronađen" },
      });
    }
  };

  // Get notes

  const getNotes = async (date) => {
    setLoading();

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(
        `/api/notes/${format(date, "yyyy-MM-dd")}`,
        options
      );

      dispatch({
        type: GET_NOTES,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: GET_NOTES,
        payload: [],
      });
    }
  };

  // Get list of all teachers

  const getTeachers = async () => {
    setLoading();

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(`/api/teacher/`, options);

      dispatch({
        type: GET_TEACHERS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: GET_TEACHERS,
        payload: [],
      });
    }
  };

  // Set new note

  const setNotes = async (date, classKey, id, note) => {
    setLoading();

    const send = {
      classId: id,
      classKey: classKey,
      note: note,
      date: format(date, "yyyy-MM-dd"),
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`/api/notes/`, send, options);

      dispatch({
        type: SET_NOTES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: SET_NOTES,
        payload: [],
      });
    }
  };

  // Set loading state

  const setLoading = () => dispatch({ type: SET_LOADING });

  // Create teacher

  const createTeacher = async (name) => {
    setLoading();

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`/api/teacher/`, { name }, options);
      dispatch({
        type: CREATE_TEACHER,
        payload: {
          msg: "Predavač dodan u bazu podataka",
          type: "success",
          response: res.data,
        },
      });
    } catch (error) {
      dispatch({
        type: CREATE_TEACHER,
        payload: {
          msg: "Predavač nije dodan u bazu podataka",
          type: "warning",
          response: error.data,
        },
      });
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        schedule: state.schedule,
        teachers: state.teachers,
        loading: state.loading,
        notes: state.notes,
        status: state.status,

        getSchedule,
        setLoading,
        getTeachers,
        getNotes,
        setNotes,
        createTeacher,
      }}
    >
      {props.children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleState;
