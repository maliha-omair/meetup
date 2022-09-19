import { csrfFetch } from "./csrf"

const CLEAR_STATE = "event/clear"
const SET_EVENT = "event/setEvent"
const SET_EVENTS = "event/setEvents"
const REMOVE_EVENT = "event/removeEvent"
const REMOVE_EVENTS = "event/removeEvents"


const clearState=(events)=>{
  return{
      type: CLEAR_STATE
  }
}


const setEvents=(events)=>{
    return{
        type: SET_EVENTS,
        payload: events
    }
}


const setEvent=(curr_event)=>{
    return{
        type: SET_EVENT,
        payload: curr_event
    }
}

const removeEvent = () =>{
    return {
      type: REMOVE_EVENT
    }
}

const removeEvents = () =>{
  return {
    type: REMOVE_EVENTS
  }
}


 //get all events
 export const getAllPublicEventsThunk = () => async dispatch => { 
    const response = await csrfFetch("/api/events",{
      method:'GET'
    })
    
    if(response.ok){
      const data = await response.json();
      dispatch(clearState());
      dispatch(setEvents(data));
      return response;
    }
  }

export const getGroupEventsThunk = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`,{
        method: "GET"
    });

    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        dispatch(setEvents(data));
        return response;
    }
}


export const getUserEventsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/user/events`,{
        method: "GET"
    });

    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        dispatch(setEvents(data));
        return response;
    }
}

export const getEventByIdThunk = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`,{
        method: "GET"
    })

    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        dispatch(setEvent(data));
        return response;
    }
} 

  //update an event
  export const updateEventThunk = (event) => async dispatch =>{
    const {venueId, name, description, type, capacity, price, startDate, endDate, imageUrl } = event;
   
    const response = await csrfFetch(`/api/events/${event.id}`,{
      method: 'PUT',
      body:JSON.stringify({
        venueId,
        name,
        description,
        type,
        capacity,
        price,
        startDate,
        endDate,
        imageUrl
      }),
    })
    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        return response;
    }    
  }

//delete an event 
export const deleteEventThunk = (eventId)=> async dispatch =>{
    const response = await csrfFetch(`/api/events/${eventId}`,{
      method: 'DELETE'
    })
    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        return response;
    }
  }
export const createNewEventThunk = (event) => async dispatch => {
    const {groupId, venueId, name, type, description, capacity, price, startDate, endDate, imageUrl } = event;
  
    const response = await csrfFetch(`/api/groups/${groupId}/events`,{
      method: 'POST',
      body:JSON.stringify({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
        imageUrl
      }),
    })
    if(response.ok){
        const data = await response.json();
        dispatch(clearState());
        return data;
    }    
}


const initialState = {};
const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case SET_EVENT:
        newState = {...state};
        newState.event = action.payload;
        return newState;     
      case SET_EVENTS:
        newState = {...state};
        newState.events = action.payload.Events;
        return newState;
      case REMOVE_EVENT:
        newState = {...state};
        newState.event = null;
        return newState;
      case REMOVE_EVENTS:
        newState = {...state};
        newState.events = null;
        return newState;
      case CLEAR_STATE:
        return initialState;
      default:
      return state;
    }
  };

  export default eventReducer;