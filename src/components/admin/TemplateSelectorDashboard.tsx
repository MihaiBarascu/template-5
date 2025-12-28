'use client'

/**
 * Template Selector Dashboard Component
 * Shows available templates for empty tenants
 * Follows Payload CMS official patterns
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@payloadcms/ui'

interface Template {
  id: string
  name: string
  icon: string
  description: string
}

interface EmptyTenant {
  id: string
  name: string
  slug: string
  isEmpty: boolean
}

interface ApiResponse {
  templates: Template[]
  tenant: { id: string; name: string; isEmpty: boolean } | null
  emptyTenants: EmptyTenant[]
  isSuperAdmin: boolean
}

export function TemplateSelectorDashboard() {
  const { user } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<string>('')
  const [seedingTemplate, setSeedingTemplate] = useState<string | null>(null)
  const [seedProgress, setSeedProgress] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Mark as client-side after mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch data
  useEffect(() => {
    if (!isClient || !user) return

    async function fetchData() {
      try {
        const response = await fetch('/api/seed-tenant?fetchEmptyTenants=true', {
          credentials: 'include'
        })
        const data = await response.json()
        setApiData(data)

        // Auto-select first empty tenant if available
        if (data.emptyTenants?.length > 0) {
          setSelectedTenant(data.emptyTenants[0].id)
        }
      } catch (err) {
        setError('Eroare la incarcarea datelor')
        console.error('[TemplateSelectorDashboard] Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [isClient, user])

  // Handle template selection and seeding
  const handleSelectTemplate = useCallback(async (templateId: string) => {
    if (!selectedTenant) {
      setError('Selecteaza un tenant inainte de a alege un template')
      return
    }

    setSeedingTemplate(templateId)
    setSeedProgress('Initializare...')
    setError(null)

    try {
      const response = await fetch('/api/seed-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tenantId: selectedTenant,
          seedType: templateId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Eroare la populare')
      }

      setSeedProgress('Finalizat cu succes!')

      // Refresh data after successful seed
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscuta')
      setSeedingTemplate(null)
      setSeedProgress('')
    }
  }, [selectedTenant])

  // Don't render anything until we're on client
  if (!isClient) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        padding: '24px',
        margin: '24px 0',
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        Se incarca...
      </div>
    )
  }

  // No data or no templates
  if (!apiData || !apiData.templates?.length) {
    return null
  }

  // Check if there are empty tenants or current tenant is empty
  const hasEmptyTenants = apiData.emptyTenants?.length > 0
  const currentTenantEmpty = apiData.tenant?.isEmpty

  // Don't show if no empty tenants and current tenant is not empty
  if (!hasEmptyTenants && !currentTenantEmpty) {
    return null
  }

  const selectedTenantData = apiData.emptyTenants?.find(t => t.id === selectedTenant)

  return (
    <div style={{
      padding: '24px',
      margin: '24px 0',
      backgroundColor: 'var(--theme-elevation-50)',
      borderRadius: '8px',
      border: '1px solid var(--theme-elevation-150)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          color: 'var(--theme-text)'
        }}>
          Selecteaza Template pentru Website
        </h3>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: 'var(--theme-elevation-800)'
        }}>
          Alege un template pentru a popula website-ul cu continut demonstrativ
        </p>
      </div>

      {/* Tenant Selector (for super admin) */}
      {apiData.isSuperAdmin && hasEmptyTenants && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--theme-text)'
          }}>
            Tenant de populat:
          </label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            disabled={!!seedingTemplate}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '10px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-150)',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              cursor: seedingTemplate ? 'not-allowed' : 'pointer'
            }}
          >
            {apiData.emptyTenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} ({tenant.slug})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Seeding progress */}
      {seedingTemplate && (
        <div style={{
          padding: '16px',
          marginBottom: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#1565c0',
            marginBottom: '8px'
          }}>
            Se populeaza template-ul...
          </div>
          <div style={{
            fontSize: '13px',
            color: '#1976d2'
          }}>
            {seedProgress}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {apiData.templates.map(template => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            disabled={!!seedingTemplate}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 16px',
              backgroundColor: seedingTemplate === template.id
                ? '#e3f2fd'
                : 'var(--theme-elevation-0)',
              border: seedingTemplate === template.id
                ? '2px solid #1976d2'
                : '1px solid var(--theme-elevation-150)',
              borderRadius: '8px',
              cursor: seedingTemplate ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: seedingTemplate && seedingTemplate !== template.id ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!seedingTemplate) {
                e.currentTarget.style.borderColor = '#1976d2'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!seedingTemplate) {
                e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <span style={{ fontSize: '32px', marginBottom: '12px' }}>
              {template.icon}
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--theme-text)',
              marginBottom: '4px',
              textAlign: 'center'
            }}>
              {template.name}
            </span>
            <span style={{
              fontSize: '12px',
              color: 'var(--theme-elevation-800)',
              textAlign: 'center'
            }}>
              {template.description}
            </span>
          </button>
        ))}
      </div>

      {/* Selected tenant info */}
      {selectedTenantData && (
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          backgroundColor: 'var(--theme-elevation-100)',
          borderRadius: '4px',
          fontSize: '13px',
          color: 'var(--theme-elevation-800)'
        }}>
          Template-ul va fi aplicat pe: <strong>{selectedTenantData.name}</strong>
        </div>
      )}
    </div>
  )
}

export default TemplateSelectorDashboard
