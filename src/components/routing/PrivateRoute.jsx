import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthContext from '../../context/auth/authContext';
import Spinner from '../spinner/Spinner';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const authContext = useContext(AuthContext);
	const { isAuthenticated, token } = authContext;

	if (!isAuthenticated && token) {
		return <Spinner />;
	}

	return (
		<Route
			{...rest}
			render={(props) =>
				!isAuthenticated ? (
					<Redirect to='/login' />
				) : (
					<Component {...rest} {...props} />
				)
			}
		/>
	);
};

PrivateRoute.propTypes = {
	component: PropTypes.func,
};

export default PrivateRoute;
