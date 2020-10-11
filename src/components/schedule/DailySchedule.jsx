import React, { useContext, useState } from 'react';
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
import { v4 as uuid } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { ExclamationTriangle } from 'react-bootstrap-icons';

import EditNote from '../notes/EditNote';
import EditExam from '../exams/EditExam';
import EditChanges from '../changes/EditChanges';

function DailySchedule({ date }) {
	const scheduleContext = useContext(ScheduleContext);
	const { schedule, exams, changes, loading } = scheduleContext;
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
										{item.substitution && item.substitution.name}{' '}
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

	return (
		<ListGroup variant='flush' className='mt-2'>
			{!loading && authContext.isAuthenticated && schedule.length > 0 && edit}
			{!loading && changes.length > 0 && changesAlert}
			{!loading && exams.length > 0 && examList}

			{schedule.map((row) => {
				const {
					location,
					locationChanged,
					id,
					timeStart,
					timeEnd,
					classes,
				} = row;

				return (
					<ListGroup.Item key={row.scheduleId}>
						<Row>
							<Col>
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
									)}
									{classes.map((x) => x.changed).includes(true) && (
										<Badge pill variant='danger'>
											izmjena
										</Badge>
									)}
								</div>
								{classes
									.map((item) => {
										return (
											<Row key={item._id}>
												<Col md='6' key={item._id} className='mb-2'>
													<div>
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
													</div>
												</Col>
												<Col md={6} sm={12} className='px-0'>
													{item.notes.length > 0 && (
														<Col md='auto' sm={12}>
															<Badge pill variant='light'>
																Bilješke
															</Badge>
															<ul className='pl-4'>
																{item.notes.map((note) => (
																	<li key={uuid()}>
																		<small>
																			<ReactMarkdown
																				source={note}
																				renderers={{
																					paragraph: (props) => {
																						return (
																							<p className='mb-1' style={{}}>
																								{props.children}
																							</p>
																						);
																					},
																				}}
																			/>
																		</small>
																	</li>
																))}
															</ul>
														</Col>
													)}
												</Col>
											</Row>
										);
									})
									.reduce((prev, curr) => [prev, <hr key={uuid()} />, curr])}
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
