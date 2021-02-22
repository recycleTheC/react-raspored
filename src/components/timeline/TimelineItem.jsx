import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { format, getWeek, parseISO } from 'date-fns';
import locale from 'date-fns/locale/hr';

export const TimelineItem = ({ date, classId, text, type, title }) => {
	const day = parseISO(date);
	const week = getWeek(day) % 2 === 0 ? 'parni-tjedan' : 'neparni-tjedan';

	return (
		<div className='timeline-item'>
			<div className={`timeline-item-content ${type}`}>
				<div className='timeline-item-date'>
					<small className={week}>
						{format(day, 'eeee, dd. MMMM yyyy.', {
							locale,
						})}{' '}
						({classId}. sat)
					</small>
				</div>
				<div className='timeline-item-text'>
					{title && <ReactMarkdown source={title} />}
					<ReactMarkdown source={text} />
				</div>
				<span className='circle'></span>
			</div>
		</div>
	);
};

TimelineItem.propTypes = {
	date: PropTypes.string,
	classId: PropTypes.number,
	text: PropTypes.string,
	type: PropTypes.string,
	title: PropTypes.string,
};

export default TimelineItem;
