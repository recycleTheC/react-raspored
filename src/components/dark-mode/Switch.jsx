import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

export const Switch = () => {
	const [cheched, setCheched] = useState(false);

	useEffect(() => {
		if (localStorage.theme) {
			if (localStorage.theme === 'dark') {
				document.body.setAttribute('data-theme', 'dark');
				setCheched(true);
			}
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.body.setAttribute('data-theme', 'dark');
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
