import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import './SignUpForm.css';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  if (sessionUser) return <Navigate to="/" replace={true} />;

  const isValidForm = () => {
    return (
     email.length > 0 &&
     username.length >= 4 &&
     password.length >= 6 &&
     firstName.length > 0 &&
     lastName.length > 0 &&
     confirmPassword.length >= 6
    //  firstName.length > 0 &&
    //  lastName.length > 0 &&
    //  password.length > 0 &&
    //  confirmPassword.length > 0 &&
    //  username.length > 0
    )
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Passwords must match"
      });
      return;
    }
    dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(() => {
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className='error-message'>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className='error-message'>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className='error-message'>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='error-message'>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className='error-message'>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword}</p>}
        <button disabled={!isValidForm()} type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormPage;
