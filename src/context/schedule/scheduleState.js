import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import ScheduleContext from './scheduleContext';
import ScheduleReducer from './scheduleReducer';

import {
	GET_SCHEDULE,
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
	GET_CHANGES,
	CREATE_CHANGE,
	UPDATE_CHANGE,
	DELETE_CHANGE,
	GET_CLASSES,
} from '../types';

const ScheduleState = (props) => {
	const initialState = {
		schedule: [],
		teachers: [],
		loading: false,
		notes: [],
		status: {},
		exams: [],
		changes: [],
		rawSchedule: [],
		classes: [],
		reload: false,
	};

	const [state, dispatch] = useReducer(ScheduleReducer, initialState);

	/*useEffect(() => {
		prepareSchedule();
		// eslint-disable-next-line
	}, [state.rawSchedule, state.changes, state.notes, state.exams]);*/

	useEffect(() => {
		if (state.reload) prepareSchedule();
		// eslint-disable-next-line
	}, [state.reload]);

	// Get schedule

	const prepareSchedule = () => {
		setLoading();

		var scheduleItems = [];

		if (!state.rawSchedule.msg) {
			const schedule = state.rawSchedule.slice();

			for (let i = 0; i < schedule.length; i++) {
				let row = { ...schedule[i] };

				let location = row.location;
				let timeStart = row.timeStart;
				let timeEnd = row.timeEnd;
				let scheduleId = row._id;
				let classes = [];
				let id = row.id;
				let locationChanged = false;

				row.class.forEach((item) => {
					classes.push(item);
				});

				for (let j = 0; j < classes.length; j++) {
					let current = { ...classes[j] };
					current.changed = false;

					for (let k = 0; k < state.changes.length; k++) {
						if (
							state.changes[k].changed === current._id &&
							state.changes[k].classId === id
						) {
							const regularId = current._id;
							current = { ...state.changes[k].substitution };
							current.changed = true;
							current.regular = regularId;
						}

						if (state.changes[k].classId === id && state.changes[k].location) {
							location = state.changes[k].location;
							locationChanged = true;
						}
					}

					let classKey = current._id;
					current.notes = [];
					current.exams = [];

					let classNotes = state.notes.filter(
						(note) => note.classKey === classKey && note.classId === id
					);
					classNotes.forEach((item) => {
						current.notes.push(item.note);
					});

					let classExams = state.exams.filter(
						(exam) => exam.classKey._id === classKey && exam.classId === id
					);

					classExams.forEach((item) => {
						current.exams.push(item.content);
					});

					classes[j] = { ...current };
				}

				const data = {
					scheduleId,
					id,
					location,
					timeStart,
					timeEnd,
					classes,
				};

				locationChanged && (data.locationChanged = locationChanged);

				scheduleItems.push(data);
			}
		} else {
			scheduleItems = { ...state.rawSchedule };
		}

		dispatch({
			type: GET_SCHEDULE,
			payload: scheduleItems,
		});
	};

	const clearSchedule = () => {
		dispatch({
			type: RESET_SCHEDULE,
		});
	};

	const getSchedule = async (date) => {
		clearSchedule();
		await setLoading();

		await getExams(date);
		await getNotes(date);
		await getChanges(date);

		try {
			const res = await axios.get(
				`/api/schedule/${format(date, 'yyyy-MM-dd')}`
			);

			dispatch({
				type: GET_DAILY_SCHEDULE,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_DAILY_SCHEDULE,
				payload: { msg: 'Raspored nije pronađen' },
			});
		}
	};

	// Get notes

	const getNotes = async (date) => {
		try {
			const res = await axios.get(`/api/notes/${format(date, 'yyyy-MM-dd')}`);

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
		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.get('/api/teacher/', options);

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
			date: format(date, 'yyyy-MM-dd'),
		};

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.post('/api/notes/', send, options);

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
				'Content-Type': 'application/json',
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

	const setLoading = async () => {
		dispatch({ type: SET_LOADING });
	};

	// Create teacher

	const createTeacher = async (name) => {
		setLoading();

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.post('/api/teacher/', { name }, options);
			dispatch({
				type: CREATE_TEACHER,
				payload: {
					msg: 'Predavač dodan u bazu podataka',
					type: 'success',
					response: res.data,
				},
			});
		} catch (error) {
			dispatch({
				type: CREATE_TEACHER,
				payload: {
					msg: 'Predavač nije dodan u bazu podataka',
					type: 'warning',
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
			date: format(date, 'yyyy-MM-dd'),
		};

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.post('/api/exam/', send, options);

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
			const res = await axios.get(`/api/exam/${format(date, 'yyyy-MM-dd')}`);

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
				'Content-Type': 'application/json',
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

	const getChanges = async (date) => {
		try {
			const res = await axios.get(`/api/changes/${format(date, 'yyyy-MM-dd')}`);

			dispatch({
				type: GET_CHANGES,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_CHANGES,
				payload: [],
			});
		}
	};

	const createChange = async (date, id, changed, substitution, location) => {
		setLoading();

		const send = {
			date: format(date, 'yyyy-MM-dd'),
			classId: parseInt(id),
		};

		if (changed !== substitution) {
			if (changed) send.changed = changed;
			if (substitution) send.substitution = substitution;
		}

		if (location) send.location = location;

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.post('/api/changes/', send, options);

			dispatch({
				type: CREATE_CHANGE,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: CREATE_CHANGE,
				payload: [],
			});
		}
	};

	const deleteChange = async (changeId) => {
		setLoading();

		try {
			const res = await axios.delete(`/api/changes/${changeId}`);

			dispatch({
				type: DELETE_CHANGE,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: DELETE_CHANGE,
				payload: [],
			});
		}
	};

	const updateChange = async (
		changeId,
		id,
		changed,
		substitution,
		location
	) => {
		setLoading();

		const send = {
			classId: parseInt(id),
		};

		if (changed) send.changed = changed;
		if (substitution) send.substitution = substitution;
		if (location) send.location = location;

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.put(`/api/changes/${changeId}`, send, options);

			dispatch({
				type: UPDATE_CHANGE,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: UPDATE_CHANGE,
				payload: [],
			});
		}
	};

	const getClasses = async () => {
		try {
			const res = await axios.get('/api/class/');

			dispatch({
				type: GET_CLASSES,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_CLASSES,
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
				changes: state.changes,
				classes: state.classes,

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
				getChanges,
				createChange,
				updateChange,
				deleteChange,
				getClasses,
				clearSchedule,
			}}
		>
			{props.children}
		</ScheduleContext.Provider>
	);
};

export default ScheduleState;
