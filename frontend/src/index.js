import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

import {ContextProvider} from './SocketContext';
//comment


ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('root')
);


