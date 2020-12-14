import { isSameDay, isToday, isSameMonth, isWeekend } from 'date-fns';

function isSelected(day, value) {
	return isSameDay(day, value);
}

function today(day) {
	return isToday(day, new Date());
}

function outsideMonth(day, value) {
	return !isSameMonth(day, value);
}

function weekend(day) {
	return isWeekend(day);
}

export default function dayStyles(day, value) {
	const styles = [];
	if (isSelected(day, value)) styles.push('selected');
	if (today(day)) styles.push('today');
	if (outsideMonth(day, value)) styles.push('outside');
	if (weekend(day) && !outsideMonth(day, value)) styles.push('weekend');

	return styles.join(' ');
}
