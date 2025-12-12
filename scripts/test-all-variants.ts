#!/usr/bin/env tsx
/**
 * Script pentru listarea configurarilor seeder disponibile
 *
 * Utilizare:
 *   tsx scripts/test-all-variants.ts                    # Listeaza toate configurarile
 *   tsx scripts/test-all-variants.ts --list             # Listeaza toate configurarile
 *   tsx scripts/test-all-variants.ts --info frizerie    # Info despre configurarea frizerie
 *   tsx scripts/test-all-variants.ts --commands         # Genereaza comenzile de seed
 *
 * NOTA: Sistemul vechi de DESIGN_VARIANT a fost eliminat.
 *       Configuratiile sunt acum definite direct in seeder-config.ts
 *       Pentru a schimba configuratia, editeaza src/seed/seeder-config.ts
 */

import { seederConfigs, getAvailableBusinessTypes, type SeederConfig } from '../src/seed/seeder-config'

// Mapare: business type -> seed command name
const SEED_COMMAND_MAP: Record<string, string> = {
  barbershop: 'frizerie',
  dentist: 'dentist',
  restaurant: 'restaurant',
  'auto-service': 'auto-service',
  salon: 'salon',
  avocat: 'avocat',
  constructii: 'constructii',
  magazin: 'magazin',
  fitness: 'fitness',
}

function listAllConfigs() {
  console.log('\n' + '='.repeat(70))
  console.log('📋 CONFIGURARI SEEDER DISPONIBILE')
  console.log('='.repeat(70))

  const businessTypes = getAvailableBusinessTypes()

  for (const businessType of businessTypes) {
    const config = seederConfigs[businessType]
    const seedCommand = SEED_COMMAND_MAP[businessType] || businessType

    console.log(`\n🏢 ${seedCommand.toUpperCase()} (${businessType})`)
    console.log('-'.repeat(50))
    console.log(`  📝 ${config.name}`)
    console.log(`     ${config.description}`)
    console.log(`  🎨 Theme: ${config.theme.variant}`)
    console.log(`     Font: ${config.theme.headingFont}/${config.theme.bodyFont}`)
    console.log(`     Style: radius=${config.theme.borderRadius}, shadows=${config.theme.shadows}`)
    console.log(`  🖼️ Hero: ${config.hero.type} (overlay: ${config.hero.overlay}, align: ${config.hero.alignment})`)
  }

  console.log('\n' + '='.repeat(70))
  console.log(`📊 TOTAL: ${businessTypes.length} tipuri de business`)
  console.log('='.repeat(70))

  console.log('\n📌 Cum sa rulezi un seed:')
  console.log('   pnpm seed:frizerie')
  console.log('   pnpm seed:dentist')
  console.log('   pnpm seed:restaurant')
  console.log('   etc.')
  console.log('')
  console.log('💡 Pentru a modifica configuratia, editeaza: src/seed/seeder-config.ts')
  console.log('')
}

function showBusinessInfo(seedName: string) {
  // Find business type from seed command name
  const businessType = Object.entries(SEED_COMMAND_MAP).find(([_, cmd]) => cmd === seedName)?.[0] || seedName

  const config = seederConfigs[businessType]
  if (!config) {
    console.error(`❌ Tip business invalid: ${seedName}`)
    console.error(`   Tipuri valide: ${Object.values(SEED_COMMAND_MAP).join(', ')}`)
    process.exit(1)
  }

  console.log('\n' + '='.repeat(70))
  console.log(`📋 CONFIGURATIE PENTRU: ${seedName.toUpperCase()}`)
  console.log('='.repeat(70))

  console.log(`\n📝 ${config.name}`)
  console.log('-'.repeat(40))
  console.log(`  Descriere: ${config.description}`)
  console.log(`\n🎨 Tema:`)
  console.log(`   - Varianta: ${config.theme.variant}`)
  console.log(`   - Heading Font: ${config.theme.headingFont}`)
  console.log(`   - Body Font: ${config.theme.bodyFont}`)
  console.log(`   - Border Radius: ${config.theme.borderRadius}`)
  console.log(`   - Shadows: ${config.theme.shadows}`)
  console.log(`\n🖼️ Hero:`)
  console.log(`   - Type: ${config.hero.type}`)
  console.log(`   - Overlay: ${config.hero.overlay}`)
  console.log(`   - Alignment: ${config.hero.alignment}`)
  console.log(`\n📐 Layout:`)
  console.log(`   - Services: ${config.layout.servicesVariant}`)
  console.log(`   - Team: ${config.layout.teamVariant}`)
  console.log(`   - Testimonials: ${config.layout.testimonialsVariant}`)
  console.log(`   - Gallery: ${config.layout.galleryVariant}`)
  console.log(`   - Pricing: ${config.layout.pricingVariant}`)
  console.log(`\n📋 Sectiuni Homepage:`)
  console.log(`   ${config.layout.sections.join(' → ')}`)

  console.log('\n' + '='.repeat(70))
  console.log(`📌 Ruleaza cu: pnpm seed:${seedName}`)
  console.log(`💡 Modifica configuratia in: src/seed/seeder-config.ts`)
  console.log('='.repeat(70) + '\n')
}

function generateSeedCommands() {
  console.log('\n' + '='.repeat(70))
  console.log('📋 COMENZI PENTRU TOATE SEEDURILE')
  console.log('='.repeat(70))

  const businessTypes = getAvailableBusinessTypes()

  for (const businessType of businessTypes) {
    const config = seederConfigs[businessType]
    const seedCommand = SEED_COMMAND_MAP[businessType] || businessType
    console.log(`pnpm seed:${seedCommand}  # ${config.name}`)
  }

  console.log('\n' + '='.repeat(70))
}

function generateMarkdownTable() {
  console.log('\n## Configurari Seeder Disponibile\n')
  console.log('| Seed Command | Nume | Theme | Hero | Sectiuni |')
  console.log('|--------------|------|-------|------|----------|')

  const businessTypes = getAvailableBusinessTypes()

  for (const businessType of businessTypes) {
    const config = seederConfigs[businessType]
    const seedCommand = SEED_COMMAND_MAP[businessType] || businessType
    console.log(
      `| ${seedCommand} | ${config.name} | ${config.theme.variant} | ${config.hero.type} | ${config.layout.sections.length} |`,
    )
  }
}

// CLI handling
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === '--list') {
  listAllConfigs()
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
  --list              Listeaza toate configurarile (default)
  --info <business>   Afiseaza detalii pentru un tip de business
  --commands          Genereaza toate comenzile de seed
  --markdown          Genereaza tabel markdown
  --help              Afiseaza acest ajutor

Tipuri de business disponibile:
  ${Object.values(SEED_COMMAND_MAP).join(', ')}

Exemple:
  tsx scripts/test-all-variants.ts --list
  tsx scripts/test-all-variants.ts --info frizerie
  tsx scripts/test-all-variants.ts --commands

NOTA: Configuratiile sunt acum definite in src/seed/seeder-config.ts
      Sistemul vechi DESIGN_VARIANT a fost eliminat.
  `)
} else {
  console.error('❌ Optiune necunoscuta. Foloseste --help pentru ajutor.')
  process.exit(1)
}
