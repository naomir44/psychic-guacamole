import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const isValid = () => {
    return credential.length >= 4 && password.length >= 6
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal()
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
      .catch(async (res) => {
        if(!res.ok) {
          setErrors(['The provided credentials were invalid']);
        }
      })
  };

  const handleDemoUser = (e) => {
    e.preventDefault();
    setCredential('Demo-lition')
    setPassword('password')
    dispatch(sessionActions.login({credential: 'Demo-lition', password: 'password'}))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
  }

  return (
    <>
    <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={!isValid()}>Log In</button>
        <button className='demo-user' onClick={handleDemoUser}>Log In as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
