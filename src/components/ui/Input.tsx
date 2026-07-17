import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export const Input: React.FC<InputProps> = ({ 
  className = "", 
  ...props 
}) => {
  return (
    <input 
      className={`valo-input w-full outline-none transition-all ${className}`}
      {...props}
    />
  );
};
