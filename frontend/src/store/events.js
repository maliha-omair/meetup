import { csrfFetch } from "./csrf"

const SET_CURRENT_EVENT = "events/setCurrentEvent"
const SET_GROUP_EVENTS = "events/getGroupEvents"

const setGroupEvents=(events)=>{
    return{
        type: SET_GROUP_EVENTS,
        payload: events
    }
}

const setCurrentEvent=(curr_event)=>{
    return{
        type: SET_CURRENT_EVENT,
        payload: curr_event
    }
}

export const getGroupEventsThunk = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`,{
        method: "GET"
    });

    if(response.ok){
        const data = await response.json();
        dispatch(setGroupEvents(data));
        return response;
    }
}

export const setCurrentEventThunk = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`,{
        method: "GET"
    });
    if(response.ok){
        const data = await response.json();
        dispatch(setCurrentEvent(data));
        return response;
    }
}
const initialState = {};
const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case SET_CURRENT_EVENT:
        newState = Object.assign({}, state);
        newState.currentEvent = action.payload;
        return newState;
     
      case SET_GROUP_EVENTS:
        newState = {...state};
        newState.events = action.payload.Events;
        return newState;
      default:
        return state;
    }
  };

  export default eventReducer;