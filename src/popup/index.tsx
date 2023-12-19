import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';

const Index = () => (
  <ChakraProvider>
    <Popup />
  </ChakraProvider>
);

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<Index />);
