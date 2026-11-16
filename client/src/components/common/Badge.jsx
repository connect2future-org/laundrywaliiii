import React from 'react';

export const Badge = ({ children, variant = 'pink', icon: Icon, className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
};

export default Badge;

