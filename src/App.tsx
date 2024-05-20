import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import Layout from './routes/Layout';
import Login from './routes/Login';
import Register from './routes/Register';
import Search from './routes/Search';
import Favourites from './routes/Favourites';

import { getUserCredentials } from './helpers/tokenManager';

// Navigates to login page if no user credentials are stored
const UserAuthenticated = () => {
  const user = getUserCredentials();
  return user ? <Outlet /> : <Navigate to='/login' replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        <Route path='/' element={<Layout />}>
          <Route element={<UserAuthenticated />}>
            <Route index path='search' element={<Search />} />
          </Route>

          <Route element={<UserAuthenticated />}>
            <Route path='favourites' element={<Favourites />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
