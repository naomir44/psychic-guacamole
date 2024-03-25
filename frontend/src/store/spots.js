import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const CREATE_NEW_SPOT = 'spots/CREATE_NEW_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';


const createNewSpot = (newSpot) => {
  return {
    type: CREATE_NEW_SPOT,
    newSpot
  }
}

const editSpot = (spot) => {
  return {
    type: EDIT_SPOT,
    spot
  }
}

const getSpotDetails = (spot) => {
  return {
    type: GET_SPOT_DETAILS,
    spot
  }
};

const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots
  }
};

export const fetchEditSpot = (spotId, spot) => async (dispatch) => {
const response = await csrfFetch(`/api/spots/${spotId}`, {
  method: 'PUT',
  body: JSON.stringify(spot)
})
  if(response.ok) {
    const edit = await response.json();
    dispatch(editSpot(edit))
    return edit
  }
}

export const createSpot = (data) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
    if (response.ok) {
      const newSpot = await response.json();
      dispatch(createNewSpot(newSpot))
      return newSpot;
    }
}


export const fetchOneSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(getSpotDetails(spot))
    return spot;
  }
}

export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');

  if (response.ok) {
    const spot = await response.json();
    dispatch(getSpots(spot));
  }
};

export const fetchCurrSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current')

  if (response.ok) {
    const spots = await response.json();
    dispatch(getSpots(spots))
  }
};

export const deleteCurrSpot = (spotId) => async (dispatch) => {
const response = await csrfFetch(`/api/spots/${spotId}`, {
  method: 'DELETE'

})
  if (response.ok) {
    dispatch(fetchCurrSpots())
     return response
  }
};


const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      const allSpots = { ...state };
      action.spots.Spots.forEach(spot => {
        allSpots[spot.id] = spot
      });
      return allSpots
    }
      case GET_SPOT_DETAILS: {
        return {
          ...state,
          [action.spot.id]: action.spot
        }
      }
      case CREATE_NEW_SPOT: {
        return {
          ...state,
          [action.newSpot.id]: {
            ...state[action.newSpot.id],
            ...action.newSpot
          }
        }
      }
      case EDIT_SPOT: {
        return{
          ...state,
          [action.spot.id]: {...state[action.spot]}
        }
      }

    default:
      return state
  }
}



export default spotReducer;
