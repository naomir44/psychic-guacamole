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
  const spotList = Object.values(spots)
  const ownerSpots = []

  spotList.forEach((spot) => {
    if (spot.ownerId === user.id) ownerSpots.push(spot)
  })

  useEffect(() => {
    dispatch(fetchCurrSpots())
  }, [dispatch])

if (ownerSpots.length === 0) {
  return (
    <NavLink to={'/spots/new'}>
      <button>Create a new Spot</button>
    </NavLink>
  )
}


return (

    <>
    <h1>Manage Spots</h1>
      <main className="manage-spots">
        {ownerSpots.map((spot) => (
          <>
          <NavLink key={spot.name} to={`/spots/${spot.id}`} className="spot-link">
            <div className="spot-container">
              <img src={spot.previewImage} alt={`${spot.name}`} className="spot-image" />
              <div className="spot-details">
                <span className="spot-location">{`${spot.city}, ${spot.state}`}</span>
                <span className="spot-price">{`$${spot.price} night`}</span>
                <span className="spot-rating">{`⭐️ ${spot.avgRating}`}</span>
              </div>
            </div>
          </NavLink>
          <NavLink to={`/spots/${spot.id}/edit`}>
            <button>Update</button>
          </NavLink>
         <OpenModalButton
         buttonText={'Delete'}
         modalComponent={<DeleteSpot spotId={spot.id} />}
         />
          </>
        ))}
      </main>
    </>

)
}

export default ManageSpots;
