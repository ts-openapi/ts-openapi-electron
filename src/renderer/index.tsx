import { render } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalRouter from './GlobalRouter';

render(
  <MemoryRouter>
    <GlobalRouter />
  </MemoryRouter>,
  document.getElementById('root')
);
