// import GetAllGroups from "../component/GetAllGroups";
import { csrfFetch } from "./csrf";

const CLEAR_STATE = 'group/clear';
const SET_GROUP = 'group/setGroup';
const SET_GROUPS = 'group/setGroups';
const REMOVE_GROUPS = 'group/removeGroups';
const UPDATE_GROUP = 'group/updateGroup';
const REMOVE_GROUP = "group/removeGroup"
// const VIEW_VENUE = "group/viewVenue"


const clearState = () => {
  return {
    type: CLEAR_STATE
  }
}


const setGroup = (group) => {
  return {
    type: SET_GROUP,
    payload: group
  }
}

const setGroups = (groups) => {
  return {
    type: SET_GROUPS,
    payload: groups    
  }
}

const removeGroup = () =>{
  return {
    type: REMOVE_GROUP
  }
}

export function removeGroups (){
  return {
    type: REMOVE_GROUPS
  }
}

export function updateGroup(id){
  return{
    type: UPDATE_GROUP,
    payload: id
  }
}

//create new group
export const createGroupThunk = (group) => async dispatch =>{
    const {name, about, type, isPrivate, city, state, imageUrl } = group;
  
    const response = await csrfFetch("/api/groups",{
      method: 'POST',
      body:JSON.stringify({
        name,
        about,
        type,
        private:isPrivate,
        city,
        state,
        imageUrl
      }),
    })
    if(response.ok){
        const data = await response.json();
        dispatch(clearState())
        dispatch(setGroup(data))
        return response;
    }    
  }

  //update a group
  export const updateGroupThunk = (group,groupId) => async dispatch =>{
    const {name, about, type, isPrivate, city, state, imageUrl } = group;
   
    const response = await csrfFetch(`/api/groups/${groupId}`,{
      method: 'PUT',
      body:JSON.stringify({
        name,
        about,
        type,
        private:isPrivate,
        city,
        state,
        imageUrl
      }),
    })
    if(response.ok){
        const data = await response.json();
        dispatch(clearState())
        dispatch(setGroup(data))
        return response;
    }    
  }
  
  export const deleteGroupThunk = (groupId)=> async dispatch =>{
    const response = await csrfFetch(`/api/groups/${groupId}`,{
      method: 'DELETE'
    })
    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        return response;
    }
  }
  //get all groups
  export const getAllGroupsThunk = () => async dispatch => { 
    const response = await csrfFetch("/api/groups",{
      method:'GET'
    })
    
    if(response.ok){
      const data = await response.json();
      dispatch(clearState())
      dispatch(setGroups(data));
      return response;
    }
  }

 
  //get user groups
  export const getUserGroupsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/groups/current`,{
      method: 'GET'
    });
    
    if(response.ok){
      const data = await response.json();
      dispatch(clearState())
      dispatch(setGroups(data));
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
      dispatch(clearState())
      dispatch(setGroup(data));
      return response;
    }
  }


  const initialState = {  };
  const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case SET_GROUP:
        newState = Object.assign({}, state);
        newState.group = action.payload;
        return newState;
      case SET_GROUPS:
        newState = {...state};
        newState.groups = action.payload.Groups;
        return newState;
      case REMOVE_GROUPS:
        newState = {...state};
        newState.groups = null;
        return newState;
      case REMOVE_GROUP:
        newState = {...state};
        newState.group = null;
        return newState;
      case CLEAR_STATE:
        return initialState;
      default:
        return state;
    }
  };
  
  export default groupReducer;