import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';
import { Toast } from 'react-bootstrap';

const Alerts = () => {
	const alertContext = useContext(AlertContext);

	return (
		<div
			aria-live='polite'
			aria-atomic='true'
			style={{
				position: 'relative',
				minHeight: '200px',
				float: 'right',
				zIndex: '100',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					right: 0,
				}}
			>
				{alertContext.alerts.length > 0 &&
					alertContext.alerts.map((alert) => (
						<Toast key={alert.id}>
							<Toast.Header closeButton={false}>
								<strong className='mr-2'>{alert.title}</strong>
								<small>upravo sada</small>
							</Toast.Header>
							<Toast.Body>{alert.msg}</Toast.Body>
						</Toast>
					))}
			</div>
		</div>
	);
};

export default Alerts;
