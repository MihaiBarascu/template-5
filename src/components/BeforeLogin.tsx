import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem', marginTop: '1rem', textAlign: 'center' }}>
      {/* Logo + Text pe același rând */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '0.75rem',
      }}>
        {/* Logo icon */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '14px',
          letterSpacing: '-0.5px',
        }}>
          MW
        </div>
        {/* Text */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          margin: 0,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          MultiWebsite
        </h1>
      </div>
      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
        Panou de administrare
      </p>
    </div>
  )
}

export default BeforeLogin
