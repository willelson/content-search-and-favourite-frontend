import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeUserCredentials } from '../helpers/tokenManager';
import { API_BASE } from '../helpers/constants';
import styles from '../styles/AuthForms.module.css';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const register = async () => {
    const url = `${API_BASE}/auth/register`;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 201) {
      // Store user credentials
      const token = response.headers.get('Authorization') || '';
      storeUserCredentials(email, token);

      // Navigate to search page
      navigate('/search');
    } else if (response.status === 400) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert('Unable to register');
    }
  };

  const submitRegisterForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    register();
  };

  return (
    <>
      <div className={styles.authForm}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>Register</h2>
          <form onSubmit={submitRegisterForm}>
            <div>
              <input
                type='text'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.submitContainer}>
              <button type='submit'>Register</button>
            </div>
          </form>
          <p>
            Already registered? <Link to='/login'>Login</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
