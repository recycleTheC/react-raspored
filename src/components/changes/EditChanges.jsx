import React, { useContext, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import ScheduleContext from '../../context/schedule/scheduleContext';
import { useForm } from 'react-hook-form';

function EditChanges({ show, close, date }) {
	const context = useContext(ScheduleContext);
	const {
		schedule,
		createChange,
		deleteChange,
		updateChange,
		changes,
		classes,
	} = context;

	const { handleSubmit, register, errors, setValue, watch, reset } = useForm({
		defaultValues: { changeId: '0', classId: '1', changed: '0' },
	});

	if (classes.length === 0) {
		context.getClasses();
	}

	const onSubmit = (values) => {
		const { changeId, classId, changed, substitution, location } = values;

		if (changeId === '0') {
			createChange(date, classId, changed, substitution, location);
		} else {
			updateChange(changeId, classId, changed, substitution, location);
		}
		close({ target: { name: 'changes' } });
	};

	const { changeId, classId, changed } = watch();

	useEffect(() => {
		if (changeId !== '0') {
			const selected = changes.find((change) => change._id === changeId);
			if (selected) {
				setValue('classId', selected.classId);
				setValue('changed', selected.changed);
				setValue('substitution', selected.substitution._id);
				setValue('location', selected.location);
			}
		} else {
			reset();
		}
		// eslint-disable-next-line
	}, [changeId]);

	const onDelete = (values) => {
		deleteChange(values.changeId);
		close({ target: { name: 'changes' } });
	};

	const hide = () => {
		close({ target: { name: 'changes' } });
	};

	const toChange = changed === '0' ? false : true;

	return (
		<Modal show={show} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>
					Izmjene rasporeda za {format(date, 'dd.MM.yyyy.')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Control
							as='select'
							name='changeId'
							ref={register({ required: 'Obavezno' })}
						>
							<option key={0} value={0}>
								Nova izmjena rasporeda
							</option>
							{changes.map((x) => {
								return (
									<option key={x._id} value={x._id}>
										Izmjena za {x.classId}. sat
									</option>
								);
							})}
						</Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Label>
							Sat
							{errors.classId && <small>({errors.classId.message})</small>}
						</Form.Label>
						<Form.Control
							as='select'
							name='classId'
							ref={register({ required: 'Obavezno' })}
						>
							{schedule.map((x) => {
								return (
									<option key={x.id} value={x.id}>
										{x.id}. sat
									</option>
								);
							})}
						</Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Label>
							Predmet (redovno)
							{errors.changed && <small>({errors.changed.message})</small>}
						</Form.Label>
						<Form.Control
							as='select'
							name='changed'
							ref={register({ required: 'Obavezno' })}
						>
							{/**
							 * @todo Bug & Feature: Creating changes with time & location only
							 */}

							{schedule
								.filter((item) => item.id.toString() === classId)
								.map((x) => {
									return x.classes.map((y) => {
										if (y.regular) {
											return (
												<option value={y.regular} key={y.regular}>
													{
														classes.find(
															(item) => item._id.toString() === y.regular
														).name
													}{' '}
													(postoji izmjena)
												</option>
											);
										} else {
											return (
												<option value={y._id} key={y._id}>
													{classes.find((item) => item._id === y._id).name}
												</option>
											);
										}
									});
								})}
						</Form.Control>

						{/* <Form.Control
							as='input'
							ref={register({ required: 'Obavezno' })}
							name='changed'
						></Form.Control> */}
					</Form.Group>

					{toChange && (
						<Form.Group>
							<Form.Label>
								Predmet (zamjena)
								{errors.substitution && (
									<small>({errors.substitution.message})</small>
								)}
							</Form.Label>
							<Form.Control
								as='select'
								name='substitution'
								ref={register({ required: 'Obavezno' })}
							>
								{classes
									.filter((x) => x._id !== changed)
									.map((item) => (
										<option value={item._id} key={item._id}>
											{item.name}
										</option>
									))}
							</Form.Control>
						</Form.Group>
					)}

					<Form.Group>
						<Form.Label>
							Lokacija
							{errors.location && <small>({errors.location.message})</small>}
						</Form.Label>
						<Form.Control
							as='input'
							ref={register({ required: 'Obavezno' })}
							name='location'
						></Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				{changeId !== '0' && (
					<Button variant='danger' onClick={handleSubmit(onDelete)}>
						Obriši izmjenu
					</Button>
				)}

				<Button variant='success' onClick={handleSubmit(onSubmit)}>
					Spremi izmjene
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default EditChanges;
