import { csrfFetch } from "./csrf";


const GET_SPOT_REVIEWS = 'reviews/getSpotReviews';
const CREATE_REVIEW = 'reviews/createReview';
const DELETE_REVIEW = 'reviews/deleteReview';

const deleteRev = (review) => {
  return {
    type: DELETE_REVIEW,
    review
  }
}

const createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review
  }
}

const getReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews
  }
}

export const deleteCurrReview = (reviewId) => async (dispatch) => {
  const response =  await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    let review = await response.json()
    dispatch(deleteRev(review))
    return review
  }
};

export const fetchCreateReview = (spotId, review) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
    headers: {'Content-Type': 'application/json'}
  })

  if (response.ok) {
    const newReview = await response.json()
    dispatch(createReview(newReview))
    return newReview;
  }
}


export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`)

  if (response.ok) {
    const reviews = await response.json();
    dispatch(getReviews(reviews.Reviews))
    return reviews
  }
}


const intialState = {};

const reviewsReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_SPOT_REVIEWS: {
      const reviewsState = {...state}
      action.reviews.forEach((review => reviewsState[review.id] = review))
      return reviewsState
    }
    case CREATE_REVIEW: {
      const newReview = action.review;
      return {
        ...state,
        [newReview.id]: newReview,
      }
    }
    case DELETE_REVIEW: {
      const { review } = action;
      const newState = { ...state };
      delete newState[review.id];
      return newState;
    }
    default:
    return state
  }
}

export default reviewsReducer;
