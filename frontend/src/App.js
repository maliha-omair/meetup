
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
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

import AboutGroup from "./component/AboutGroup";
import UpdateGroup from "./component/UpdateGroup";


function App() {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {   
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    
    }).catch((res)=>{
      setIsLoaded(true);
    
    });
  }, []);
  
  return (isLoaded && (
    
      <div className="page-container">
        <div className = "content-wrap">
          <Navigation isLoaded={isLoaded}/>          
          {isLoaded && (
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <LoginFormPage />
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
            <Route path="/allGroups">
              <GetAllGroups/>
            </Route>
            <Route path="/groups/:groupId/update">
              <UpdateGroup />
            </Route> 
            <Route path="/groups/:groupId">
              <Group sessionUser={sessionUser}/>
            </Route>
            <Route path="/userGroup">
             <UserGroups sessionUser={sessionUser}/>
            </Route>
                       
          </Switch>
          )}
          
          <div>
          <Footer isLoaded={isLoaded} />
          </div>

        </div>
      </div>
    
  ));
}

export default App;
