import { useParams } from "react-router-dom";
import { fetchOneSpot } from "../../store/spots";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/reviews";
import './SpotDetails.css';
import '../../store/session.js';
import ReviewFormModal from "../ReviewFormModal";
import OpenModalButton from '../OpenModalButton';
import DeleteReview from "../DeleteReview/DeleteReviewModal.jsx";


const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector((state) => state.reviews);
  const reviewList = Object.values(reviews).filter(review => review.spotId === +spotId)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  console.log(reviewList)
  const session = useSelector((state) => state.session.user);

  const userHasReview = reviewList.find(currReview => currReview.userId === session?.id);

  useEffect(() => {
    dispatch(fetchOneSpot(+spotId))
      .then(dispatch(fetchReviews(+spotId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, spotId, isLoaded])

  const handleClick = () => {
    alert('Feature Coming Soon...')
  }

  return (
    <>
      {isLoaded &&
        <main >
          <div className="left-column">
          <h1 className="title">{spot.name}</h1>
          <div>{spot.city}, {spot.state}, {spot.country}</div>

          <div className="images">
            {spot.spotImages.map(img => (
              <img className="img" key={img.id} src={img.url}></img>
            ))}
          </div>
          <div>{`Hosted By ${spot.Owner.firstName} ${spot.Owner.lastName}`}</div>
          <p className="spot-description">{spot.description}</p>
          </div>
          <div className="right-column">
          <div className="reserve-box">
            <span>${spot.price}/night </span>
            <span> ⭐️{spot.avgStarRating ? parseInt(spot.avgStarRating).toFixed(1) : "New"}</span>
            <span> · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
            <button className="reserve-button" onClick={handleClick}>Reserve</button>
          </div>
          </div>
          <div className="reviews">
            <div className="review-modal">
              <span
                hidden={!session || spot.Owner.id === session?.id || userHasReview}
              >
                <OpenModalButton
                  buttonText="Post Your Review"
                  modalComponent={<ReviewFormModal spotId={spotId} />} />
              </span>
            </div>
            <span hidden={reviewList.length !== 0 || (session?.user
              && spot.Owner.id === session?.id)}>
              Be the first to post a review!
            </span>
            <div className="review-data">
              <span> ⭐️{spot.avgStarRating ? parseInt(spot.avgStarRating).toFixed(1) : "New"}</span>
              <span> · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
              {reviewList && reviewList.sort((a,b)=> new Date(b.createdAt)- new Date(a.createdAt)).map((review) => (
                <div key={review.id} className="review-container">
                   <p>{review.User.firstName}</p>
                  <p>{months[new Date(review.createdAt).getMonth()]} {review.createdAt.split('-')[0]}</p>
                  <p className="actual-review">{review.review}</p>
                  <span className="delete-button-container" hidden={review.userId !== session?.id}>
                    <OpenModalButton className="delete-button"
                      buttonText='Delete'
                      modalComponent={<DeleteReview reviewId={review.id} spotId={spotId} />}
                      />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      }
    </>
  )
}


export default SpotDetails;
