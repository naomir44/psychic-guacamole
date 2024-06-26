import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import './DeleteSpotModal.css';
import { deleteCurrSpot } from '../../store/spots';

const DeleteSpot = ( {spotId} ) => {
const { closeModal } = useModal();
const dispatch = useDispatch();
const [errors, setErrors] = useState({})

const handleClick = (e) => {
  e.preventDefault()
  setErrors({})
  dispatch(deleteCurrSpot(spotId))
    .then(closeModal)
    .catch(async (res) => {
      let data = await res.json()
      if (data && data.errors) setErrors(data.errors)
    })
}

  return (
    <>
    <form className='delete-spot-modal'>
    <div>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this spot from the listings?</p>
      {errors.message && (
        <div>{errors}</div>
      )}
      <div className='buttons'>
        <button onClick={handleClick} className='delete-button'> Yes (Delete Spot)</button>
        <button onClick={closeModal} className='cancel-button'> No (Keep Spot)</button>
      </div>
    </div>
    </form>
    </>
  )
}

export default DeleteSpot;
