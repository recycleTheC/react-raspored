import React from 'react';
import Spin from 'react-bootstrap/Spinner';

export const Spinner = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spin animation='grow' variant='success' />
		</div>
	);
};

export default Spinner;
