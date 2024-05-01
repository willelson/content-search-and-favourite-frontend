import { Outlet, Link } from 'react-router-dom';

const RoleAccess = ({ roles = [] }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user ? <Outlet /> : <Navigate to='/login' replace />;
};
