import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'neu-raised' | 'glow-submit' | 'neu-icon' | 'neu-icon-dark' | 'outline' | 'purple'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-pill-primary';
      case 'secondary':
        return 'btn-pill-secondary';
      case 'neu-raised':
        return 'btn-neu-raised';
      case 'glow-submit':
        return 'btn-glow-submit';
      case 'neu-icon':
        return 'btn-neu-icon';
      case 'neu-icon-dark':
        return 'btn-neu-icon-dark';
      case 'outline':
        return 'btn-pill-outline';
      case 'purple':
        return 'btn-pill-purple';
      default:
        return 'btn-pill-primary';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={18} />}
        </>
      )}
    </button>
  );
};

export default Button;

