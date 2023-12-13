import React from 'react';
import Button from 'components/Button';
import { sendMessageToActiveTab } from 'utils/sendMessages';

const setGreen = () => {
  sendMessageToActiveTab({ type: 'CHANGE_COLOR', data: { color: 'green' } });
};

const setRed = async () => {
  sendMessageToActiveTab({ type: 'CHANGE_COLOR', data: { color: 'red' } });
};

const Popup = () => {
  return (
    <div>
      <Button label="green" action={setGreen} />
      <Button label="red" action={setRed} />
    </div>
  );
};

export default Popup;
