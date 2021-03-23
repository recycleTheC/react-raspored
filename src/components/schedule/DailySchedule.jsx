import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ScheduleContext from '../../context/schedule/scheduleContext';
import AuthContext from '../../context/auth/authContext';
import {
	ListGroup,
	Badge,
	Col,
	Row,
	ButtonToolbar,
	ButtonGroup,
	Button,
	ListGroupItem,
	Popover,
	OverlayTrigger,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { format, differenceInMinutes } from 'date-fns';
import locale from 'date-fns/locale/hr';

import EditNote from '../notes/EditNote';
import EditExam from '../exams/EditExam';
import EditChanges from '../changes/EditChanges';

import './style.css';

function DailySchedule({ date }) {
	const scheduleContext = useContext(ScheduleContext);
	const {
		schedule,
		exams,
		changes,
		loading,
		dailyNotifications,
	} = scheduleContext;
	const authContext = useContext(AuthContext);

	const [showModal, setModal] = useState({
		notes: false,
		exams: false,
		changes: false,
	});

	const toggleModal = (e) => {
		setModal({
			[e.target.name]: !showModal[e.target.name],
		});
	};

	const edit = (
		<ListGroupItem key='toolbar' style={{ border: 0 }}>
			<ButtonToolbar>
				<ButtonGroup style={{ margin: 'auto' }}>
					<Button
						variant='outline-success'
						size='sm'
						name='notes'
						onClick={toggleModal}
					>
						Bilješke
					</Button>
					<Button
						variant='outline-danger'
						size='sm'
						name='exams'
						onClick={toggleModal}
					>
						Ispiti
					</Button>
					<Button
						variant='outline-info'
						size='sm'
						onClick={toggleModal}
						name='changes'
					>
						Izmjene
					</Button>
				</ButtonGroup>
			</ButtonToolbar>
		</ListGroupItem>
	);

	const examList = (
		<ListGroup.Item key='exams' className='text-center' style={{ border: 0 }}>
			<Badge pill variant='dark' style={{ whiteSpace: 'break-spaces' }}>
				<span
					style={{
						fontSize: '1rem',
					}}
				>
					<ExclamationTriangle
						color='yellow'
						size='1rem'
						className='blink'
						style={{
							marginBottom: '0.125em',
						}}
					/>{' '}
					Pisane provjere:{' '}
					{exams.length > 0 &&
						exams
							.map((exam, index) => {
								return (
									<OverlayTrigger
										placement='bottom'
										delay={{ show: 250, hide: 400 }}
										key={exam._id}
										overlay={
											<Popover id={`popover-basic-${index}`}>
												<Popover.Content>
													<div>{exam.content}</div>
												</Popover.Content>
											</Popover>
										}
									>
										<Badge variant='danger'>{exam.classKey.name}</Badge>
									</OverlayTrigger>
								);
							})
							.reduce((prev, curr) => [prev, ' ', curr])}
				</span>
			</Badge>
		</ListGroup.Item>
	);

	const changesAlert = (
		<ListGroup.Item key='changes' className='text-center' style={{ border: 0 }}>
			<OverlayTrigger
				placement='bottom'
				delay={{ show: 250, hide: 400 }}
				overlay={
					<Popover id='popover-basic'>
						<Popover.Content>
							{changes.map((item) => {
								return (
									<div key={item._id}>
										{item.classId}. sat -{' '}
										{item.substitution &&
											(item.substitution.name !== '/' ? (
												item.substitution.name
											) : (
												<span className='changed'>{`${item.changed.name}`}</span>
											))}{' '}
										{item.location &&
											item.location !== '-' &&
											`(${item.location})`}
									</div>
								);
							})}
						</Popover.Content>
					</Popover>
				}
			>
				<Badge pill variant='danger'>
					<span
						style={{
							fontSize: '1rem',
						}}
					>
						<ExclamationTriangle
							color='yellow'
							size='1rem'
							style={{ marginBottom: '0.125em' }}
						/>{' '}
						Izmjene u rasporedu
					</span>
				</Badge>
			</OverlayTrigger>
		</ListGroup.Item>
	);

	const notificationAlert = (
		<ListGroup.Item
			key='notifications'
			className='text-center'
			style={{ border: 0 }}
		>
			<Badge pill variant='primary' style={{ whiteSpace: 'break-spaces' }}>
				<div
					style={{
						fontSize: '1rem',
					}}
				>
					<ExclamationTriangle
						color='yellow'
						size='1rem'
						style={{ marginBottom: '0.125em' }}
					/>{' '}
					{dailyNotifications.length > 0 &&
						dailyNotifications
							.map((item) => {
								return (
									<Link
										to={`/notifications/${item._id}`}
										key={item._id}
										style={{ color: 'inherit', textDecoration: 'inherit' }}
									>
										<span>{item.title}</span>
									</Link>
								);
							})
							.reduce((prev, curr) => [prev, ' / ', curr])}
				</div>
			</Badge>
		</ListGroup.Item>
	);

	const [currentTime, setTime] = useState(new Date());
	const isToday = new Date().toDateString() == date.toDateString();
	const [currentTimeString, setCurrentStr] = useState('');

	useEffect(() => {
		if (isToday) {
			const interval = setInterval(() => {
				setTime(new Date());
			}, 5000);

			return () => {
				clearInterval(interval);
			};
		}
	}, []);

	useEffect(() => {
		const hour =
			currentTime.getHours() < 10
				? '0' + currentTime.getHours()
				: currentTime.getHours();
		const minute =
			currentTime.getMinutes() < 10
				? '0' + currentTime.getMinutes()
				: currentTime.getMinutes();

		setCurrentStr(hour + ':' + minute);
	}, [currentTime]);

	const getUntil = (startTime) => {
		const [startH, startMin] = startTime.split(':');
		const start = new Date().setHours(startH, startMin);
		const diff = differenceInMinutes(currentTime, start);

		if (diff <= -15 || diff >= 0) return false;
		return `${Math.abs(diff)} ${
			Math.abs(diff) === 1 ? 'minutu' : Math.abs(diff) < 5 ? 'minute' : 'minuta'
		}`;
	};

	return (
		<ListGroup variant='flush' className='mt-2 mb-3'>
			{!loading && authContext.isAuthenticated && schedule.length > 0 && edit}
			{dailyNotifications.length > 0 && notificationAlert}
			{changes.length > 0 && changesAlert}
			{exams.length > 0 && examList}

			{schedule.map((row) => {
				const {
					location,
					locationChanged,
					id,
					timeStart,
					timeEnd,
					classes,
				} = row;

				const isCurrent =
					currentTimeString >= timeStart && currentTimeString < timeEnd;

				const timeUntil = isCurrent ? false : getUntil(timeStart);

				return (
					<ListGroup.Item key={row.scheduleId}>
						<Row>
							<Col className='main'>
								<div className='mb-2'>
									<Badge pill variant='primary'>
										{id}. sat
									</Badge>{' '}
									{id < 1 && (
										<Badge pill variant='warning'>
											predsat
										</Badge>
									)}{' '}
									<Badge pill variant='success'>
										{timeStart} - {timeEnd}
									</Badge>{' '}
									{location !== '-' && (
										<Badge pill variant='light'>
											lokacija: {location}{' '}
											{locationChanged && (
												<ExclamationTriangle
													color='red'
													size='0.8rem'
													style={{ marginBottom: '0.125em' }}
												/>
											)}
										</Badge>
									)}{' '}
									{classes.map((x) => x.changed).includes(true) && (
										<Badge pill variant='danger'>
											izmjena
										</Badge>
									)}{' '}
									{isToday && isCurrent && (
										<Badge variant='danger' className='pulser'>
											LIVE
										</Badge>
									)}{' '}
									{isToday && timeUntil && (
										<Badge pill variant='warning'>
											za {timeUntil}
										</Badge>
									)}
								</div>
								<Row>
									{classes.map((item, index) => {
										const factor = 12 / row.classes.length;
										const border = index > 0 ? 'between' : '';
										const size = item.notes.length === 0 ? 12 : 6;

										return (
											<Col
												key={item._id}
												className={`px-0 col-${factor} col-sm`}
											>
												<Row className={`mx-0 ${border}`}>
													<Col
														md={size}
														lg={size}
														xl={size}
														key={item._id}
														className='mb-2'
													>
														<h4>
															{item.name}{' '}
															{item.changed && (
																<ExclamationTriangle
																	color='red'
																	size='0.8rem'
																	style={{ marginBottom: '0.125em' }}
																/>
															)}
														</h4>
														<small>
															{item.teacher &&
																item.teacher
																	.map((t) => t.name)
																	.reduce((prev, curr) => [prev, ' / ', curr])}
														</small>{' '}
														{item.type && (
															<Badge pill variant='info'>
																{item.type} smjer
															</Badge>
														)}
														{item.exams.length > 0 && (
															<div className='mt-2'>
																<Badge pill variant='danger'>
																	Pisana provjera
																</Badge>{' '}
																<small>
																	{item.exams
																		.map((exam) => (
																			<strong key={uuid()}>{exam}</strong>
																		))
																		.reduce((prev, curr) => [
																			prev,
																			' / ',
																			curr,
																		])}
																</small>
															</div>
														)}
													</Col>

													{item.notes.length > 0 && (
														<Col md={size} lg={size} xl={size}>
															<Badge pill variant='light'>
																Bilješke
															</Badge>
															<ul className='pl-4'>
																{item.notes.map((note) => (
																	<li key={uuid()}>
																		{!note.reminder ? (
																			!note.highlight ? (
																				<small>
																					<ReactMarkdown
																						source={note.text}
																						renderers={{
																							paragraph: (props) => {
																								return (
																									<p
																										className='mb-1'
																										style={{}}
																									>
																										{props.children}
																									</p>
																								);
																							},
																						}}
																					/>
																				</small>
																			) : (
																				<>
																					<Badge pill variant='light'>
																						{note.title
																							? note.title
																							: 'Zadatak'}{' '}
																					</Badge>
																					<small>
																						<ReactMarkdown
																							source={note.text}
																							renderers={{
																								paragraph: (props) => {
																									return (
																										<p
																											className='mb-1'
																											style={{}}
																										>
																											{props.children}
																										</p>
																									);
																								},
																							}}
																						/>
																					</small>
																				</>
																			)
																		) : (
																			<OverlayTrigger
																				placement='bottom'
																				delay={{ show: 250, hide: 500 }}
																				overlay={
																					<Popover>
																						<Popover.Content>
																							<ReactMarkdown
																								source={note.text}
																								renderers={{
																									paragraph: (props) => {
																										return (
																											<p
																												className='mb-1'
																												style={{}}
																											>
																												{props.children}
																											</p>
																										);
																									},
																								}}
																							/>
																						</Popover.Content>
																					</Popover>
																				}
																			>
																				<Badge pill variant='secondary'>
																					{note.title ? note.title : 'Zadatak'}{' '}
																					(
																					{format(
																						new Date(note.reminder),
																						'dd.MM.yyyy',
																						{
																							locale,
																						}
																					)}
																					)
																				</Badge>
																			</OverlayTrigger>
																		)}
																	</li>
																))}
															</ul>
														</Col>
													)}
												</Row>
											</Col>
										);
									})}
								</Row>
							</Col>
						</Row>
					</ListGroup.Item>
				);
			})}
			{!loading && (
				<>
					<EditNote
						show={showModal.notes}
						name='notes'
						close={toggleModal}
						date={date}
					/>
					<EditExam
						show={showModal.exams}
						name='exams'
						close={toggleModal}
						date={date}
					/>
					<EditChanges
						show={showModal.changes}
						name='changes'
						close={toggleModal}
						date={date}
					/>
				</>
			)}
		</ListGroup>
	);
}

DailySchedule.propTypes = {
	date: PropTypes.instanceOf(Date),
};

export default DailySchedule;
