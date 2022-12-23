
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
import SignUpFormModal from "./component/SignupFormModal";
import ViewVenue from "./component/ViewVenue";

import EditVenue from "./component/EditVenue";
import FetchGroups from "./component/FetchGroups";
import { QueryClientProvider,  QueryClient } from "react-query";

export const queryClient = new QueryClient();

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
          <QueryClientProvider client={queryClient}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <LoginFormModal showModal={false} />
            </Route>
            <Route path="/signup">
              <SignUpFormModal showModal={false} />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/fetchGroups">
              <FetchGroups />
            </Route>
            <Route path="/createGroup">
              <GroupsForm />
            </Route>
            <Route path="/groups/:groupId/event/new">
              {sessionUser ? <CreateEvent sessionUser={sessionUser}></CreateEvent> : <Redirect to="/" />}
            </Route>
            <Route path="/groups/:groupId/venue/new">
              <CreateVenue sessionUser={sessionUser} />
            </Route>

            <Route path="/groups/:groupId/venues/:venueId/edit">
              <EditVenue sessionUser={sessionUser}  />
            </Route>
            <Route path="/allGroups">
              <GetAllGroups />
            </Route>
            <Route path="/allEvents">
              <GetAllEvents />
            </Route>
            <Route path="/venue/:groupId">
              <ViewVenue />
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
          </QueryClientProvider>
        )}

        

      </div>
      <div className="footer">
          <Footer sessionUser={sessionUser} />
        </div>
    </div>

  ));
}

export default App;
