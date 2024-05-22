import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Flex, Stack } from '@mantine/core';

import { storeUserCredentials } from '../helpers/tokenManager';
import { API_BASE } from '../helpers/constants';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const login = async (): Promise<void> => {
    const url = `${API_BASE}/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
      // Store user credentials
      const token: string = response.headers.get('Authorization') || '';
      storeUserCredentials(email, token);

      // Navigate to search page
      navigate('/search');
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert('Unable to login');
    }
  };

  const submitLoginForm = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login();
  };

  return (
    <Flex align='center' justify='center' style={{ height: '100vh' }}>
      <form onSubmit={submitLoginForm}>
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
            Login
          </Button>
          <p>
            New here? <Link to='/register'>Register</Link>.
          </p>
        </Stack>
      </form>
    </Flex>
  );
}
