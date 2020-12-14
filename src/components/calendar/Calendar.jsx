import React, { useState, useEffect, useContext } from 'react';
import { format, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { v4 } from 'uuid';
import locale from 'date-fns/locale/hr';

import buildCalendar from './build';
import dayStyles from './styles';
import Header from './Header';

import ScheduleContext from '../../context/schedule/scheduleContext';

import './style.css';

export const Calendar = () => {
	const [calendar, setCalendar] = useState([]);
	const [value, setValue] = useState(new Date());

	const context = useContext(ScheduleContext);
	const { exams, getAllExams } = context;

	useEffect(() => {
		setCalendar(buildCalendar(value));
	}, [value]);

	useEffect(() => {
		getAllExams();
	}, []);

	const result = exams.filter((exam) => isSameDay(parseISO(exam.date), value));

	function className(day) {
		const exam = exams.filter((exam) => isSameDay(parseISO(exam.date), day));
		if (exam) {
			return exam.map((item) => item.classKey.name).join(' / ');
		}
	}

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
						].map((d) => (
							<div className='days' key={v4()}>
								{d}
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
			<div className='content mt-2'>
				<h3>{format(value, 'eeee, dd.MM.yyyy.', { locale })}</h3>
				{result.length > 0 ? (
					result.map((item) => (
						<>
							<h4 key={item._id}>{item.classKey.name}</h4>
							<p>{item.content}</p>
						</>
					))
				) : (
					<p>Nema upisanih ispita!</p>
				)}
			</div>
		</div>
	);
};

export default Calendar;
