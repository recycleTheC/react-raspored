/* eslint-disable indent */
import {
	GET_SCHEDULE,
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
	CREATE_EXAM,
	GET_CHANGES,
	CREATE_CHANGE,
	UPDATE_CHANGE,
	DELETE_CHANGE,
	GET_CLASSES,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case GET_SCHEDULE:
			return {
				...state,
				schedule: action.payload,
				loading: false,
			};

		case GET_DAILY_SCHEDULE:
			return {
				...state,
				rawSchedule: action.payload,
			};

		case RESET_SCHEDULE:
			return {
				...state,
				schedule: [],
				exams: [],
				changes: [],
				rawSchedule: [],
			};

		case GET_NOTES:
			return {
				...state,
				notes: action.payload,
			};

		case UPDATE_NOTES:
		case DELETE_NOTES:
		case SET_NOTES:
			return {
				...state,
				notes: action.payload,
				loading: false,
			};

		case GET_TEACHERS:
		case CREATE_TEACHER:
			return {
				...state,
				teachers: action.payload,
				loading: false,
			};
		case GET_CLASSES:
			return {
				...state,
				classes: action.payload,
			};

		case SET_LOADING:
			return {
				...state,
				loading: true,
			};

		case GET_EXAMS:
			return {
				...state,
				exams: action.payload,
			};
		case CREATE_EXAM:
		case DELETE_EXAM:
		case UPDATE_EXAM:
			return {
				...state,
				exams: action.payload,
				loading: false,
			};

		case GET_CHANGES:
			return {
				...state,
				changes: action.payload,
			};
		case CREATE_CHANGE:
		case UPDATE_CHANGE:
		case DELETE_CHANGE:
			return {
				...state,
				changes: action.payload,
				loading: false,
			};

		default:
			return state;
	}
};
