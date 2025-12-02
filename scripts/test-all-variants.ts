#!/usr/bin/env tsx
/**
 * Script pentru testarea tuturor variantelor de design
 *
 * Utilizare:
 *   tsx scripts/test-all-variants.ts                    # Listeaza toate variantele
 *   tsx scripts/test-all-variants.ts --list             # Listeaza toate variantele
 *   tsx scripts/test-all-variants.ts --seed frizerie 2  # Ruleaza seed pentru frizerie varianta 2
 *   tsx scripts/test-all-variants.ts --seed-all         # Ruleaza toate seedurile (resetare DB intre ele)
 *   tsx scripts/test-all-variants.ts --info dentist     # Info despre variantele dentist
 */

import { getAllVariants, getVariant, type BusinessType } from '../src/seed/design-variants'

// Mapare: nume display -> BusinessType din design-variants
const BUSINESS_MAP: Record<string, BusinessType> = {
  'frizerie': 'barbershop',
  'dentist': 'dentist',
  'restaurant': 'restaurant',
  'auto-service': 'auto-service',
  'salon': 'salon',
  'avocat': 'avocat',
  'constructii': 'constructii',
}

const SEED_COMMANDS = Object.keys(BUSINESS_MAP)

function listAllVariants() {
  console.log('\n' + '='.repeat(70))
  console.log('📋 TOATE VARIANTELE DE DESIGN DISPONIBILE')
  console.log('='.repeat(70))

  let totalCombinations = 0

  for (const seedName of SEED_COMMANDS) {
    const businessType = BUSINESS_MAP[seedName]
    const variants = getAllVariants(businessType)
    console.log(`\n🏢 ${seedName.toUpperCase()} (${variants.length} variante)`)
    console.log('-'.repeat(50))

    variants.forEach((variant, index) => {
      console.log(`  [${index}] ${variant.name}`)
      console.log(`      ${variant.description}`)
      console.log(`      Theme: ${variant.theme.preset} | Font: ${variant.theme.fontPreset}`)
      console.log(`      Style: ${variant.theme.stylePreset} | Hero: ${variant.hero.type}`)
    })

    totalCombinations += variants.length
  }

  console.log('\n' + '='.repeat(70))
  console.log(`📊 TOTAL: ${SEED_COMMANDS.length} tipuri de business × variante = ${totalCombinations} combinatii unice`)
  console.log('='.repeat(70))

  console.log('\n📌 Cum sa rulezi un seed cu o varianta specifica:')
  console.log('   DESIGN_VARIANT=0 pnpm seed:frizerie')
  console.log('   DESIGN_VARIANT=1 pnpm seed:dentist')
  console.log('   DESIGN_VARIANT=2 pnpm seed:restaurant')
  console.log('   etc.')
  console.log('')
}

function showBusinessInfo(seedName: string) {
  const businessType = BUSINESS_MAP[seedName]
  if (!businessType) {
    console.error(`❌ Tip business invalid: ${seedName}`)
    console.error(`   Tipuri valide: ${SEED_COMMANDS.join(', ')}`)
    process.exit(1)
  }

  const variants = getAllVariants(businessType)

  console.log('\n' + '='.repeat(70))
  console.log(`📋 VARIANTE PENTRU: ${seedName.toUpperCase()}`)
  console.log('='.repeat(70))

  variants.forEach((variant, index) => {
    console.log(`\n[Varianta ${index}] ${variant.name}`)
    console.log('-'.repeat(40))
    console.log(`  📝 Descriere: ${variant.description}`)
    console.log(`  🎨 Tema:`)
    console.log(`     - Preset: ${variant.theme.preset}`)
    console.log(`     - Culori: Primary ${variant.theme.colors.primary}, Secondary ${variant.theme.colors.secondary}`)
    console.log(`     - Font: ${variant.theme.fontPreset}`)
    console.log(`     - Stil: ${variant.theme.stylePreset}`)
    console.log(`     - Border Radius: ${variant.theme.borderRadius}`)
    console.log(`     - Shadows: ${variant.theme.shadows}`)
    console.log(`  🖼️ Hero: ${variant.hero.type}`)
    console.log(`  📐 Layout:`)
    console.log(`     - Services: ${variant.layout.servicesVariant}`)
    console.log(`     - Team: ${variant.layout.teamVariant}`)
    console.log(`     - Testimonials: ${variant.layout.testimonialsVariant}`)
    console.log(`     - Gallery: ${variant.layout.galleryVariant}`)
    console.log(`     - Sectiuni: ${variant.layout.sections.join(' → ')}`)
  })

  console.log('\n' + '='.repeat(70))
  console.log(`📌 Ruleaza cu: DESIGN_VARIANT=<0-${variants.length - 1}> pnpm seed:${seedName}`)
  console.log('='.repeat(70) + '\n')
}

function generateSeedCommands() {
  console.log('\n' + '='.repeat(70))
  console.log('📋 COMENZI PENTRU TOATE VARIANTELE')
  console.log('='.repeat(70))

  for (const seedName of SEED_COMMANDS) {
    const businessType = BUSINESS_MAP[seedName]
    const variants = getAllVariants(businessType)
    console.log(`\n# ${seedName.toUpperCase()}`)

    variants.forEach((variant, index) => {
      console.log(`DESIGN_VARIANT=${index} pnpm seed:${seedName}  # ${variant.name}`)
    })
  }

  console.log('\n' + '='.repeat(70))
}

function generateMarkdownTable() {
  console.log('\n## Variante Disponibile\n')
  console.log('| Business | Varianta | Nume | Tema | Stil |')
  console.log('|----------|----------|------|------|------|')

  for (const seedName of SEED_COMMANDS) {
    const businessType = BUSINESS_MAP[seedName]
    const variants = getAllVariants(businessType)
    variants.forEach((variant, index) => {
      console.log(`| ${seedName} | ${index} | ${variant.name} | ${variant.theme.preset} | ${variant.theme.stylePreset} |`)
    })
  }
}

// CLI handling
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === '--list') {
  listAllVariants()
} else if (args[0] === '--info' && args[1]) {
  showBusinessInfo(args[1])
} else if (args[0] === '--commands') {
  generateSeedCommands()
} else if (args[0] === '--markdown') {
  generateMarkdownTable()
} else if (args[0] === '--help') {
  console.log(`
Utilizare:
  tsx scripts/test-all-variants.ts [optiune]

Optiuni:
  --list              Listeaza toate variantele (default)
  --info <business>   Afiseaza detalii pentru un tip de business
  --commands          Genereaza toate comenzile de seed
  --markdown          Genereaza tabel markdown
  --help              Afiseaza acest ajutor

Tipuri de business disponibile:
  ${SEED_COMMANDS.join(', ')}

Exemple:
  tsx scripts/test-all-variants.ts --list
  tsx scripts/test-all-variants.ts --info frizerie
  tsx scripts/test-all-variants.ts --commands
  `)
} else {
  console.error('❌ Optiune necunoscuta. Foloseste --help pentru ajutor.')
  process.exit(1)
}
