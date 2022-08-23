import GetAllGroups from "../component/Groups/GetAllGroups";
import { csrfFetch } from "./csrf";


const SET_CURRENT_GROUP = 'group/setCurrentGroup';
const GET_GROUPS = 'group/getGroups'

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
    console.log("after getting response ", response)
    if(response.ok){
      const data = await response.json();
      console.log("data is ",data)
      dispatch(getAllGroups(data));
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