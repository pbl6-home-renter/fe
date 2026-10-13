import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FBFE] flex flex-col justify-center items-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

