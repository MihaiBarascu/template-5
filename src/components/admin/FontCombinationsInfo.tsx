'use client'

import React from 'react'

const FontCombinationsInfo: React.FC = () => {
  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: '4px',
        marginTop: '8px',
        fontSize: '13px',
        lineHeight: '1.5',
      }}
    >
      <strong style={{ display: 'block', marginBottom: '8px' }}>
        Combinatii recomandate:
      </strong>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        <li>
          <strong>Elegant/Luxos:</strong> Playfair Display + Inter (salon, restaurant, avocat)
        </li>
        <li>
          <strong>Modern/Tech:</strong> Montserrat + Open Sans (fitness, auto-service)
        </li>
        <li>
          <strong>Minimalist:</strong> Work Sans + Inter (magazin, constructii)
        </li>
        <li>
          <strong>Profesional:</strong> Poppins + Source Sans 3 (dentist, avocat)
        </li>
        <li>
          <strong>Clasic/Traditional:</strong> Lora + Lato (restaurant, pensiune)
        </li>
        <li>
          <strong>Bold/Energic:</strong> Montserrat + Poppins (fitness, frizerie)
        </li>
      </ul>
    </div>
  )
}

export default FontCombinationsInfo
