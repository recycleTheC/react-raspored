import React, { useContext, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ScheduleContext from '../../context/schedule/scheduleContext';
import { useForm } from 'react-hook-form';

function EditNote({ show, close, date }) {
	const context = useContext(ScheduleContext);
	const { schedule, setNotes, deleteNote, notes, updateNotes } = context;

	const { handleSubmit, register, errors, setValue, watch } = useForm({
		defaultValues: { noteId: '0' },
	});

	const onSubmit = (values) => {
		const classKey = values.class.split(':')[0];
		const classId = values.class.split(':')[1];
		const note = values.note;
		const id = values.noteId;

		if (id === '0') {
			setNotes(date, classKey, classId, note);
		} else {
			updateNotes(id, classKey, classId, note);
		}
		close({ target: { name: 'notes' } });
	};

	const { noteId } = watch();

	useEffect(() => {
		if (noteId !== '0') {
			const selected = notes.find((note) => note._id === noteId);

			setValue('note', selected.note);
			setValue('class', selected.classKey + ':' + selected.classId);
		} else {
			setValue('note', '');
		}
		// eslint-disable-next-line
	}, [noteId]);

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
							name='class'
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
					<Form.Group controlId='textArea'>
						<Form.Label>
							Bilješka{errors.note && <small>({errors.note.message})</small>}
						</Form.Label>
						<Form.Control
							as='textarea'
							rows='4'
							name='note'
							ref={register({ required: 'Obavezno' })}
						/>
					</Form.Group>
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
	show: PropTypes.func,
	close: PropTypes.func,
	date: PropTypes.node,
};

export default EditNote;
