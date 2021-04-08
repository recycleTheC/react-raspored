import React, { useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import AlertContext from '../../context/alert/alertContext';
import SubscribersContext from '../../context/subscribers/subscribersContext';

export const Register = (props) => {
	const alertContext = useContext(AlertContext);
	const { setAlert } = alertContext;

	const subscribersContext = useContext(SubscribersContext);
	const { status, clearStatus } = subscribersContext;

	const { handleSubmit, register, errors } = useForm();

	useEffect(() => {
		if (status && status !== '') {
			setAlert('Pretplata', status);
			clearStatus();

			if (status === 'Pretplatnik uspješno prijavljen!')
				props.history.push('/');
		}
	}, [status]);

	const onSubmit = (values) => {
		subscribersContext.register(values.name, values.email, values.subscription);
	};

	return (
		<Form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
			<h1>Registracija pretplate</h1>
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
						ref={register({ required: 'Obavezno' })}
					/>
					<Form.Check
						type='checkbox'
						name='subscription'
						value='changes'
						label='Dnevne izmjene'
						ref={register({ required: 'Obavezno' })}
					/>
					<Form.Check
						type='checkbox'
						name='subscription'
						value='weekly'
						label='Tjedni podsjetnik'
						ref={register({ required: 'Obavezno' })}
					/>
				</Form.Group>

				<Button className='mt-4' type='submit'>
					Registracija
				</Button>
			</Form.Group>
		</Form>
	);
};

export default Register;
