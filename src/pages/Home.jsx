import React, { useContext, useState, useEffect } from 'react';
import ScheduleContext from '../context/schedule/scheduleContext';
import { addDays, isToday } from 'date-fns';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Column from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ArrowRightCircle, ArrowLeftCircle } from 'react-bootstrap-icons';

import DailySchedule from '../components/schedule/DailySchedule';
import DatePick from '../components/date-picker/DatePick';
import Holidays from '../components/decorations/Holidays';

export default function Home() {
	const context = useContext(ScheduleContext);
	const { loading, schedule, setGlobalDate } = context;
	const [date, setDate] = useState(context.date); // lokalni datum

	useEffect(() => {
		setGlobalDate(date); // postavljanje lokalnog datuma u state
	}, [date]); // izvrši naredbe kada se promjeni lokalni datum

	const spinner = (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spinner animation='grow' variant='success' />
		</div>
	);

	return (
		<div>
			<Row className='text-center'>
				<Column>
					<Button
						variant='outline-primary'
						onClick={() => {
							setDate(addDays(date, -1)); // pomicanje datuma za 1 dan unatrag
						}}
					>
						<ArrowLeftCircle />
					</Button>
				</Column>
				<Column>
					<DatePick
						date={date}
						setDate={setDate}
						/* komponenta za prikaz kalendara za odabir datuma */
					/>
				</Column>
				<Column>
					<Button
						type='submit'
						variant='outline-primary'
						onClick={() => {
							setDate(addDays(date, 1)); // pomicanje datuma za 1 dan unaprijed
						}}
					>
						<ArrowRightCircle />
					</Button>
				</Column>
			</Row>
			<>
				{!isToday(date) && (
					<Button
						onClick={() => {
							setDate(new Date());
						}}
						variant='outline-warning'
						size='sm'
						className='py-0 mb-2'
						style={{
							fontSize: '0.8em',
							display: 'block',
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
					>
						vrati na današnji dan
					</Button>
				)}
				{schedule.msg && (
					<Column md='12' sm='12' style={{ textAlign: 'center' }}>
						<small>{schedule.msg}</small> {/* prikaz poruke sa poslužitelja */}
					</Column>
				)}
			</>
			{loading ? (
				spinner
			) : (
				<DailySchedule date={date} /* prikaz komponente rasporeda */ />
			)}
			{schedule.options && schedule.options == 'xmas' && (
				<Holidays date={date} />
			)}
		</div>
	);
}
