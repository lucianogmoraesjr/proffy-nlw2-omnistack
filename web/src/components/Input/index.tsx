import { InputHTMLAttributes } from 'react'

import './styles.css';

interface InputProps extends  InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
};

export default function Input({ label, name, ...rest }: InputProps) {
  return (
    <div className="input-block">
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} {...rest}/>
    </div>
  );
}