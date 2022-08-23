
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
import Footer from "./component/Footer";
import "./index.css"
import { GroupsForm } from "./component/Groups/GroupsForm";
import GetAllGroups from "./component/GetAllGroups/GetAllGroups";
import GetAGroup from "./component/GetAGroup/GetAGroup";
import UserGroup from "./component/UserGroups/UserGroups";
import UserGroups from "./component/UserGroups/UserGroups";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    }).catch(()=>{
      setIsLoaded(true);
    });
    // setIsLoaded(true);
  }, [dispatch]);
  
  return (
   
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
              <GetAllGroups />
            </Route>
            <Route path="/singleGroup/:groupId">
              <GetAGroup />
            </Route>
            <Route path="/userGroup">
             <UserGroups />
            </Route>
          </Switch>
          )}
          
          <div>
          <Footer isLoaded={isLoaded} />
          </div>

        </div>
      </div>
    
  );
}

export default App;
