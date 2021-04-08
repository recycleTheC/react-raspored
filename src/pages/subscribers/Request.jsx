import React, { useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import AlertContext from '../../context/alert/alertContext';
import SubscribersContext from '../../context/subscribers/subscribersContext';

export const Request = (props) => {
	const alertContext = useContext(AlertContext);
	const { setAlert } = alertContext;

	const subscribersContext = useContext(SubscribersContext);
	const { status, clearStatus } = subscribersContext;

	const { handleSubmit, register, errors } = useForm();

	useEffect(() => {
		if (status && status !== '') {
			setAlert('Pretplata', status);

			if (status === 'E-mail poslan pretplatniku!') props.history.push('/');
			clearStatus();
		}
	}, [status]);

	const onSubmit = (values) => {
		subscribersContext.request(values.email);
	};

	return (
		<Form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
			<h1>Administriranje pretplate</h1>
			<Form.Group controlId='email'>
				<Form.Label>
					E-mail adresa{' '}
					{errors.email && <small>({errors.email.message})</small>}
				</Form.Label>
				<Form.Control
					type='email'
					name='email'
					ref={register({
						required: 'Obavezno',
						pattern: {
							value: /^\S+@\S+\.\S+$/,
							message: 'Nije upisan ispravan format e-mail adrese',
						},
					})}
				/>

				<Button className='mt-4' type='submit'>
					Pošalji zahtjev
				</Button>
			</Form.Group>
		</Form>
	);
};

export default Request;
