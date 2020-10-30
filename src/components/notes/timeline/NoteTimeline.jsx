import React, { useContext, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ScheduleContext from '../../../context/schedule/scheduleContext';
import TimelineItem from './TimelineItem';
import Spinner from 'react-bootstrap/Spinner';
import './style.css';

export const NoteTimeline = () => {
	const context = useContext(ScheduleContext);
	const {
		getAllNotes,
		classes,
		getClasses,
		classNotes,
		loading,
		selectedClass,
		setSelectedClass,
	} = context;

	const { register, errors, watch } = useForm({
		defaultValues: { classId: selectedClass },
	});

	if (classes.length < 1) {
		getClasses();
	}

	const { classId } = watch();

	useEffect(() => {
		if (classId) {
			setSelectedClass(classId);
			getAllNotes(classId);
		}
		// eslint-disable-next-line
	}, [classId]);

	const spinner = (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '1em',
			}}
		>
			<Spinner animation='grow' variant='success' />
		</div>
	);

	return (
		<div>
			<Form inline className='mb-0'>
				<Form.Group>
					<Form.Label className='mr-1'>
						Predmet {errors.class && <small>({errors.class.message})</small>}
					</Form.Label>
					<Form.Control
						as='select'
						name='classId'
						ref={register({ required: 'Obavezno' })}
						className='my-1 mr-sm-2'
					>
						{classes.map((item) => {
							return (
								<option key={item._id} value={item._id.toString()}>
									{item.name}
								</option>
							);
						})}
					</Form.Control>
				</Form.Group>
			</Form>

			<div style={{ textAlign: 'center' }} className='my-1'>
				<small>
					<span className='neparni-tjedan'>ujutro</span> /{' '}
					<span className='parni-tjedan'>popodne</span>
				</small>
			</div>

			{loading ? (
				spinner
			) : classNotes.length > 0 ? (
				<div className='timeline-container'>
					{classNotes.map((item) => {
						return (
							<TimelineItem
								key={item._id}
								date={item.date}
								text={item.note}
								classId={item.classId}
							/>
						);
					})}
				</div>
			) : (
				<div style={{ textAlign: 'center' }}>
					<small>Bilješke ne postoje za ovaj predmet!</small>
				</div>
			)}
		</div>
	);
};

export default NoteTimeline;
