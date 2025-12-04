'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

/**
 * VariantInfoField - Afiseaza informatii despre varianta selectata
 *
 * Componentă custom pentru Payload Admin care afișează:
 * - Numele variantei
 * - Descrierea
 * - Culorile principale (preview vizual)
 */
export const VariantInfoField: React.FC = () => {
  const businessType = useFormFields(([fields]) => fields.businessType?.value as string)
  const variantIndex = useFormFields(([fields]) => fields.variantIndex?.value as string)

  // Variant info lookup - mirrors design-variants.ts
  const variantInfo: Record<string, Array<{ name: string; description: string; colors: { primary: string; secondary: string; accent: string } }>> = {
    barbershop: [
      { name: 'Classic Dark & Gold', description: 'Design clasic pentru barbershop cu negru si auriu - elegant si masculin', colors: { primary: '#1a1a1a', secondary: '#c9a227', accent: '#d4af37' } },
      { name: 'Modern Red & White', description: 'Design modern cu rosu barber pole si alb - energic si fresh', colors: { primary: '#dc2626', secondary: '#1e3a5f', accent: '#ef4444' } },
      { name: 'Vintage Brown & Cream', description: 'Design vintage cu maro si crem - clasic si traditional', colors: { primary: '#8b4513', secondary: '#d4a574', accent: '#cd853f' } },
      { name: 'Minimal Black & White', description: 'Design minimalist alb-negru - clean si profesional', colors: { primary: '#000000', secondary: '#404040', accent: '#171717' } },
      { name: 'Urban Green & Dark', description: 'Design urban cu verde si inchis - modern si cool', colors: { primary: '#059669', secondary: '#1f2937', accent: '#10b981' } },
    ],
    dentist: [
      { name: 'Clean Blue & White', description: 'Design medical clasic cu albastru si alb - profesional si de incredere', colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' } },
      { name: 'Teal & Mint Fresh', description: 'Design fresh cu teal si mint - modern si relaxant', colors: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' } },
      { name: 'Purple Premium', description: 'Design premium cu violet - luxos si sofisticat', colors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa' } },
      { name: 'Green Nature', description: 'Design natural cu verde - ecologic si sanatos', colors: { primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80' } },
      { name: 'Minimal Gray', description: 'Design minimalist cu gri - profesional si serios', colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#9ca3af' } },
    ],
    restaurant: [
      { name: 'Warm Orange & Brown', description: 'Design cald cu portocaliu si maro - primitor si apetisant', colors: { primary: '#ea580c', secondary: '#9a3412', accent: '#fb923c' } },
      { name: 'Elegant Dark & Gold', description: 'Design elegant cu inchis si auriu - fine dining si lux', colors: { primary: '#1c1917', secondary: '#d4af37', accent: '#fbbf24' } },
      { name: 'Fresh Green & White', description: 'Design fresh cu verde si alb - organic si sanatos', colors: { primary: '#65a30d', secondary: '#4d7c0f', accent: '#84cc16' } },
      { name: 'Red Italian', description: 'Design italian cu rosu si crem - traditional si pasional', colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#f87171' } },
      { name: 'Modern Blue Cafe', description: 'Design modern cu albastru - cafenea trendy si cool', colors: { primary: '#2563eb', secondary: '#1d4ed8', accent: '#3b82f6' } },
    ],
    magazin: [
      { name: 'Green Eco & Natural', description: 'Design natural cu verde si alb - organic si eco-friendly', colors: { primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' } },
      { name: 'Orange Vibrant', description: 'Design vibrant cu portocaliu - energic si prietenos', colors: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' } },
      { name: 'Purple Premium', description: 'Design premium cu violet - luxos si sofisticat', colors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa' } },
      { name: 'Blue Trust', description: 'Design de incredere cu albastru - profesional si sigur', colors: { primary: '#2563eb', secondary: '#1d4ed8', accent: '#3b82f6' } },
      { name: 'Minimal Black & White', description: 'Design minimalist alb-negru - clean si elegant', colors: { primary: '#18181b', secondary: '#27272a', accent: '#3f3f46' } },
    ],
    salon: [
      { name: 'Pink & Rose Gold', description: 'Design feminin cu roz si rose gold - glamour si elegant', colors: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' } },
      { name: 'Purple Luxury', description: 'Design luxos cu violet - sofisticat si premium', colors: { primary: '#9333ea', secondary: '#7e22ce', accent: '#a855f7' } },
      { name: 'Nude & Beige Natural', description: 'Design natural cu nude si bej - calm si relaxant', colors: { primary: '#a8a29e', secondary: '#78716c', accent: '#d6d3d1' } },
      { name: 'Teal & Gold Spa', description: 'Design spa cu teal si auriu - relaxant si luxos', colors: { primary: '#0d9488', secondary: '#d4af37', accent: '#14b8a6' } },
      { name: 'Black & White Chic', description: 'Design chic cu negru si alb - modern si stylish', colors: { primary: '#18181b', secondary: '#27272a', accent: '#3f3f46' } },
    ],
    'auto-service': [
      { name: 'Classic Red & Dark', description: 'Design clasic cu rosu si inchis - puternic si de incredere', colors: { primary: '#dc2626', secondary: '#1f2937', accent: '#ef4444' } },
      { name: 'Orange Industrial', description: 'Design industrial cu portocaliu - energic si profesional', colors: { primary: '#f97316', secondary: '#374151', accent: '#fb923c' } },
      { name: 'Blue Professional', description: 'Design profesional cu albastru - serios si competent', colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' } },
      { name: 'Yellow & Black Speed', description: 'Design speed cu galben si negru - rapid si eficient', colors: { primary: '#eab308', secondary: '#18181b', accent: '#facc15' } },
      { name: 'Green Eco', description: 'Design eco cu verde - pentru service-uri eco-friendly', colors: { primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' } },
    ],
    avocat: [
      { name: 'Classic Navy & Gold', description: 'Design clasic cu bleumarin si auriu - autoritar si profesional', colors: { primary: '#1e3a5f', secondary: '#d4af37', accent: '#2563eb' } },
      { name: 'Modern Gray & Blue', description: 'Design modern cu gri si albastru - corporatist si serios', colors: { primary: '#3b82f6', secondary: '#64748b', accent: '#60a5fa' } },
      { name: 'Dark Green Professional', description: 'Design profesional cu verde inchis - de incredere si stabil', colors: { primary: '#166534', secondary: '#14532d', accent: '#22c55e' } },
      { name: 'Burgundy Premium', description: 'Design premium cu burgundy - luxos si sofisticat', colors: { primary: '#7f1d1d', secondary: '#991b1b', accent: '#b91c1c' } },
      { name: 'Minimal Black & White', description: 'Design minimalist alb-negru - direct si profesional', colors: { primary: '#171717', secondary: '#404040', accent: '#525252' } },
    ],
    constructii: [
      { name: 'Orange & Dark Industrial', description: 'Design industrial cu portocaliu si inchis - puternic si robust', colors: { primary: '#ea580c', secondary: '#1f2937', accent: '#f97316' } },
      { name: 'Yellow Safety', description: 'Design safety cu galben si negru - vizibil si profesional', colors: { primary: '#eab308', secondary: '#18181b', accent: '#facc15' } },
      { name: 'Blue Modern', description: 'Design modern cu albastru - profesional si de incredere', colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' } },
      { name: 'Green Eco Construction', description: 'Design eco cu verde - constructii sustenabile', colors: { primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' } },
      { name: 'Gray Minimal Professional', description: 'Design minimal cu gri - serios si competent', colors: { primary: '#4b5563', secondary: '#374151', accent: '#6b7280' } },
    ],
  }

  const variants = variantInfo[businessType || 'magazin'] || variantInfo.magazin
  const variant = variants[parseInt(variantIndex || '0', 10)] || variants[0]

  if (!variant) {
    return null
  }

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '16px',
        border: '1px solid #e9ecef',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: variant.colors.primary,
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
            title="Culoare primara"
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: variant.colors.secondary,
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
            title="Culoare secundara"
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: variant.colors.accent,
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
            title="Culoare accent"
          />
        </div>
        <div>
          <strong style={{ fontSize: '16px', color: '#212529' }}>{variant.name}</strong>
        </div>
      </div>
      <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }}>
        {variant.description}
      </p>
    </div>
  )
}

export default VariantInfoField
