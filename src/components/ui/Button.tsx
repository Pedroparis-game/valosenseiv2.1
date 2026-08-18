import React from "react";
import { Loader2 } from "lucide-react";
import MagneticWrapper from "./MagneticWrapper";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'tab-active' | 'tab-inactive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading = false, 
  icon,
  variant = 'primary',
  size = 'md',
  className = "", 
  ...props 
}) => {
  const baseStyles = "relative font-display uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer clip-chamfer-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent-primary text-hud-base border border-transparent hover:bg-accent-primary/90 hover:shadow-[0_0_20px_rgba(255,70,85,0.4)]",
    secondary: "bg-hud-surface text-text-main border border-hud-border hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_15px_rgba(255,70,85,0.2)]",
    ghost: "bg-transparent text-text-muted hover:text-text-main border border-transparent hover:bg-hud-surface",
    'tab-active': "bg-accent-primary/10 text-accent-primary border border-accent-primary shadow-[0_0_15px_rgba(255,70,85,0.15)]",
    'tab-inactive': "bg-hud-surface text-text-muted border border-hud-border hover:text-text-main hover:border-text-muted"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  
  const btn = (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} active:scale-95 group overflow-hidden ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-[shine_0.6s_ease-in-out]" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="animate-spin" size={18} /> : icon}
        <span>{children}</span>
      </span>
    </button>
  );

  if (variant === 'primary') {
    return <MagneticWrapper>{btn}</MagneticWrapper>;
  }

  return btn;

};
