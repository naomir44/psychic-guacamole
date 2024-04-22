import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreateReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { FaStar } from 'react-icons/fa'
import './ReviewFormModal.css';

const ReviewFormModal = ({spotId}) => {
const dispatch = useDispatch();
const { closeModal } = useModal()
let selectStar = [1, 2, 3, 4, 5]
const [currSelection, setCurrSelection] = useState(0)
const [hover, setHover] = useState(0)
const [reviewText, setReviewText] = useState('');
const [firstName, setFirstName ] = useState('');
const [errors, setErrors] = useState('');
spotId = +spotId
errors
const user = useSelector(state => state.session.user)

const handleSubmit = async (e) => {
  e.preventDefault();
if (user) setFirstName(user.firstName)
let newReview = {
  User: { firstName: firstName },
  spotId: spotId,
  userId: user.id,
  review: reviewText,
  stars: currSelection,

}

 await dispatch(fetchCreateReview(spotId, newReview, user))
 .catch(async (response) => {
  let data = await response.json()
  if (data && data.errors) setErrors(data.errors)
 })
  closeModal()
}

const disabled = reviewText.length < 10 || currSelection === 0;


return (
    <form className="review-modal-itself" onSubmit={handleSubmit}>
      <h2>How was your stay?</h2>
      <textarea className="review-text-box"
        placeholder="Leave your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
     <div className="star-rating-filled-stars">
      {selectStar.map(selection => {
       return  <div key={selection} className={currSelection >= selection || hover >= selection ? "filled": "empty"}
        onMouseEnter={() => setHover(selection)}
        onMouseLeave={() => setHover(0)}
        onClick={() => setCurrSelection(selection)}>
          <FaStar />
          </div>
      })}Stars
     </div>
      <button disabled={disabled} type="submit">Submit Your Review</button>
      {/* <button type="button" onClick={closeModal}>Cancel</button> */}
    </form>
);
};


export default ReviewFormModal;
