import React, { useState, useEffect, useContext } from 'react';
import { format, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { v4 } from 'uuid';
import locale from 'date-fns/locale/hr';
import ReactMarkdown from 'react-markdown';

import buildCalendar from './build';
import dayStyles from './styles';
import Header from './Header';

import ScheduleContext from '../../context/schedule/scheduleContext';

import './style.css';
import { Form } from 'react-bootstrap';

export const Calendar = () => {
	const [calendar, setCalendar] = useState([]);
	const [value, setValue] = useState(new Date());
	const [result, setResult] = useState([]);
	const [current, setCurrent] = useState([]);
	const [checkExams, setCheckExams] = useState(true);
	const [checkReminders, setCheckReminders] = useState(false);

	const context = useContext(ScheduleContext);
	const getAllExams = context.getAllExams;
	const exams = context.allExams;
	const reminders = context.allReminders;
	const getReminders = context.getReminders;

	useEffect(() => {
		setCalendar(buildCalendar(value));
		setCurrent(
			result.filter((item) => {
				if (!item.reminder) return isSameDay(parseISO(item.date), value);
				else return isSameDay(parseISO(item.reminder), value);
			})
		);
	}, [value]);

	useEffect(() => {
		setCurrent(
			result.filter((item) => {
				if (!item.reminder) return isSameDay(parseISO(item.date), value);
				else return isSameDay(parseISO(item.reminder), value);
			})
		);
	}, [value, result]);

	useEffect(() => {
		getAllExams();
		getReminders();
	}, []);

	useEffect(() => {
		if (checkExams && checkReminders) setResult([...exams, ...reminders]);
		if (checkExams && !checkReminders) setResult([...exams]);
		if (!checkExams && checkReminders) setResult([...reminders]);
		if (!checkExams && !checkReminders) setResult([]);
	}, [exams, checkExams, reminders, checkReminders]);

	function className(day) {
		const names = result.filter((item) => {
			if (!item.reminder) return isSameDay(parseISO(item.date), day);
			else return isSameDay(parseISO(item.reminder), day);
		});
		if (names) {
			return names.map((item) => item.classKey.name).join(' / ');
		}
	}

	const toggleReminders = () => {
		if (checkReminders) setCheckReminders(false);
		else setCheckReminders(true);
	};

	const toggleExams = () => {
		if (checkExams) setCheckExams(false);
		else setCheckExams(true);
	};

	return (
		<div>
			<div className='calendar'>
				<Header value={value} setValue={setValue} />
				<div className='body'>
					<div className='wrapper'>
						{[
							'ponedjeljak',
							'utorak',
							'srijeda',
							'četvrtak',
							'petak',
							'subota',
							'nedjelja',
						].map((day) => (
							<div className='days' key={v4()}>
								{day}
							</div>
						))}
						{calendar.map((day) => (
							<div
								className={`day ${dayStyles(day, value)}`}
								key={v4()}
								onClick={isSameMonth(day, value) ? () => setValue(day) : null}
							>
								<strong>{format(day, 'dd')}</strong>
								<br />
								<span>{className(day)}</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className='content mt-3'>
				<Form.Group controlId='items'>
					<Form.Check
						type='checkbox'
						name='items'
						label='Ispiti'
						onChange={toggleExams}
						checked={checkExams}
						inline
					/>
					<Form.Check
						type='checkbox'
						name='items'
						label='Obaveze'
						onChange={toggleReminders}
						checked={checkReminders}
						inline
					/>
				</Form.Group>
			</div>
			<div className='content mt-2'>
				<h3>{format(value, 'eeee, dd.MM.yyyy.', { locale })}</h3>
				{current.length > 0 ? (
					current.map((item) => (
						<div key={item._id} className='mt-3'>
							<h4>
								{item.classKey.name}{' '}
								{item.content && '(' + item.classId + '.sat)'}
								{item.title && '(' + item.title + ')'}
							</h4>
							<ReactMarkdown source={item.content || item.note} />
						</div>
					))
				) : (
					<p>Nema upisanih ispita i/ili bilješki!</p>
				)}
			</div>
		</div>
	);
};

export default Calendar;
