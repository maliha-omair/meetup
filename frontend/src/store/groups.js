// import GetAllGroups from "../component/GetAllGroups";
import { csrfFetch } from "./csrf";


const SET_CURRENT_GROUP = 'group/setCurrentGroup';
const GET_GROUPS = 'group/getGroups';
const USER_GROUPS = 'group/userGroups';
const REMOVE_USER_GROUPS = 'group/removeUserGroups';
const UPDATE_GROUP = 'group/updateGroup';
const DELETE_GROUP = "group/deleteGroup"


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
const deleteGroup = () =>{
  return {
    type: DELETE_GROUP
  }
}

export function removerUserGroups (){
  return {
    type: REMOVE_USER_GROUPS
  }
}

export function updateGroup(id){
  return{
    type: UPDATE_GROUP,
    payload: id
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

  //update a group
  export const updateGroupThunk = (group,groupId) => async dispatch =>{
    const {name, about, type, isPrivate, city, state } = group;
   
    const response = await csrfFetch(`/api/groups/${groupId}`,{
      method: 'PUT',
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
  
  export const deleteGroupThunk = (groupId)=> async dispatch =>{
    const response = await csrfFetch(`/api/groups/${groupId}`,{
      method: 'DELETE'
    })
    if(response.ok){
        const data = await response.json();
        dispatch(deleteGroup())
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
      // const userId = data.organizerId;
      // const userResponse = await csrfFetch(`/api/user`,
      // {
      //     method:"GET", 
      //     body:JSON.stringify({
      //       userId: userId,
      //     }),
      // })
      // if(userResponse.ok) data.organizer = await userResponse.json()
     
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
      case DELETE_GROUP:
        newState = {...state};
        newState.currentGroup = null;
        newState.allGroups = null;
        return newState;
      default:
        return state;
    }
  };
  
  export default groupReducer;