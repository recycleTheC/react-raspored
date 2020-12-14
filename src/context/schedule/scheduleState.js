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
	GET_ALL_NOTES,
	SET_SELECTED_CLASS,
	GET_ALL_EXAMS,
	GET_NOTIFICATION,
	GET_ALL_NOTIFICATIONS,
	GET_NOTIFICATION_BY_ID,
	DELETE_NOTIFICATION,
	CREATE_NOTIFICATION,
	GET_CLASS_EXAMS,
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
		classNotes: [],
		classExams: [],
		selectedClass: '',
		notification: {},
		dailyNotifications: [],
		notifications: [],
	};

	const [state, dispatch] = useReducer(ScheduleReducer, initialState);

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
							state.changes[k].changed &&
							state.changes[k].changed._id === current._id &&
							state.changes[k].classId === id
						) {
							const regularId = current._id;
							const regularName = current.name;
							current = { ...state.changes[k].substitution };
							current.changed = true;
							current.regular = { id: regularId, name: regularName };
						}

						if (state.changes[k].classId === id && state.changes[k].location) {
							if (state.changes[k].location !== location) {
								location = state.changes[k].location;
								locationChanged = true;
							}
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
		await getNotification(date);

		try {
			const res = await axios.get(
				`/api/schedule/${format(date, 'yyyy-MM-dd')}`
			);

			dispatch({
				type: GET_DAILY_SCHEDULE,
				payload: res.data,
			});
		} catch (err) {
			const data = err.response.data;
			var content = {
				msg: data.status,
			};
			if (data.options) content.options = data.options;

			dispatch({
				type: GET_DAILY_SCHEDULE,
				payload: content,
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
			const res = await axios.get(
				`/api/exam/date/${format(date, 'yyyy-MM-dd')}`
			);

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

			const compare = (a, b) => {
				if (a.classId < b.classId) {
					return -1;
				}
				if (a.classId > b.classId) {
					return 1;
				}
				return 0;
			};

			dispatch({
				type: GET_CHANGES,
				payload: res.data.sort(compare),
			});
		} catch (err) {
			dispatch({
				type: GET_CHANGES,
				payload: [],
			});
		}
	};

	const createChange = async (date, values) => {
		setLoading();

		const send = {
			date: format(date, 'yyyy-MM-dd'),
			classId: parseInt(values.classId),
		};

		if (values.changed && values.substitution && values.changeClass) {
			if (values.changed) send.changed = values.changed;
			if (values.substitution) send.substitution = values.substitution;
		}

		if (values.location) send.location = values.location;

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

	const updateChange = async (values) => {
		setLoading();

		const send = {
			classId: parseInt(values.classId),
		};

		if (values.changed && values.substitution && values.changeClass) {
			if (values.changed) send.changed = values.changed;
			if (values.substitution) send.substitution = values.substitution;
		}

		if (values.location) send.location = values.location;

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.put(
				`/api/changes/${values.changeId}`,
				send,
				options
			);

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

	const getAllNotes = async (classId) => {
		setLoading();

		try {
			const res = await axios.get(`/api/notes/class/${classId}`);

			dispatch({
				type: GET_ALL_NOTES,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_ALL_NOTES,
				payload: [],
			});
		}
	};

	const getExamsById = async (classId) => {
		setLoading();

		try {
			const res = await axios.get(`/api/exam/class/${classId}`);

			dispatch({
				type: GET_CLASS_EXAMS,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_CLASS_EXAMS,
				payload: [],
			});
		}
	};

	const getAllExams = async () => {
		setLoading();

		try {
			const res = await axios.get('/api/exam/all/');

			dispatch({
				type: GET_ALL_EXAMS,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_ALL_EXAMS,
				payload: [],
			});
		}
	};

	const setSelectedClass = (selected) => {
		dispatch({
			type: SET_SELECTED_CLASS,
			payload: selected,
		});
	};

	const getNotification = async (date) => {
		try {
			const res = await axios.get(
				`/api/notifications/day/${format(date, 'yyyy-MM-dd')}`
			);

			dispatch({
				type: GET_NOTIFICATION,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_NOTIFICATION,
				payload: [],
			});
		}
	};

	const getAllNotifications = async () => {
		try {
			const res = await axios.get('/api/notifications/all/');

			dispatch({
				type: GET_ALL_NOTIFICATIONS,
				payload: res.data.sort(compareNotifications),
			});
		} catch (err) {
			dispatch({
				type: GET_ALL_NOTIFICATIONS,
				payload: [],
			});
		}
	};

	const getNotificationById = async (id) => {
		setLoading();
		try {
			const res = await axios.get(`/api/notifications/id/${id}`);

			dispatch({
				type: GET_NOTIFICATION_BY_ID,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_NOTIFICATION_BY_ID,
				payload: {},
			});
		}
	};

	const updateNotification = async (id, send) => {
		try {
			const options = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const res = await axios.put(`/api/notifications/${id}`, send, options);

			dispatch({
				type: GET_NOTIFICATION_BY_ID,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: GET_NOTIFICATION_BY_ID,
				payload: {},
			});
		}
	};

	const createNotification = async (send) => {
		try {
			const options = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const res = await axios.post('/api/notifications', send, options);

			dispatch({
				type: CREATE_NOTIFICATION,
				payload: res.data.sort(compareNotifications),
			});
		} catch (err) {
			dispatch({
				type: CREATE_NOTIFICATION,
				payload: [],
			});
		}
	};

	const deleteNotification = async (id) => {
		try {
			await axios.delete(`/api/notifications/${id}`);

			dispatch({
				type: DELETE_NOTIFICATION,
			});
		} catch (err) {
			dispatch({
				type: DELETE_NOTIFICATION,
			});
		}
	};

	const compareNotifications = (a, b) => {
		if (a.fromDate > b.fromDate) {
			return -1;
		}
		if (a.fromDate < b.fromDate) {
			return 1;
		}
		return 0;
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
				classNotes: state.classNotes,
				classExams: state.classExams,
				selectedClass: state.selectedClass,
				notification: state.notification,
				notifications: state.notifications,
				dailyNotifications: state.dailyNotifications,

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
				getAllNotes,
				getExamsById,
				getAllExams,
				setSelectedClass,
				getNotification,
				getAllNotifications,
				getNotificationById,
				updateNotification,
				deleteNotification,
				createNotification,
			}}
		>
			{props.children}
		</ScheduleContext.Provider>
	);
};

export default ScheduleState;
