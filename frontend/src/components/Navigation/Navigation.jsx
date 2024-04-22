import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
    <div className="nav-container">
        <NavLink to="/">
          <img className='home-img'src="https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/pngtree-hand-holding-house-comic-icon-for-home-care-vector-png-image_12860743.png"/>
        </NavLink>
        <div className='app-name'>Anywhere Home</div>
      <div className="create-new-spot-container">
        <NavLink to='/spots/new'>
          <div hidden={!sessionUser} className='create-new-spot-button'>Create New Spot</div>
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
