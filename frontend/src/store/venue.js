import { csrfFetch } from "./csrf"
import { getUserGroupsThunk } from "./groups";


const createVenue = (venue) => async dispatch =>{
    const {groupId, address, city, state, lat, lng} = venue;
  
    const response = await csrfFetch(`/api/groups/${groupId}/venues`,{
      method: 'POST',
      body:JSON.stringify({
        address,
        city,
        state,
        lat,
        lng,
      }),
    })
    if(response.ok){
        const data = await response.json();
        return response;
    }    
  }


  export const editVenue = (venue) => async dispatch =>{
    const { venueId, address, city, state, lat, lng} = venue;
  
    const response = await csrfFetch(`/api/venues/${venueId}`,{
      method: 'PUT',
      body:JSON.stringify({
        address,
        city,
        state,
        lat,
        lng,
      }),
    })
    if(response.ok){
        const data = await response.json();
        return response;
    }    
  }


  export const deleteVenue = (venueId) => async dispatch =>{
    
    const response = await csrfFetch(`/api/venues/${venueId}`,{
      method: 'DELETE'
    })
    if(response.ok){
        const data = await response.json();
        dispatch(getUserGroupsThunk);
        return response;
    }
  }
  // const getVenue = (groupId) => async dispatch =>{
  
  //   const response = await csrfFetch(`/api/groups/${groupId}/venues`,{
  //     method: 'GET',      
  //   })
  //   if(response.ok){
  //       const data = await response.json();
  //       return response;
  //   }    
  // }

  export default createVenue;