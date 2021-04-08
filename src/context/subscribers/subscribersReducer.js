import {
	REGISTER_SUBSCRIBER,
	UPDATE_SUBSCRIBER,
	SUBSCRIBER_STATUS_RESET,
	SUBSCRIBER_GET,
	SUBSCRIBER_GET_ERROR,
	UNREGISTER_SUBSCRIBER,
} from '../types';

export default (state, action) => {
	switch (action.type) {
	case REGISTER_SUBSCRIBER:
	case UPDATE_SUBSCRIBER:
	case UNREGISTER_SUBSCRIBER:
		return {
			...state,
			status: action.payload,
		};
	case SUBSCRIBER_STATUS_RESET:
		return {
			...state,
			status: null,
		};
	case SUBSCRIBER_GET:
		return {
			name: action.payload.name,
			email: action.payload.email,
			subscription: action.payload.subscription,
			status: null,
		};
	case SUBSCRIBER_GET_ERROR:
		return {
			...state,
			status: action.payload,
		};
	default:
		return state;
	}
};
