import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading = false, 
  icon,
  className = "", 
  ...props 
}) => {
  return (
    <button 
      className={`valo-btn flex items-center justify-center gap-3 active:scale-95 transition-all ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : icon}
      <span>{children}</span>
    </button>
  );
};
