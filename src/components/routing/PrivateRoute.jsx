import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const authContext = useContext(AuthContext);
	const { isAuthenticated } = authContext;

	return (
		<Route
			{...rest}
			render={(props) =>
				!isAuthenticated ? <Redirect to='/login' /> : <Component {...props} />
			}
		/>
	);
};

PrivateRoute.propTypes = {
	component: PropTypes.func,
};

export default PrivateRoute;
