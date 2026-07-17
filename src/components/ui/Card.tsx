import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  hover = true, 
  className = "", 
  ...props 
}) => {
  return (
    <div 
      className={`valo-card ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
