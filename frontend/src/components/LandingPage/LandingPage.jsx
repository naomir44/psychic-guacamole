import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots);
  const spots = Object.values(allSpots)

  useEffect(() => {
    dispatch(fetchSpots())
  }, [dispatch])

  return (
    <>
      <main className="landing-page">
        {spots.map((spot) => (
          <NavLink key={spot.name} to={`spots/${spot.id}`} className="spot-link" title={spot.name}>
            <div className="landing-spot-container">
              <div className="image-container">
              <img className="landing-img"src={spot.previewImage} alt={`${spot.name}`} />
              </div>
              <div style={{ textDecoration: 'none' }} className="spot-details">
                <div className="spot-info">
                <div className="spot-location" style={{ textDecoration: 'none' }}>
                <span>{`${spot.city}, ${spot.state}`}</span>
                </div>
                <span style={{ textDecoration: 'none' }} className="spot-rating">{spot.avgRating > 0 ? `⭐️ ${parseInt(spot.avgRating).toFixed(1)}`:"⭐️New"}</span>
                </div>
                <span style={{ textDecoration: 'none' }} className="spot-price">{`$${spot.price} night`}</span>
              </div>
            </div>
          </NavLink>
        ))}
      </main>
    </>
  );
}

export default LandingPage;
