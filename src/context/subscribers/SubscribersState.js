import React, { useReducer } from 'react';
import axios from 'axios';

import SubscribersContext from './subscribersContext';
import SubscribersReducer from './subscribersReducer';

import {
	REGISTER_SUBSCRIBER,
	SUBSCRIBER_STATUS_RESET,
	SUBSCRIBER_GET,
	SUBSCRIBER_GET_ERROR,
	UPDATE_SUBSCRIBER,
	UNREGISTER_SUBSCRIBER,
} from '../types';

const AuthState = (props) => {
	const initialState = {
		name: '',
		email: '',
		subscription: [],
		status: '',
	};

	const [state, dispatch] = useReducer(SubscribersReducer, initialState);

	const register = async (name, email, subscription) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const data = {
			name,
			email,
			subscription,
		};

		try {
			const res = await axios.post('/api/subscribers/', data, config);

			dispatch({
				type: REGISTER_SUBSCRIBER,
				payload: res.data.msg,
			});
		} catch (err) {
			dispatch({
				type: REGISTER_SUBSCRIBER,
				payload: err.response.data.msg,
			});
		}
	};

	const request = async (email) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.post(
				'/api/subscribers/request',
				{ email },
				config
			);

			dispatch({
				type: REGISTER_SUBSCRIBER,
				payload: res.data.msg,
			});
		} catch (err) {
			dispatch({
				type: REGISTER_SUBSCRIBER,
				payload: err.response.data.msg,
			});
		}
	};

	const getSubscriber = async (accessKey) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.get(`/api/subscribers/${accessKey}`, config);

			dispatch({
				type: SUBSCRIBER_GET,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: SUBSCRIBER_GET_ERROR,
				payload: err.response.data.msg,
			});
		}
	};

	const update = async (key, name, email, subscription) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const data = {
			name,
			email,
			subscription,
			accessKey: key,
		};

		try {
			const res = await axios.put('/api/subscribers/', data, config);

			dispatch({
				type: UPDATE_SUBSCRIBER,
				payload: res.data.msg,
			});
		} catch (err) {
			dispatch({
				type: UPDATE_SUBSCRIBER,
				payload: err.response.data.msg,
			});
		}
	};

	const unregister = async (key) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.delete(
				'/api/subscribers/',
				{ data: { accessKey: key } },
				config
			);

			dispatch({
				type: UNREGISTER_SUBSCRIBER,
				payload: res.data.msg,
			});
		} catch (err) {
			dispatch({
				type: UNREGISTER_SUBSCRIBER,
				payload: err.response.data.msg,
			});
		}
	};

	const clearStatus = () => {
		dispatch({
			type: SUBSCRIBER_STATUS_RESET,
		});
	};

	return (
		<SubscribersContext.Provider
			value={{
				name: state.name,
				email: state.email,
				subscription: state.subscription,
				status: state.status,

				register,
				request,
				update,
				clearStatus,
				getSubscriber,
				unregister,
			}}
		>
			{props.children}
		</SubscribersContext.Provider>
	);
};

export default AuthState;
