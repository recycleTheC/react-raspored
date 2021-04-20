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
	setAuthToken(localStorage.token);
}

function App() {
	return (
		<BrowserRouter>
			<AuthState>
				<ScheduleState>
					<AlertState>
						<Layout>
							<Alerts />
							<Switch>
								<Route exact path='/' component={Home} />
								<PrivateRoute
									exact
									path='/schedule/basic'
									component={TeacherClassForm}
								/>
								<Route exact path='/login' component={Login} />
								<Route exact path='/notes' component={Timeline} />
								<Route exact path='/notifications' component={Notifications} />
								<Route
									exact
									path='/notifications/:id'
									component={Notification}
								/>
								<PrivateRoute
									exact
									path='/notifications/edit/:id'
									component={EditNotification}
								/>
								<Route exact path='/calendar' component={Calendar} />

								<ContextRoute
									exact
									path='/subscribers/register'
									component={RegisterSubscriber}
									context={SubscribersState}
								/>
								<ContextRoute
									exact
									path='/subscribers/'
									component={RequestSubscriber}
									context={SubscribersState}
								/>
								<ContextRoute
									exact
									path='/subscribers/me/:key'
									component={Subscriber}
									context={SubscribersState}
								/>

								<Route component={NotFound} />
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
