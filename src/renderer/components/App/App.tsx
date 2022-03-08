/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from 'react-router-dom';
import './App.css';

declare global {
  interface Window {
    electron: {
      axios: {
        request(cfg: string): any;
      };
      open: {
        specFile(): any;
      };
      store: {
        get: <T>(key: string) => T;
        set: <T>(key: string, val: T) => void;
      };
      ipcRenderer: {
        on<T>(event: string, handler: { (data: T): void }): void;
        once<T>(event: string, handler: { (data: T): void }): void;
      };
    };
  }
}

function App() {
  return (
    <div className="App">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
