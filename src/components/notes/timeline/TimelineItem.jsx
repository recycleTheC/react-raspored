import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { format, getWeek } from 'date-fns';
import locale from 'date-fns/locale/hr';

export const TimelineItem = ({ date, classId, text }) => {
	const currentDate = Date.parse(date);
	const week = getWeek(date) % 2 === 0 ? 'parni-tjedan' : 'neparni-tjedan';

	return (
		<div className='timeline-item'>
			<div className='timeline-item-content'>
				<div className='timeline-item-date'>
					<small className={week}>
						{format(currentDate, 'eeee, dd. MMMM yyyy.', {
							locale,
						})}{' '}
						({classId}. sat)
					</small>
				</div>
				<div className='timeline-item-text'>
					<ReactMarkdown source={text} />
				</div>
				<span className='circle'></span>
			</div>
		</div>
	);
};

TimelineItem.propTypes = {
	date: PropTypes.object,
	classId: PropTypes.number,
	text: PropTypes.string,
};

export default TimelineItem;
