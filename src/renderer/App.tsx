/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';
import './App.css';

declare global {
  interface Window {
    electron: {
      store: {
        get: <T>(key: string) => T;
        set: <T>(key: string, val: T) => void;
      };
      ipcRenderer: {
        request(cfg: string): any;
        fileOpen(): any;
        on<T>(event: string, handler: { (data: T): void }): void;
        once<T>(event: string, handler: { (data: T): void }): void;
      };
    };
  }
}

const Landing = () => {
  return (
    <div className="Landing">
      <button
        onClick={async () => {
          const req: AxiosRequestConfig = {
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            headers: {
              'content-type': 'application/json',
            },
          };
          window.electron.ipcRenderer.request(JSON.stringify(req));
          window.electron.ipcRenderer.on('http-request', (res: string) => {
            const json = JSON.parse(res);
            console.log(json);
          });

          // window.electron.store.set('foo', 'bar');
          // console.log(window.electron.store.get('foo'));
        }}
      >
        Test HTTP Request
      </button>
      <button
        onClick={async () => {
          window.electron.ipcRenderer.fileOpen();
          window.electron.ipcRenderer.on('file-open', (res: string) => {
            const json = JSON.parse(res);
            console.log('json: ', json);
            // window.electron.store.set('last-file-open', res);
            // const stored = JSON.parse(
            //   window.electron.store.get('last-file-open')
            // );
            // console.log('stored: ', stored);
          });
        }}
      >
        Test File Open
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
