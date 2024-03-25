import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
    <div className="nav-container">
      <div className="home">
        <NavLink to="/">
          <button className='home-button'>Home</button>
        </NavLink>
      </div>
      <div hidden={!sessionUser}>
        <NavLink to='/spots/new'>
          <button>Create New Spot</button>
        </NavLink>
      </div>
      {isLoaded && (
        <div className="profile-button">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  </nav>

  );
}

export default Navigation;
