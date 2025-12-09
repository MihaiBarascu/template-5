'use client'

import React from 'react'

/**
 * Custom Admin Icon Component
 * Used as the favicon/small icon in the admin panel navbar
 *
 * This replaces the Payload CMS icon for white-label purposes
 */
export const Icon: React.FC = () => {
  return (
    <div style={{
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 700,
      fontSize: '10px',
      letterSpacing: '-0.5px',
    }}>
      MW
    </div>
  )
}

export default Icon
