'use client'

import React from 'react'

/**
 * Custom Admin Logo Component
 * Replaces the default Payload CMS logo in the admin panel
 *
 * This makes the admin panel white-label by removing Payload branding
 */
export const Logo: React.FC = () => {
  // Return null on login page - BeforeLogin handles the logo there
  // This component is used in admin sidebar after login
  return null
}

export default Logo
