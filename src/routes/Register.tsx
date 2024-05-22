import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Flex, Stack } from '@mantine/core';

import { storeUserCredentials } from '../helpers/tokenManager';
import { API_BASE } from '../helpers/constants';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const register = async () => {
    const url = `${API_BASE}/auth/register`;
    const response = await fetch(url, {
      method: 'POST',
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

  const submitRegisterForm = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    register();
  };

  return (
    <Flex align='center' justify='center' style={{ height: '100vh' }}>
      <form onSubmit={submitRegisterForm}>
        <Stack>
          <Input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type='submit' mt='md'>
            Register
          </Button>
          <p>
            Already registered? <Link to='/login'>Login</Link>.
          </p>
        </Stack>
      </form>
    </Flex>
  );
}
