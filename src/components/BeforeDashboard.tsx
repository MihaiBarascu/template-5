import React from 'react'

export const BeforeDashboard: React.FC = () => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{
        marginBottom: '0.5rem',
        fontSize: '1.25rem',
        fontWeight: 600,
      }}>
        Bun venit în MultiWebsite!
      </h2>
      <p style={{ color: '#666', fontSize: '0.875rem' }}>
        Administrează conținutul site-ului tău de business din acest panou.
      </p>
    </div>
  )
}

export default BeforeDashboard
