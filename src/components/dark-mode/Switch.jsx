import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

export const Switch = () => {
	const [cheched, setCheched] = useState(false);

	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', (e) => e.matches && setCheched(true));

	useEffect(() => {
		if (
			window.matchMedia('(prefers-color-scheme: dark)').matches ||
			localStorage.theme === 'dark'
		) {
			document.body.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');
			setCheched(true);
		}
	}, []);

	useEffect(() => {
		const theme = cheched ? 'dark' : 'light';
		document.body.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [cheched]);

	return (
		<Form style={{ marginLeft: '0.25em' }}>
			<Form.Check
				type='switch'
				id='theme-switch'
				onChange={() => {
					setCheched(!cheched);
				}}
				checked={cheched}
			/>
		</Form>
	);
};
