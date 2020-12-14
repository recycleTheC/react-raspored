import React from 'react';
import { format, addMonths } from 'date-fns';
import locale from 'date-fns/locale/hr';
import PropTypes from 'prop-types';

export const Header = ({ value, setValue }) => {
	function currentMonth() {
		return format(value, 'LLLL', { locale });
	}

	function currentYear() {
		return format(value, 'yyyy.');
	}

	function previousMonth() {
		return addMonths(value, -1);
	}

	function nextMonth() {
		return addMonths(value, 1);
	}

	return (
		<div className='header'>
			<div className='previous'>
				<span onClick={() => setValue(previousMonth())}>
					{String.fromCharCode(171)}
				</span>
			</div>
			<div className='current'>
				{currentMonth()} {currentYear()}
			</div>
			<div className='next'>
				<span onClick={() => setValue(nextMonth())}>
					{String.fromCharCode(187)}
				</span>
			</div>
		</div>
	);
};

Header.propTypes = {
	value: PropTypes.objectOf(Date),
	setValue: PropTypes.func,
};

export default Header;
