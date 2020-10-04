import React, { useContext, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import ScheduleContext from '../../context/schedule/scheduleContext';

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
		defaultValues: {
			changeId: '0',
			changeClass: true,
		},
	});

	if (classes.length === 0) {
		context.getClasses();
	}

	const onSubmit = (values) => {
		if (changeId === '0') {
			createChange(date, values);
		} else {
			updateChange(values);
		}
		close({ target: { name: 'changes' } });
	};

	const { changeId, classId, changeClass, changed } = watch();

	useEffect(() => {
		if (changeId !== '0') {
			const selected = changes.find((change) => change._id === changeId);
			if (selected) {
				setValue('classId', selected.classId);
				if (selected.changed) {
					setValue('changeClass', true);
					setValue('changed', selected.changed);
					setValue('substitution', selected.substitution._id);
				} else {
					setValue('changeClass', false);
				}
				if (selected.location) setValue('location', selected.location);
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
							disabled={changeId !== '0'}
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
						<Form.Check
							type='checkbox'
							name='changeClass'
							label='Mijena li se redovni sat?'
							ref={register}
						/>
					</Form.Group>

					<div style={{ display: !changeClass && 'none' }}>
						<Form.Group>
							<Form.Label>
								Predmet (redovno)
								{errors.changed && <small>({errors.changed.message})</small>}
							</Form.Label>
							<Form.Control
								as='select'
								name='changed'
								ref={register({ required: 'Obavezno' })}
								disabled={!changeClass}
							>
								{schedule
									.filter((item) => item.id.toString() === classId)
									.map((x) => {
										return x.classes.map((y) => {
											if (y.regular) {
												return (
													<option value={y.regular.id} key={y.regular.id}>
														{
															classes.find(
																(item) => item._id.toString() === y.regular.id
															).name
														}
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
						</Form.Group>

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
								disabled={!changeClass}
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
					</div>

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

EditChanges.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func,
	date: PropTypes.object,
};

export default EditChanges;
