import React, { useContext } from 'react';
import { Badge, ListGroup, Row, Col } from 'react-bootstrap';
import ScheduleContext from '../../context/schedule/scheduleContext';
import { format } from 'date-fns';
import locale from 'date-fns/locale/hr';
import { Link } from 'react-router-dom';
import './style.css';

export default function Notifications() {
	const scheduleContext = useContext(ScheduleContext);
	const { getAllNotifications, notifications } = scheduleContext;

	if (notifications.length < 1) {
		getAllNotifications();
	}

	return (
		<div className='mb-4'>
			<h1>Obavijesti</h1>
			{notifications.map((item) => {
				return (
					<ListGroup
						key={item._id}
						className='mt-4 no-links'
						as={Link}
						to={'/notifications/' + item._id}
					>
						<ListGroup.Item action className='mt-2'>
							<Row>
								<Col>
									<div className='d-flex justify-content-between align-items-center'>
										<div>
											<h3>{item.title}</h3>
										</div>
										<div>
											<Badge variant='primary' pill>
												Od{' '}
												{format(new Date(item.fromDate), 'dd.MM.yyyy.', {
													locale,
												})}
											</Badge>{' '}
											<Badge variant='success' pill>
												Do{' '}
												{format(new Date(item.toDate), 'dd.MM.yyyy.', {
													locale,
												})}
											</Badge>
										</div>
									</div>
									<p className='mb-0'>
										{item.content &&
											item.content.split(' ').splice(0, 24).join(' ') + '...'}
									</p>
								</Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
				);
			})}
		</div>
	);
}
