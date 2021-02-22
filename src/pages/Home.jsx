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
	const [date, setDate] = useState(context.date);

	useEffect(() => {
		setGlobalDate(date);
	}, [date]);

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
							setDate(addDays(date, -1));
						}}
					>
						<ArrowLeftCircle />
					</Button>
				</Column>
				<Column>
					<DatePick date={date} setDate={setDate} />
				</Column>
				<Column>
					<Button
						type='submit'
						variant='outline-primary'
						onClick={() => {
							setDate(addDays(date, 1));
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
						<small>{schedule.msg}</small>
					</Column>
				)}
			</>
			{loading ? spinner : !schedule.msg && <DailySchedule date={date} />}
			{schedule.options && schedule.options == 'xmas' && (
				<Holidays date={date} />
			)}
		</div>
	);
}
