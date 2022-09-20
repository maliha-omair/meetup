import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from "../store/session"
import eventReducer from './events';
import groupReducer from './groups';
// import {thunkSetSession} from "../store/session"

const RESET_STATE = 'root/RESET_STATE';


export function resetState() {
  return {
    type: RESET_STATE
  };
};


const appReducer = combineReducers({
    session:sessionReducer,
    group: groupReducer,
    event: eventReducer
});

const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}
let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}
const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };
  
  export default configureStore;