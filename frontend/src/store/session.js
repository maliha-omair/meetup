import { csrfFetch } from './csrf';
import { useDispatch} from 'react-redux';
import {removeGroups} from "../store/groups"

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';


const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

//login check authenticity
export const login = (loginRequest) => async (dispatch) => {
  const { credential, password } = loginRequest;
  const response = await csrfFetch('/api/session', {
    // mode: "no-cors",
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data));
  return response;
};

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();

    if(response.ok) {
      dispatch(setUser(data));
      return response;
    }  
    else{
      dispatch(setUser(null));
    }    
};

//signup new user
export const signup = (user) => async dispatch => {
    const {firstName, lastName, email, password, username } = user;
    const response = await csrfFetch('/api/users',{
        method: 'POST',
        body:JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password,
        }),          
    });
    if(response.ok){
        const data = await response.json();
        dispatch(setUser(data))
        return response;
    }    
}


//logout
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    // dispatch(removeUser());
    // dispatch(removeGroups())
    // dispatch(resetState());
    return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;




// import { csrfFetch } from "./csrf"

// const SET_SESSION = "session/set"
// const REMOVE_SESSION = "session/remove"

// // const currentUser= {
// //     user: {
// //       id,
// //       email,
// //       username,
// //       createdAt,
// //       updatedAt
// //     }
// // };

// export function setSession(user){
//     return {
//         type:SET_SESSION,
//         user
//     }
// }

// export function removeSession(){
//     return {
//         type:REMOVE_SESSION
//     }
// }

// export const thunkSetSession=(user)=>async dispatch=>{
    
//     const response = await csrfFetch("/api/session",{
//         method: "POST",
//         headers: {
//             "content-type": "application/json",
//         },
//         body : JSON.stringify(user)
//     })
//     if(response.ok){
//         const sessionUser = await response.json()
//         dispatch(setSession(sessionUser))

//     }else{

//          throw new Error()
        
//     }
// }
// export default function sessionReducer(state={user:null}, action){

//     switch(action.type){
//         case SET_SESSION:
//             const newState = {...state}
//             newState[action.user.id]=action.user;
//             return newState
//         default:
//             return state
//     }


// }