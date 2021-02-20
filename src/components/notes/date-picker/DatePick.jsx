import React from 'react';
import { format, isSameDay } from 'date-fns';
import locale from 'date-fns/locale/hr';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

const DatePick = ({ date, setDate, filtered }) => {
	const filterDays = (date) => {
		if (filtered.filter((day) => isSameDay(new Date(day), date)).length > 0) {
			return true;
		} else return false;
	};

	return (
		<DatePicker
			selected={date}
			onChange={(date) => setDate(date)}
			customInput={<p>{format(date, 'eeee, dd.MM.yyyy.', { locale })} </p>}
			locale={locale}
			filterDate={filterDays}
			popperPlacement='auto'
		/>
	);
};

DatePick.propTypes = {
	date: PropTypes.objectOf(Date),
	setDate: PropTypes.func,
	filtered: PropTypes.array,
};

export default DatePick;
