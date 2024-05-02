import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeUserCredentials } from './helpers/tokenManager';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    const url = 'http://localhost:3000/api/v1/auth/login';
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
      // Store user credentials
      const token = response.headers.get('Authorization');
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

  return (
    <>
      <form onSubmit={loginUser}>
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
        <div>
          <button type='submit'>Login</button>
        </div>
      </form>
      <p>
        New here? <Link to='/register'>Register</Link>.
      </p>
    </>
  );
}
