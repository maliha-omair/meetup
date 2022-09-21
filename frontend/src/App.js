
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import SignupFormPage from "./component/SignupFormPage"
import LoginFormPage from './component/LoginFormPage';
import Home from './component/Home'
import Logout from "./component/Logout";
import Navigation from "./component/Navigation";
import * as sessionActions from "./store/session";
import Profile from "./component/Profile";
import { useSelector } from 'react-redux';
import Footer from "./component/Footer";
import "./index.css"
import { GroupsForm } from "./component/Groups";
import GetAllGroups from "./component/GetAllGroups";
import Group from "./component/Group";
import UserGroups from "./component/UserGroups";
import UpdateGroup from "./component/UpdateGroup";
import AboutMeetup from "./component/AboutMeetup";
import GroupPhotos from "./component/GroupPhotos";
import GroupEvents from "./component/GroupEvents";
import Event from "./component/Event"
import CreateEvent from "./component/CreateEvent";
import CreateVenue from "./component/CreateVenue";
import UpdateEvent from "./component/UpdateEvent";
import UserEvents from "./component/UserEvents";
import GetAllEvents from "./component/GetAllEvents";
import LoginFormModal from "./component/LoginFormModal";
import LoginForm from "./component/LoginFormModal/LoginForm";


function App() {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);

    }).catch((res) => {
      setIsLoaded(true);

    });
  }, []);

  return (isLoaded && (

    <div className="page-container">
      <div className="content-wrap">
        <Navigation isLoaded={isLoaded} className="navigationStyle" />
        {isLoaded && (
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
            <LoginFormModal />
              
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/createGroup">
              <GroupsForm />
            </Route>
            <Route path="/event/new">
              {sessionUser ? <CreateEvent sessionUser={sessionUser}></CreateEvent> : <Redirect to="/" />}
            </Route>
            <Route path="/:groupId/venue">
              <CreateVenue sessionUser={sessionUser} />
            </Route>
            <Route path="/allGroups">
              <GetAllGroups />
            </Route>
            <Route path="/allEvents">
              <GetAllEvents />
            </Route>
            <Route path="/events/:eventId/update">
              <UpdateEvent sessionUser={sessionUser} />
            </Route>
            <Route path="/groups/:groupId/update">
              <UpdateGroup />
            </Route>
            <Route path="/groups/:groupId/events">
              <GroupEvents />
            </Route>
            <Route path="/groups/:groupId/photos">
              <GroupPhotos />
            </Route>
            <Route path="/groups/:groupId">
              <Group sessionUser={sessionUser} />
            </Route>
            <Route path="/events/:eventId">
              <Event sessionUser={sessionUser} />
            </Route>
            <Route path="/userGroup">
              <UserGroups sessionUser={sessionUser} />
            </Route>
            <Route path="/userEvent">
              <UserEvents sessionUser={sessionUser} />
            </Route>
            <Route path="/aboutMeetup">
              <AboutMeetup />
            </Route>
          </Switch>
        )}

        <div className="footer">
          <Footer sessionUser={sessionUser} />
        </div>

      </div>
    </div>

  ));
}

export default App;
