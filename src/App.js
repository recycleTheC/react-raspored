import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import Layout from './components/layout/Layout';

import ScheduleState from './context/schedule/scheduleState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';

import Home from './pages/Home';
import AddTeacher from './components/teachers/AddTeacher';
import AddClass from './components/classes/AddClass';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import NoteTimeline from './components/notes/timeline/NoteTimeline';

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
									path='/teacher/add'
									component={AddTeacher}
								/>
								<PrivateRoute exact path='/class/add' component={AddClass} />
								<Route exact path='/login' component={Login} />
								<Route exact path='/notes' component={NoteTimeline} />
							</Switch>
						</Layout>
					</AlertState>
				</ScheduleState>
			</AuthState>
		</BrowserRouter>
	);
}

export default App;
