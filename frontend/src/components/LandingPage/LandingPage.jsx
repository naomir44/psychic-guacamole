import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './LandingPage.css'



const LandingPage = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots);
  const spots = Object.values(allSpots)
  console.log(spots)

  useEffect(() => {
    dispatch(fetchSpots())
  }, [dispatch])

  return (
    <>
      <main className="landing-page">
        {spots.map((spot) => (
          <NavLink key={spot.name} to={`spots/${spot.id}`} className="spot-link">
            <div className="spot-container">
              <img src={spot.previewImage} alt={`${spot.name}`} className="spot-image" />
              <div className="spot-details">
                <span className="spot-location">{`${spot.city}, ${spot.state}`}</span>
                <span className="spot-price">{`$${spot.price} night`}</span>
                <span className="spot-rating">{`⭐️ ${spot.avgRating}`}</span>
              </div>
            </div>
          </NavLink>
        ))}
      </main>
    </>
  );
}

export default LandingPage;
