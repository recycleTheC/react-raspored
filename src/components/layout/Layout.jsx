import React, { useContext, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Row, Col } from 'react-bootstrap';
import { Book } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from './digitalocean.svg';
import { BoxArrowRight } from 'react-bootstrap-icons';

import AuthContext from '../../context/auth/authContext';
import PropTypes from 'prop-types';

export default function Layout({ children }) {
	const authContext = useContext(AuthContext);
	const { loadUser, isAuthenticated, logout, user, token } = authContext;

	useEffect(() => {
		if (!isAuthenticated && token) {
			loadUser();
		}
		// eslint-disable-next-line
	}, []);

	const hello = user ? 'Pozdrav, ' + user.name : '';

	const authLinks = (
		<Navbar.Collapse className='justify-content-end'>
			<Nav>
				<NavDropdown as={Navbar.text} title={hello} id='basic-nav-dropdown'>
					<NavDropdown.Item onClick={logout}>
						<BoxArrowRight /> Odjava
					</NavDropdown.Item>
				</NavDropdown>
			</Nav>
		</Navbar.Collapse>
	);

	const guestLinks = (
		<Navbar.Collapse className='justify-content-end'>
			<Navbar.Text as={Link} to='/login'>
				Prijava
			</Navbar.Text>
		</Navbar.Collapse>
	);

	const scheduleItems = (
		<NavDropdown title='Raspored' id='basic-nav-dropdown'>
			<NavDropdown.Item as={Link} to='/teacher/add'>
				Dodaj predavača
			</NavDropdown.Item>
			<NavDropdown.Item as={Link} to='/class/add'>
				Dodaj predmet
			</NavDropdown.Item>
		</NavDropdown>
	);

	return (
		<div>
			<div style={{ minHeight: '96.5vh' }}>
				<Navbar bg='light' expand='lg' className='mb-3'>
					<Container>
						<Navbar.Brand as={Link} to='/'>
							<Book color='royalblue' size={22} />{' '}
							<strong>Školski planer</strong>
						</Navbar.Brand>
						<Navbar.Toggle aria-controls='basic-navbar-nav' />
						<Navbar.Collapse id='basic-navbar-nav'>
							<Nav className='mr-auto'>
								<Nav.Link as={Link} to='/notes'>
									Bilješke
								</Nav.Link>
								{isAuthenticated && scheduleItems}
							</Nav>
						</Navbar.Collapse>
						{isAuthenticated ? authLinks : guestLinks}
					</Container>
				</Navbar>

				<Container>{children}</Container>
			</div>

			<div className='bg-light text-center'>
				<Container>
					<Row className='py-1'>
						<Col md={(4, { order: 'first' })} xs='12'>
							<small>&copy; Mario Kopjar 2020.</small>
						</Col>
						<Col md={4} xs={(12, { order: 'last' })}>
							<small style={{ display: 'inline-block' }}>
								Deployed on{' '}
								<a href='https://m.do.co/c/ab2f3327e682'>
									<Logo
										alt='DigitalOcean'
										style={{ height: '20px', display: 'inline-block' }}
									/>
								</a>
							</small>
						</Col>
						<Col md={(4, { order: 'last' })} xs='12'>
							<small>Tehnička škola Ruđera Boškovića, Zagreb</small>
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.node,
};
