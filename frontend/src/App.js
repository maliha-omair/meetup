
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import SignupFormPage from "./component/SignupFormPage"
import LoginFormPage from './component/LoginFormPage';
import Home from './component/Home'
import * as sessionActions from "./store/session";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    setIsLoaded(true);
  }, [dispatch]);
  
  return isLoaded && (
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
     </Switch>
  );
}

export default App;
