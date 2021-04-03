import React from 'react';
import { format } from 'date-fns';
import locale from 'date-fns/locale/hr';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

const DatePick = ({ date, setDate, weekends = false }) => {
	const filterDays = (date) => {
		if (date.getDay() === 0 || date.getDay() === 6) {
			return false;
		} else {
			return true;
		}
	};
	return (
		<DatePicker
			selected={date}
			onChange={(date) => setDate(date)}
			customInput={<p>{format(date, 'eeee, dd.MM.yyyy.', { locale })} </p>}
			locale={locale}
			filterDate={weekends ? null : filterDays}
			popperPlacement='auto'
		/>
	);
};

DatePick.propTypes = {
	date: PropTypes.objectOf(Date),
	setDate: PropTypes.func,
	weekends: PropTypes.bool,
};

export default DatePick;
