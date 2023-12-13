/* global document */

import React from 'react';
import ReactDOM from 'react-dom/client';

function Index() {
  return <div>Hello React!</div>;
}

const root = ReactDOM.createRoot(document.getElementById('display-container')!);
root.render(<Index />);
