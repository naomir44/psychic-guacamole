import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { deleteCurrReview } from "../../store/reviews";
import './DeleteReviewModal.css';


const DeleteReview = ( {reviewId, spotId} ) => {
  const { closeModal } = useModal();
const dispatch = useDispatch();
const [errors, setErrors] = useState({})
spotId = +spotId

const handleClick = (e) => {
  e.preventDefault()
  setErrors({})
  dispatch(deleteCurrReview(reviewId, spotId))
    .then(closeModal)
    .catch(async (res) => {
      let data = await res.json()
      if (data && data.errors) setErrors(data.errors)
    })
}
  return (
      <>
      <form className='delete-review-modal'>
      <div>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to remove this review from the listings?</p>
        {errors.message && (
          <div>{errors}</div>
        )}
        <div className="buttons">
          <button onClick={handleClick} className='delete-button'> Yes (Delete Review)</button>
          <button onClick={closeModal} className='cancel-button'> No (Keep Review)</button>
        </div>
      </div>
      </form>
      </>
    )
}

export default DeleteReview;
