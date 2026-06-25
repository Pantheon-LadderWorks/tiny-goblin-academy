import React from 'react'

interface StatusBadgeProps {
  type: 'source' | 'dev' | 'missing';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  return (
    <span className={`status-badge badge-${type}`}>
      {label}
    </span>
  )
}
