import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { format, getWeek } from 'date-fns';
import locale from 'date-fns/locale/hr';

export const TimelineItem = ({ data }) => {
	const date = Date.parse(data.date);
	const week = getWeek(date) % 2 === 0 ? 'parni-tjedan' : 'neparni-tjedan';

	return (
		<div className='timeline-item'>
			<div className='timeline-item-content'>
				<div className='timeline-item-date'>
					<small className={week}>
						{format(date, 'eeee, dd. MMMM yyyy.', {
							locale,
						})}{' '}
						({data.classId}. sat)
					</small>
				</div>
				<div className='timeline-item-text'>
					<ReactMarkdown source={data.note} />
				</div>
				<span className='circle'></span>
			</div>
		</div>
	);
};

TimelineItem.props = {
	data: PropTypes.object,
};

export default TimelineItem;
