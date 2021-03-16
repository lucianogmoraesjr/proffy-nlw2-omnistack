import { TextareaHTMLAttributes } from 'react'

import './styles.css';

interface TextareaProps extends  TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
};

export default function Textarea({ label, name, ...rest }: TextareaProps) {
  return (
    <div className="textarea-block">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} {...rest}/>
    </div>
  );
}