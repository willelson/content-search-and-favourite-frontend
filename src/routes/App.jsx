import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import Layout from './Layout';
import Login from './Login';
import Register from './Register';
import Search from './Search';
import Favourites from './Favourites';

import { getUserCredentials } from './helpers/tokenManager';

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
