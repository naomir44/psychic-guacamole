import { csrfFetch } from "./csrf";
import { fetchOneSpot } from "./spots";


const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const deleteRev = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId
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

export const deleteCurrReview = (reviewId, spotId) => async (dispatch) => {
  const response =  await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    let review = await response.json()
    dispatch(deleteRev(reviewId))
    dispatch(fetchOneSpot(spotId))
    return review
  }
};

export const fetchCreateReview = (spotId, review, user) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
    headers: {'Content-Type': 'application/json'}
  })

  if (response.ok) {
    const newReview = await response.json()
    newReview.spotId = +spotId
    const newReviewData = {...newReview, User: user}
    dispatch(createReview(newReviewData))
    dispatch(fetchOneSpot(spotId))
    return newReviewData;
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
     const newState = {
      ...state,
      [action.review.id]:action.review
     }
     return newState
    }
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    default:
    return state
  }
}

export default reviewsReducer;
