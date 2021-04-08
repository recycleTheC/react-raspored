import React, { useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import SubscribersContext from '../../context/subscribers/subscribersContext';
import AlertContext from '../../context/alert/alertContext';

export const Subscriber = (props) => {
	// eslint-disable-next-line
	const key = props.match.params.key;

	const alertContext = useContext(AlertContext);
	const { setAlert } = alertContext;

	const subscribersContext = useContext(SubscribersContext);
	const {
		status,
		clearStatus,
		getSubscriber,
		name,
		email,
		subscription,
	} = subscribersContext;

	const { handleSubmit, register, errors, setValue } = useForm();

	useEffect(() => {
		getSubscriber(key);
	}, []);

	useEffect(() => {
		setValue('name', name);
		setValue('email', email);
		setValue('subscription', subscription);
	}, [name, email, subscription]);

	useEffect(() => {
		if (status && status !== '') {
			setAlert('Pretplata', status);

			if (
				[
					'Pretplatnik uspješno prijavljen!',
					'Pretplatnik nije pronađen',
					'Pogrešan pristupni ključ!',
					'Pretplata uspješno spremljena!',
					'Pretplatnik odjavljen',
				].includes(status)
			) {
				props.history.push('/');
			}
			clearStatus();
		}
	}, [status]);

	const onSubmit = (values) => {
		subscribersContext.update(
			key,
			values.name,
			values.email,
			values.subscription
		);
	};

	const onDelete = () => {
		subscribersContext.unregister(key);
	};

	return (
		<Form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
			<h1>Pretplata</h1>
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

				<Form.Group controlId='name'>
					<Form.Label>
						Ime i prezime{' '}
						{errors.name && <small>({errors.name.message})</small>}
					</Form.Label>
					<Form.Control
						type='text'
						name='name'
						ref={register({ required: 'Obavezno' })}
					/>
				</Form.Group>

				{/* exams, weekly, changes */}
				<Form.Group controlId='subscription'>
					<Form.Check
						type='checkbox'
						name='subscription'
						value='exams'
						label='Ispiti'
						ref={register()}
					/>
					<Form.Check
						type='checkbox'
						name='subscription'
						value='changes'
						label='Dnevne izmjene'
						ref={register()}
					/>
					<Form.Check
						type='checkbox'
						name='subscription'
						value='weekly'
						label='Tjedni podsjetnik'
						ref={register()}
					/>
				</Form.Group>

				<Button onClick={handleSubmit(onSubmit)}>Spremi</Button>
				<Button onClick={handleSubmit(onDelete)} variant='danger'>
					Obriši
				</Button>
			</Form.Group>
		</Form>
	);
};

export default Subscriber;
