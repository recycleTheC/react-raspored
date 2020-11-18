import React from 'react';
import { isBefore, getDayOfYear } from 'date-fns';
import { Container, Row, Image } from 'react-bootstrap';
import { Christmas, NewYear } from './Images';
import PropTypes from 'prop-types';

export const Holidays = ({ date }) => {
	const ch = getDayOfYear(date) % 2;
	if (isBefore(date, new Date('2020-12-31'))) {
		return (
			<Container>
				<Row className='gallery'>
					<Image src={Christmas[ch]} fluid style={style} />
				</Row>
			</Container>
		);
	} else {
		return (
			<Container>
				<Row className='gallery'>
					<Image src={NewYear[ch]} fluid style={style} />
				</Row>
			</Container>
		);
	}
};

const style = {
	maxHeight: '60vh',
	alignSelf: 'center',
	margin: 'auto',
	marginTop: '2em',
};

Holidays.propTypes = {
	date: PropTypes.objectOf(Date),
};

export default Holidays;
