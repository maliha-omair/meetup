// import GetAllGroups from "../component/GetAllGroups";
import { csrfFetch } from "./csrf";


const SET_CURRENT_GROUP = 'group/setCurrentGroup';
const GET_GROUPS = 'group/getGroups';
const USER_GROUPS = 'group/userGroups';
const REMOVE_USER_GROUPS = 'group/removeUserGroups';


const setCurrentGroup = (group) => {
  return {
    type: SET_CURRENT_GROUP,
    payload: group
  }
}

const getAllGroups = (groups) => {
  return {
    type: GET_GROUPS,
    payload: groups    
  }
}

const userGroups = (groups) => {
  return{
    type: USER_GROUPS,
    payload: groups
  }
}

export function removerUserGroups (){
  return {
    type: REMOVE_USER_GROUPS
  }
}

//create new group
export const createGroup = (group) => async dispatch =>{
    const {name, about, type, isPrivate, city, state } = group;
    const response = await csrfFetch("/api/groups",{
      method: 'POST',
      body:JSON.stringify({
        name,
        about,
        type,
        private:isPrivate,
        city,
        state,
      }),
    })
    if(response.ok){
        const data = await response.json();
        dispatch(setCurrentGroup(data))
        return response;
    }    
  }
  
  //get all groups
  export const getGroups = () => async dispatch => { 
    const response = await csrfFetch("/api/groups",{
      method:'GET'
    })
    
    if(response.ok){
      const data = await response.json();
      dispatch(getAllGroups(data));
      return response;
    }
  }


  //get user groups
  export const getUserGroups = () => async dispatch => {
    const response = await csrfFetch(`/api/groups/current`,{
      method: 'GET'
    });
    if(response.ok){
      const data = await response.json();
      dispatch(userGroups(data));
      return response;
    }
  }
  

  //get all groups
  export const getGroupByIdThunk = (id) => async dispatch => { 
    const response = await csrfFetch(`/api/groups/${id}`,{
      method:'GET'
    })
    
    if(response.ok){
      const data = await response.json();
      dispatch(setCurrentGroup(data));
      return response;
    }
  }


  const initialState = { currentGroup: null };
  const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case SET_CURRENT_GROUP:
        newState = Object.assign({}, state);
        newState.currentGroup = action.payload;
        return newState;
      case GET_GROUPS:
        newState = {...state};
        newState.allGroups = action.payload.Groups;
        return newState;
      case USER_GROUPS:
        newState = {...state}; 
        newState.userGroups = action.payload.Groups;
        return newState;
      case REMOVE_USER_GROUPS:
        newState = {...state};
        newState.userGroups = null;
        return newState;
    //   case REMOVE_USER:
    //     newState = Object.assign({}, state);
    //     newState.user = null;
    //     return newState;
      case GET_GROUPS:

      default:
        return state;
    }
  };
  
  export default groupReducer;