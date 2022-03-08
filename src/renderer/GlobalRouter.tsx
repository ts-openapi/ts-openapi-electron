/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route } from 'react-router-dom';
import { App, AppLayout, AppSettings } from './components/App';
import { Spec } from './components/Spec';
import GlobalStore from './GlobalStore';

function GlobalRouter() {
  return (
    <div className="GlobalRouter">
      <GlobalStore>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="settings" element={<AppSettings />} />
              <Route path="specification" element={<Spec />} />
            </Route>
          </Route>
        </Routes>
      </GlobalStore>
    </div>
  );
}

export default GlobalRouter;
