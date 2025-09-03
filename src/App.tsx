import { Provider } from 'jotai';
import { BrowserRouter } from 'react-router-dom';

import Router from './router';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
