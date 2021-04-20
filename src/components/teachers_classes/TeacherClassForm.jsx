import React, { useContext, useEffect } from 'react';
import ScheduleContext from '../../context/schedule/scheduleContext';
import { Button, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

export const TeacherClassForm = () => {
	const context = useContext(ScheduleContext);
	const {
		loading,
		status,
		createTeacher,
		createClass,
		classes,
		teachers,
		getTeachers,
		getClasses,
	} = context;

	const { handleSubmit, register, errors } = useForm();
	const {
		handleSubmit: handleSubmit2,
		register: register2,
		errors: errors2,
		control,
	} = useForm();
	const onSubmitTeacher = (values) => createTeacher(values.name);
	const onSubmitClass = (values) => {
		createClass(
			values.name,
			values.teacher.map((x) => x.value)
		);
	};

	useEffect(() => {
		getTeachers();
		getClasses();
	}, []);

	return (
		<div>
			<h1>Predmeti i predavači</h1>

			<Table striped bordered hover size='sm' responsive>
				<thead>
					<tr>
						<th>Predmet</th>
						<th>Predavači</th>
					</tr>
				</thead>
				<tbody>
					{!loading &&
						classes.map((item) => {
							return (
								<tr key={item._id}>
									<td>{item.name}</td>
									<td>
										{item.teacher
											.map((t) => t.name)
											.reduce((prev, curr) => [prev, ' / ', curr])}
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>

			<hr />
			{status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
			<h2>Dodaj predavača</h2>
			<Form className='mt-4' onSubmit={handleSubmit(onSubmitTeacher)}>
				<Form.Group controlId='name'>
					<Form.Label>
						Ime i prezime predavača{' '}
						{errors.name && <small>({errors.name.message})</small>}
					</Form.Label>
					<Form.Control
						type='text'
						name='name'
						ref={register({ required: 'Obavezno' })}
					/>
					<Button className='mt-4' type='submit'>
						{loading ? (
							<>
								<Spinner
									as='span'
									animation='border'
									role='status'
									aria-hidden='true'
									size='sm'
								/>{' '}
								<span>Spremanje predavača...</span>
							</>
						) : (
							'Spremi predavača'
						)}
					</Button>
				</Form.Group>
			</Form>

			<hr />
			<h2>Dodaj predmet</h2>
			<Form className='mt-4' onSubmit={handleSubmit2(onSubmitClass)}>
				<Form.Group controlId='name'>
					<Form.Label>
						Naziv predmeta{' '}
						{errors.name && <small>({errors2.name.message})</small>}
					</Form.Label>
					<Form.Control
						type='text'
						name='name'
						ref={register2({ required: 'Obavezno' })}
						className='mb-3'
					/>

					<Controller
						as={Select}
						name='teacher'
						options={
							!loading &&
							teachers.map((teacher) => {
								return { value: teacher._id, label: teacher.name };
							})
						}
						isMulti
						control={control}
					/>
					<Button className='mt-4' type='submit'>
						{loading ? (
							<>
								<Spinner
									as='span'
									animation='border'
									role='status'
									aria-hidden='true'
									size='sm'
								/>{' '}
								<span>Spremanje predmeta...</span>
							</>
						) : (
							'Spremi predmet'
						)}
					</Button>
				</Form.Group>
			</Form>
		</div>
	);
};

export default TeacherClassForm;
