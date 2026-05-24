import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline';
  className?: string;
  children: React.ReactNode;
}

const Button = ({ variant = 'filled', className = '', children, ...props }: ButtonProps) => {
  const baseStyles = "px-6 py-2.5 rounded-full text-[13px] font-semibold tracking-wider transition-all duration-300 active:scale-95";
  
  const variants = {
    filled: "bg-ink text-cream border border-ink hover:bg-zinc-800",
    outline: "bg-transparent text-ink border border-ink/25 hover:bg-ink hover:text-cream hover:border-ink"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;