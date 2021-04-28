import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import ContextRoute from './components/routing/ContextRoute';
import Layout from './components/layout/Layout';

import ScheduleState from './context/schedule/scheduleState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import SubscribersState from './context/subscribers/SubscribersState';

import Home from './pages/Home';
import TeacherClassForm from './components/teachers_classes/TeacherClassForm';
import CreateSchedule from './components/schedule/CreateSchedule';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import Timeline from './components/timeline/Timeline';
import NotFound from './pages/NotFound';
import Notifications from './pages/notifications/Notifications';
import Notification from './pages/notifications/Notification';
import EditNotification from './pages/notifications/EditNotification';
import Calendar from './components/calendar/Calendar';
import { Register as RegisterSubscriber } from './pages/subscribers/Register';
import { Request as RequestSubscriber } from './pages/subscribers/Request';
import { Subscriber } from './pages/subscribers/Subscriber';

import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
	setAuthToken(localStorage.token); // dohvaćanje tokena iz lokalnog spremnika web preglednika
}

function App() {
	return (
		<BrowserRouter>
			<AuthState /* state autentifikacije*/>
				<ScheduleState /* state rasporeda */>
					<AlertState /* state komponente za prikaz obavijesti */>
						<Layout /* kostur web stranice (zaglavlje, glavni container, podnožje) */
						>
							<Alerts /* komponente obavijesti */ />
							<Switch /* renderiranje komponente koja odgovara ruti*/>
								<Route
									exact
									path='/'
									component={Home}
									/* prikaz rasporeda */
								/>
								<PrivateRoute
									exact
									path='/schedule/basic'
									component={TeacherClassForm}
									/* administriranje predavača i predmeta*/
								/>
								<PrivateRoute
									exact
									path='/schedule/create'
									component={CreateSchedule}
									/* administriranje rasporeda*/
								/>
								<Route
									exact
									path='/login'
									component={Login} /* komponenta prijave korisnika */
								/>
								<Route
									exact
									path='/notes'
									component={Timeline} /* komponenta vremenske crte predmeta */
								/>
								<Route
									exact
									path='/notifications'
									component={Notifications} /* komponenta svih obavijesti*/
								/>
								<Route
									exact
									path='/notifications/:id'
									component={
										Notification
									} /* komponenta pojedinačne obavijesti*/
								/>
								<PrivateRoute
									exact
									path='/notifications/edit/:id'
									component={
										EditNotification
									} /* komponenta za uređivanje pojedinačne obavijesti*/
								/>
								<Route
									exact
									path='/calendar'
									component={
										Calendar
									} /* komponenta kalendara ispita i obaveza */
								/>

								<ContextRoute
									exact
									path='/subscribers/register'
									component={RegisterSubscriber}
									/* komponenta za registraciju pretplatnika */
									context={SubscribersState}
								/>
								<ContextRoute
									exact
									path='/subscribers/'
									component={RequestSubscriber}
									/* komponenta za zhtjev novog pristupnog ključa pretplatnika */
									context={SubscribersState}
								/>
								<ContextRoute
									exact
									path='/subscribers/me/:key'
									component={Subscriber}
									/* komponenta za administriranje pretplate */
									context={SubscribersState}
								/>

								<Route component={NotFound} /* komponenta poruke 404 */ />
								{/* MUST be at the END of the Switch*/}
							</Switch>
						</Layout>
					</AlertState>
				</ScheduleState>
			</AuthState>
		</BrowserRouter>
	);
}

export default App;
