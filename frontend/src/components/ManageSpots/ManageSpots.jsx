import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { fetchCurrSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpotModal";
import './ManageSpots.css';


const ManageSpots = () => {
  // const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user)
  const spots = useSelector((state) => state.spots)
  const spotList = Object.values(spots).filter((spot) => spot.ownerId === user.id)

  useEffect(() => {
    dispatch(fetchCurrSpots())
  }, [dispatch])

if (spotList.length === 0) {
  return (
    <>
    <h1>Manage Spots</h1>
    <NavLink to={'/spots/new'}>
      <button>Create a new Spot</button>
    </NavLink>
    </>
  )
}
return (

<>
<h1 className="manage-spots-h1">Manage Spots</h1>
<main className="manage-spots">
  {spotList.map((spot) => (
    <div key={spot.id} className="spot">
      <NavLink to={`/spots/${spot.id}`} className="spot-link">
        <div className="spot-container">
          <img src={spot.previewImage} alt={`${spot.name}`} className="spot-image" />
          <div className="manage-details">
            <span className="manage-location">{`${spot.city}, ${spot.state}`}</span>
            <span className="manage-rating">{spot.avgRating > 0 ? `⭐️ ${parseInt(spot.avgRating).toFixed(1)}`:"⭐️New"}</span>
            <span className="manage-price">{`$${spot.price} night`}</span>
          </div>
        </div>
      </NavLink>
      <div className="spot-actions">
        <NavLink to={`/spots/${spot.id}/edit`}>
          <button>Update</button>
        </NavLink>
        <OpenModalButton
          buttonText={'Delete'}
          modalComponent={<DeleteSpot spotId={spot.id} />}
        />
      </div>
    </div>
  ))}
</main>
</>
)
}

export default ManageSpots;
