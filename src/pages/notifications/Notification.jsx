import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ScheduleContext from '../../context/schedule/scheduleContext';
import { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import locale from 'date-fns/locale/hr';
import Spinner from '../../components/spinner/Spinner';
import ReactMarkdown from 'react-markdown';
import AuthContext from '../../context/auth/authContext';
import { Link, Redirect } from 'react-router-dom';

export const Notification = ({ match }) => {
	const scheduleContext = useContext(ScheduleContext);
	const {
		getNotificationById,
		deleteNotification,
		notification,
		loading,
	} = scheduleContext;
	const authContext = useContext(AuthContext);

	const [success, setSuccess] = useState();

	useState(() => {
		getNotificationById(match.params.id);
	}, []);

	const deletion = async () => {
		await deleteNotification(match.params.id);
		setSuccess(true);
	};

	const edit = (
		<>
			<Link to={`/notifications/edit/${match.params.id}`}>
				<Badge variant='warning' pill>
					Uredi
				</Badge>
			</Link>{' '}
			<Badge variant='danger' pill onClick={deletion}>
				Obriši
			</Badge>
		</>
	);

	if (loading || !notification.title) return <Spinner />;
	else
		return (
			<div>
				<div className='d-flex justify-content-between align-items-center'>
					<div>
						<h1>{notification.title}</h1>
					</div>
					<div>
						<Badge variant='primary' pill>
							Od{' '}
							{format(new Date(notification.fromDate), 'dd.MM.yyyy.', {
								locale,
							})}
						</Badge>{' '}
						<Badge variant='success' pill>
							Do{' '}
							{format(new Date(notification.toDate), 'dd.MM.yyyy.', {
								locale,
							})}
						</Badge>{' '}
						{!loading && authContext.isAuthenticated && edit}
					</div>
				</div>
				<ReactMarkdown source={notification.content} />
				{success && <Redirect push to='/notifications/' />}
			</div>
		);
};

Notification.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};

export default Notification;
