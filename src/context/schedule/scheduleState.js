import React, { useReducer } from "react";
import axios from "axios";
import { format } from "date-fns";

import ScheduleContext from "./scheduleContext";
import ScheduleReducer from "./scheduleReducer";

import {
  GET_DAILY_SCHEDULE,
  SET_LOADING,
  GET_TEACHERS,
  CREATE_TEACHER,
  GET_NOTES,
  SET_NOTES,
  RESET_SCHEDULE,
  DELETE_NOTES,
  UPDATE_NOTES,
  CREATE_EXAM,
  GET_EXAMS,
  DELETE_EXAM,
  UPDATE_EXAM,
} from "../types";

const ScheduleState = (props) => {
  const initialState = {
    schedule: [],
    teachers: [],
    loading: false,
    notes: [],
    status: {},
    exams: [],
  };

  const [state, dispatch] = useReducer(ScheduleReducer, initialState);

  // Get schedule

  const getSchedule = async (date) => {
    setLoading();

    dispatch({
      type: RESET_SCHEDULE,
    });

    try {
      const res = await axios.get(
        `/api/schedule/${format(date, "yyyy-MM-dd")}`
      );

      await getNotes(date);
      await getExams(date);

      dispatch({
        type: GET_DAILY_SCHEDULE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: GET_DAILY_SCHEDULE,
        payload: { msg: "Raspored nije pronađen" },
      });
    }
  };

  // Get notes

  const getNotes = async (date) => {
    try {
      const res = await axios.get(`/api/notes/${format(date, "yyyy-MM-dd")}`);

      dispatch({
        type: GET_NOTES,
        payload: res.data,
      });
    } catch (err) {
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

  // Update note

  const updateNotes = async (id, classKey, classId, note) => {
    setLoading();

    const send = {
      classId: classId,
      classKey: classKey,
      note: note,
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.put(`/api/notes/${id}`, send, options);

      dispatch({
        type: UPDATE_NOTES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: UPDATE_NOTES,
        payload: [],
      });
    }
  };

  // Delete note

  const deleteNote = async (id) => {
    setLoading();

    try {
      const res = await axios.delete(`/api/notes/${id}`);

      dispatch({
        type: DELETE_NOTES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: DELETE_NOTES,
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

  const createExam = async (date, classKey, classId, content) => {
    setLoading();

    const send = {
      classId: classId,
      classKey: classKey,
      content: content,
      date: format(date, "yyyy-MM-dd"),
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`/api/exam/`, send, options);

      dispatch({
        type: CREATE_EXAM,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CREATE_EXAM,
        payload: [],
      });
    }
  };

  const getExams = async (date) => {
    try {
      const res = await axios.get(`/api/exam/${format(date, "yyyy-MM-dd")}`);

      dispatch({
        type: GET_EXAMS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: GET_EXAMS,
        payload: [],
      });
    }
  };

  // Delete exam

  const deleteExam = async (id) => {
    setLoading();

    try {
      const res = await axios.delete(`/api/exam/${id}`);

      dispatch({
        type: DELETE_EXAM,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: DELETE_EXAM,
        payload: [],
      });
    }
  };

  // Update exam

  const updateExam = async (id, classKey, classId, content) => {
    setLoading();

    const send = {
      classId: classId,
      classKey: classKey,
      content: content,
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.put(`/api/exam/${id}`, send, options);

      dispatch({
        type: UPDATE_EXAM,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: UPDATE_EXAM,
        payload: [],
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
        exams: state.exams,

        getSchedule,
        setLoading,
        getTeachers,
        getNotes,
        setNotes,
        deleteNote,
        updateNotes,
        createTeacher,
        createExam,
        deleteExam,
        updateExam,
      }}
    >
      {props.children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleState;
