import { csrfFetch } from "./csrf"

const SET_CURRENT_EVENT = "events/setCurrentEvent"
const SET_GROUP_EVENTS = "events/getGroupEvents"
const SET_EVENTS = "events/setEvents"
const DELETE_EVENT = "event/deleteEvent"
// const UPDATE_EVENT = 'event/updateEvent';

const setGroupEvents=(events)=>{
    return{
        type: SET_GROUP_EVENTS,
        payload: events
    }
}

const setEvents=(events)=>{
    return{
        type: SET_EVENTS,
        payload: events
    }
}


const setCurrentEvent=(curr_event)=>{
    return{
        type: SET_CURRENT_EVENT,
        payload: curr_event
    }
}
const deleteEvent = () =>{
    return {
      type: DELETE_EVENT
    }
}

// export function updateEvent(id){
//     return{
//       type: UPDATE_EVENT,
//       payload: id
//     }
// }

 //get all events
 export const getAllPublicEventsThunk = () => async dispatch => { 
    const response = await csrfFetch("/api/events",{
      method:'GET'
    })
    
    if(response.ok){
      const data = await response.json();
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
        dispatch(setGroupEvents(data));
        return response;
    }
}


export const getUserEventsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/user/events`,{
        method: "GET"
    });

    if(response.ok){
        const data = await response.json();
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
        dispatch(setCurrentEvent(data));
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
        dispatch(setCurrentEvent(null));
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
        dispatch(deleteEvent());
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
        dispatch(setCurrentEvent(null));
        return response;
    }    
}


const initialState = {};
const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_CURRENT_EVENT:
            newState = {...state};
            newState.currentEvent = action.payload;
            return newState;     
        case SET_GROUP_EVENTS:
            newState = {...state};
            newState.events = action.payload.Events;
            return newState;
        case SET_EVENTS:
                newState = {...state};
                newState.events = action.payload.Events;
                return newState;
        case DELETE_EVENT:
            newState = {...state};
            newState.currentEvent = null;
            return newState;
        default:
            return state;
    }
  };

  export default eventReducer;