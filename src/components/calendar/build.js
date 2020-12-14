import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	isBefore,
	addDays,
} from 'date-fns';

export default function buildCalendar(value) {
	const startDay = startOfWeek(startOfMonth(value), { weekStartsOn: 1 });
	const endDay = endOfWeek(endOfMonth(value), { weekStartsOn: 1 });
	const calendar = [];
	let day = startDay;

	while (isBefore(day, endDay)) {
		calendar.push(day);
		day = addDays(day, 1);
	}

	return calendar;
}
