import React from 'react'

interface StatusBadgeProps {
  type: 'source' | 'dev' | 'missing' | 'info' | 'build';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  return (
    <span className={`status-badge badge-${type}`} data-typography-role="compact-label">
      {label}
    </span>
  )
}
