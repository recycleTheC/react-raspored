import React, { useState, useContext, useEffect } from 'react';
import DatePick from '../date-picker/DatePick';
import { useForm, Controller } from 'react-hook-form';
import { Button, Form, Col, Alert } from 'react-bootstrap';
import ScheduleContext from '../../context/schedule/scheduleContext';
import Select from 'react-select';
import { format } from 'date-fns';

const CreateSchedule = () => {
	const context = useContext(ScheduleContext);
	const { classes, getClasses, createSchedule, status } = context;

	const [dateFrom, setDateFrom] = useState(new Date());
	const [dateTo, setDateTo] = useState(new Date());
	const [day, setDay] = useState('ponedjeljak');
	const [parity, setParity] = useState('parni');

	const { handleSubmit, register, control } = useForm({
		class1: [],
		class2: [],
	});

	const onSubmit = (values) => {
		let schedule = {
			week: parity,
			day: day,
			validFrom: format(dateFrom, 'yyyy-MM-dd'),
			validUntil: format(dateTo, 'yyyy-MM-dd'),
			classes: [],
		};

		if (values.id1) {
			let item = values.class1.map((x) => x.value);
			let row = {
				id: parseInt(values.id1),
				class: item,
				timeStart: values.timeStart1,
				timeEnd: values.timeEnd1,
				location: values.location1,
			};

			schedule.classes.push(row);
		}

		if (values.id2) {
			let item = values.class2.map((x) => x.value);
			let row = {
				id: parseInt(values.id2),
				class: item,
				timeStart: values.timeStart2,
				timeEnd: values.timeEnd2,
				location: values.location2,
			};

			schedule.classes.push(row);
		}

		if (values.id3) {
			let item = values.class3.map((x) => x.value);
			let row = {
				id: parseInt(values.id3),
				class: item,
				timeStart: values.timeStart3,
				timeEnd: values.timeEnd3,
				location: values.location3,
			};

			schedule.classes.push(row);
		}

		if (values.id4) {
			let item = values.class4.map((x) => x.value);
			let row = {
				id: parseInt(values.id4),
				class: item,
				timeStart: values.timeStart4,
				timeEnd: values.timeEnd4,
				location: values.location4,
			};

			schedule.classes.push(row);
		}

		if (values.id5) {
			let item = values.class5.map((x) => x.value);
			let row = {
				id: parseInt(values.id5),
				class: item,
				timeStart: values.timeStart5,
				timeEnd: values.timeEnd5,
				location: values.location5,
			};

			schedule.classes.push(row);
		}

		if (values.id6) {
			let item = values.class6.map((x) => x.value);
			let row = {
				id: parseInt(values.id6),
				class: item,
				timeStart: values.timeStart6,
				timeEnd: values.timeEnd6,
				location: values.location6,
			};

			schedule.classes.push(row);
		}

		if (values.id7) {
			let item = values.class7.map((x) => x.value);
			let row = {
				id: parseInt(values.id7),
				class: item,
				timeStart: values.timeStart7,
				timeEnd: values.timeEnd7,
				location: values.location7,
			};

			schedule.classes.push(row);
		}

		if (values.id8) {
			let item = values.class8.map((x) => x.value);
			let row = {
				id: parseInt(values.id8),
				class: item,
				timeStart: values.timeStart8,
				timeEnd: values.timeStart8,
				location: values.location8,
			};

			schedule.classes.push(row);
		}

		if (values.id9) {
			let item = values.class9.map((x) => x.value);
			let row = {
				id: parseInt(values.id9),
				class: item,
				timeStart: values.timeStart9,
				timeEnd: values.timeStart9,
				location: values.location9,
			};

			schedule.classes.push(row);
		}

		createSchedule(schedule);
	};

	useEffect(() => {
		getClasses();
	}, []);

	return (
		<div>
			<h1>Kreiranje rasporeda</h1>
			<div>
				Raspored traje od:{' '}
				<DatePick date={dateFrom} setDate={setDateFrom} weekends />
			</div>
			<div>
				Raspored traje do:{' '}
				<DatePick date={dateTo} setDate={setDateTo} weekends />
			</div>
			<div>
				Dan u tjednu:{' '}
				<select
					name='day'
					id='day'
					value={day}
					onChange={(e) => {
						setDay(e.target.value);
					}}
				>
					<option value='ponedjeljak'>ponedjeljak</option>
					<option value='utorak'>utorak</option>
					<option value='srijeda'>srijeda</option>
					<option value='četvrtak'>četvrtak</option>
					<option value='petak'>petak</option>
					<option value='subota'>subota</option>
					<option value='nedjelja'>nedjelja</option>
				</select>
			</div>
			<div>
				Parni/neparni tjedan:{' '}
				<select
					name='parity'
					id='parity'
					value={parity}
					onChange={(e) => {
						setParity(e.target.value);
					}}
				>
					<option value='parni'>parni</option>
					<option value='neparni'>neparni</option>
				</select>
			</div>
			<div>
				<h2>Predmeti</h2>
				<Form action={null}>
					<ol>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${1}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${1}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${1}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${1}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${1}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>

						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${2}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${2}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${2}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${2}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${2}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${3}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${3}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${3}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${3}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${3}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${4}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${4}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${4}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${4}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${4}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${5}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${5}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${5}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${5}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${5}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${6}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${6}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${6}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${6}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${6}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${7}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${7}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${7}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${7}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${7}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${8}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${8}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${8}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${8}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${8}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
						<li>
							<Form.Group>
								<Form.Label>Redni broj sata:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`id${9}`}
								></Form.Control>
								<Form.Label>Lokacija:</Form.Label>
								<Form.Control
									as='input'
									ref={register}
									name={`location${9}`}
								></Form.Control>
								<Form.Row>
									<Col>
										<Form.Control
											placeholder='Početak sata'
											as='input'
											ref={register}
											name={`timeStart${9}`}
										/>
									</Col>
									<Col>
										<Form.Control
											placeholder='Kraj sata'
											as='input'
											ref={register}
											name={`timeEnd${9}`}
										/>
									</Col>
								</Form.Row>
							</Form.Group>
							<Form.Group>
								<Form.Label>Predmet</Form.Label>
								<Controller
									as={Select}
									name={`class${9}`}
									options={classes.map((item) => {
										return { value: item._id, label: item.name };
									})}
									isMulti
									control={control}
								/>
							</Form.Group>
						</li>
					</ol>
					{status.schedule && <Alert variant='info'>{status.schedule}</Alert>}
					<Button variant='success' onClick={handleSubmit(onSubmit)}>
						Spremi
					</Button>
				</Form>
			</div>
		</div>
	);
};

export default CreateSchedule;
