import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ScheduleContext from '../../context/schedule/scheduleContext';
import Spinner from '../../components/spinner/Spinner';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import DatePick from '../../components/date-picker/DatePick';
import { format } from 'date-fns';
import { Redirect } from 'react-router-dom';

export const EditNotification = ({ match }) => {
	const scheduleContext = useContext(ScheduleContext);
	const {
		getNotificationById,
		updateNotification,
		createNotification,
		notification,
		loading,
	} = scheduleContext;

	const id = match.params.id;
	const create = id === 'new';

	const onSubmit = async (values) => {
		const send = {
			content: values.content,
			title: values.title,
			fromDate: format(fromDate, 'yyyy-MM-dd'),
			toDate: format(toDate, 'yyyy-MM-dd'),
		};

		if (create) await createNotification(send);
		else await updateNotification(notification._id, send);

		setSuccess(true);
	};

	const { handleSubmit, register, setValue } = useForm();

	const [fromDate, setFromDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!notification && !create) {
			getNotificationById(id);
		}
	}, []);

	useEffect(() => {
		if (notification && !create) {
			setValue('content', notification.content);
			setValue('title', notification.title);
			setFromDate(new Date(notification.fromDate));
			setToDate(new Date(notification.toDate));
		}
	}, [notification]);

	if (loading || notification === null) return <Spinner />;
	else {
		return (
			<div>
				<Form>
					<h1>
						<Form.Control as='input' name='title' ref={register()} />
					</h1>
					<Form.Group>
						<Form.Control
							as='textarea'
							name='content'
							ref={register()}
							rows={10}
						/>
					</Form.Group>

					<Form.Group>
						<strong>Datum početka: </strong>
						<DatePick date={fromDate} setDate={setFromDate} />
						<br />
						<strong>Datum kraja: </strong>
						<DatePick date={toDate} setDate={setToDate} />
					</Form.Group>

					<Button variant='success' onClick={handleSubmit(onSubmit)}>
						Spremi izmjene
					</Button>
				</Form>
				{success && !create && (
					<Redirect push to={`/notifications/${match.params.id}`} />
				)}
				{success && create && <Redirect push to='/notifications/' />}
			</div>
		);
	}
};

EditNotification.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};

export default EditNotification;
