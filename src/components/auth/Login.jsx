import React, { useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Login = (props) => {
	const alertContext = useContext(AlertContext);
	const { setAlert } = alertContext;

	const authContext = useContext(AuthContext);
	const { login, isAuthenticated, error, clearErrors } = authContext;

	const { handleSubmit, register, errors } = useForm();

	const onSubmit = (values) => {
		login({ email: values.email, password: values.password });
	};

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}
		if (error) {
			setAlert('Pogreška', error);
			clearErrors();
		}
		// eslint-disable-next-line
	}, [isAuthenticated, props.history, error]);

	return (
		<Form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
			<h1>Prijava u aplikaciju</h1>
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

				<Form.Group controlId='password'>
					<Form.Label>
						Lozinka{' '}
						{errors.password && <small>({errors.password.message})</small>}
					</Form.Label>
					<Form.Control
						type='password'
						name='password'
						ref={register({ required: 'Obavezno' })}
					/>
				</Form.Group>

				<Button className='mt-4' type='submit'>
					Prijava
				</Button>
			</Form.Group>
		</Form>
	);
};

export default Login;
