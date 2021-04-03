import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { format, isSameDay } from 'date-fns';
import PropTypes from 'prop-types';
import ScheduleContext from '../../context/schedule/scheduleContext';
import { useForm } from 'react-hook-form';
import DatePick from './date-picker/DatePick';

function EditNote({ show, close, date }) {
	const context = useContext(ScheduleContext);
	const {
		schedule,
		setNotes,
		deleteNote,
		notes,
		updateNotes,
		getAvailableDates,
		availableDates,
	} = context;

	const { handleSubmit, register, errors, setValue, watch } = useForm({
		defaultValues: { noteId: '0' },
	});

	const [reminder, setReminder] = useState(new Date());

	const onSubmit = (values) => {
		const id = values.noteId;

		const send = {
			date: format(date, 'yyyy-MM-dd'),
			classKey: values.selectedClass.split(':')[0],
			classId: values.selectedClass.split(':')[1],
			note: values.note,
		};

		if (toRemind) {
			send.title = values.title;
			send.reminder = format(reminder, 'yyyy-MM-dd');
		}

		if (values.hidden) send.hidden = values.hidden;

		if (id === '0') {
			setNotes(send);
		} else {
			send.id = id;
			updateNotes(send);
		}
		close({ target: { name: 'notes' } });
	};

	const { noteId, toRemind, selectedClass } = watch();

	useEffect(() => {
		if (noteId !== '0' && noteId !== undefined) {
			const selected = notes.find((note) => note._id === noteId);

			setValue('note', selected.note);
			setValue('selectedClass', selected.classKey + ':' + selected.classId);
			setValue('hidden', selected.hidden);

			if (selected.reminder) {
				setValue('toRemind', true);
				setValue('title', selected.title);
				setReminder(new Date(selected.reminder));
			} else {
				setValue('title', '');
				setValue('toRemind', false);
				setValue('hidden', false);
			}
		} else {
			setValue('note', '');
			setValue('title', '');
			setValue('toRemind', false);
			setValue('hidden', false);
		}
	}, [noteId]);

	useEffect(() => {
		if (toRemind) {
			getAvailableDates(
				selectedClass.split(':')[0],
				format(date, 'yyyy-MM-dd')
			);
		}
	}, [toRemind, selectedClass]);

	useEffect(() => {
		if (availableDates.length > 0 && noteId === '0') {
			setReminder(new Date(availableDates[0]));
		}
	}, [availableDates]);

	const onDelete = (values) => {
		deleteNote(values.noteId);
		close({ target: { name: 'notes' } });
	};

	const hide = () => {
		close({ target: { name: 'notes' } });
	};

	return (
		<Modal show={show} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>Bilješke za {format(date, 'dd.MM.yyyy.')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Control
							as='select'
							name='noteId'
							ref={register({ required: 'Obavezno' })}
						>
							<option key={0} value={0}>
								Nova bilješka
							</option>
							{notes.map((x) => {
								if (isSameDay(date, new Date(x.date)))
									return (
										<option key={x._id} value={x._id}>
											Bilješka za {x.classId}. sat
										</option>
									);
							})}
						</Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Label>
							Predmet {errors.class && <small>({errors.class.message})</small>}
						</Form.Label>
						<Form.Control
							as='select'
							name='selectedClass'
							ref={register({ required: 'Obavezno' })}
						>
							{schedule.map((x) => {
								return x.classes.map((y) => {
									return (
										<option key={y._id + ':' + x.id} value={y._id + ':' + x.id}>
											{x.id}. sat - {y.name}
										</option>
									);
								});
							})}
						</Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Check
							type='checkbox'
							name='toRemind'
							label='Obaveza za slijedeći sat?'
							ref={register()}
							style={{ margin: '1em 0 1em 0' }}
						/>
					</Form.Group>

					<div style={{ display: !toRemind && 'none' }}>
						<Form.Group controlId='textArea'>
							<Form.Label>
								Naslov {errors.note && <small>({errors.note.message})</small>}
							</Form.Label>
							<Form.Control name='title' ref={register()} />
						</Form.Group>
					</div>

					<Form.Group controlId='textArea'>
						<Form.Label>
							Bilješka {errors.note && <small>({errors.note.message})</small>}
						</Form.Label>
						<Form.Control
							as='textarea'
							rows='4'
							name='note'
							ref={register({ required: 'Obavezno' })}
						/>
					</Form.Group>

					<div style={{ display: !toRemind && 'none' }}>
						<Form.Group>
							<Form.Check
								type='checkbox'
								name='hidden'
								label='Sakrij prikaz za današnji dan?'
								ref={register()}
								style={{ margin: '1em 0 1em 0' }}
							/>
						</Form.Group>

						{toRemind && (
							<DatePick
								date={reminder}
								setDate={setReminder}
								filtered={availableDates}
							/>
						)}
					</div>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				{noteId !== '0' && (
					<Button variant='danger' onClick={handleSubmit(onDelete)}>
						Obriši bilješku
					</Button>
				)}

				<Button variant='success' onClick={handleSubmit(onSubmit)}>
					Spremi bilješku
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

EditNote.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func,
	date: PropTypes.objectOf(Date),
};

export default EditNote;
