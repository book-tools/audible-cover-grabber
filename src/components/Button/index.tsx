import type { MouseEventHandler } from 'react';
import React from 'react';
import './button.scss';

export type ButtonProps = {
  action: MouseEventHandler<HTMLButtonElement>;
  label: string;
};

const Button = ({ action, label }: ButtonProps) => (
  <button type="button" className="icbs-button" onClick={action}>
    {label}
  </button>
);

export default Button;
