import React, { useContext, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ScheduleContext from '../../context/schedule/scheduleContext';
import TimelineItem from './TimelineItem';
import Spinner from 'react-bootstrap/Spinner';
import './style.css';
import { differenceInDays, parseISO } from 'date-fns';

export const Timeline = () => {
	const context = useContext(ScheduleContext);
	const {
		getAllNotes,
		getExamsById,
		getClasses,
		classes,
		classNotes,
		classExams,
		loading,
		selectedClass,
		setSelectedClass,
	} = context;

	const { register, errors, watch } = useForm({
		defaultValues: { classId: selectedClass },
	});

	const today = new Date();

	if (classes.length < 1) {
		getClasses();
	}

	const { classId } = watch();

	useEffect(() => {
		if (classId) {
			setSelectedClass(classId);
			getAllNotes(classId);
			getExamsById(classId);
		}
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

	const compare = (a, b) => {
		if (a.date < b.date) {
			return -1;
		}
		if (a.date > b.date) {
			return 1;
		}
		if (a.date === b.date) {
			if (a.classId < b.classId) {
				return -1;
			}
			if (a.classId > b.classId) {
				return 1;
			}
		}
		return 0;
	};

	var items = [];

	classNotes.forEach((note) => {
		items.push({
			key: note._id,
			date: note.date,
			text: note.note,
			title: note.title,
			classId: note.classId,
			type: 'note',
		});
	});

	classExams.forEach((exam) => {
		items.push({
			key: exam._id,
			date: exam.date,
			text: '**Ispit**: ' + exam.content,
			classId: exam.classId,
			type:
				differenceInDays(today, parseISO(exam.date)) < 0 ? 'exam' : 'exam-done',
		});
	});

	items.sort(compare);

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
			) : items.length > 0 ? (
				<div className='timeline-container'>
					{items.map((item) => {
						return (
							<TimelineItem
								key={item._id}
								date={item.date}
								text={item.text}
								title={item.title}
								classId={item.classId}
								type={item.type}
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

export default Timeline;
