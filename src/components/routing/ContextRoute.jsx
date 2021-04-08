import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const ContextRoute = ({ component: Component, context: Context, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => (
				<Context>
					<Component {...rest} {...props} />
				</Context>
			)}
		/>
	);
};

ContextRoute.propTypes = {
	component: PropTypes.func,
	context: PropTypes.func,
};

export default ContextRoute;
