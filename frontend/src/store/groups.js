import { csrfFetch } from "./csrf";


const SET_CURRENT_GROUP = 'session/setCurrentGroup';

const setCurrentGroup = (group) => {
    return {
      type: SET_CURRENT_GROUP,
      payload: group
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
  
  const initialState = { currentGroup: null };
  const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case SET_CURRENT_GROUP:
        newState = Object.assign({}, state);
        newState.currentGroup = action.payload;
        return newState;
    //   case REMOVE_USER:
    //     newState = Object.assign({}, state);
    //     newState.user = null;
    //     return newState;
      default:
        return state;
    }
  };
  
  export default groupReducer;