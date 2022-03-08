import { Outlet } from 'react-router-dom';
import AppNav from './AppNav';

function AppLayout() {
  return (
    <div className="AppLayout">
      <AppNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
