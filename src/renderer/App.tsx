/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

declare global {
  interface Window {
    electron: {
      store: {
        get: <T>(key: string) => T;
        set: <T>(key: string, val: T) => void;
      };
    };
  }
}

const Landing = () => {
  return (
    <div className="Landing">
      <button
        onClick={() => {
          window.electron.store.set('foo', 'bar');
          // or
          console.log(window.electron.store.get('foo'));
        }}
      >
        Click Me!
      </button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}
