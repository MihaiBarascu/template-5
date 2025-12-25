/**
 * Check MongoDB indexes and data on collections
 */

import dotenv from 'dotenv'
import path from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function checkIndexesAndData() {
  const uri = process.env.DATABASE_URI
  if (!uri) throw new Error('DATABASE_URI not found')

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db()

    // List ALL collections
    const allCollections = await db.listCollections().toArray()
    console.log('\n=== All MongoDB Collections ===')
    allCollections.forEach(c => console.log('  - ' + c.name))

    const collections = ['teams', 'team', 'pages', 'services', 'posts', 'products']
    for (const colName of collections) {
      try {
        const col = db.collection(colName)
        const indexes = await col.indexes()
        console.log('\n' + colName + ' indexes:')
        indexes.forEach(idx => {
          const keyStr = Object.entries(idx.key as object).map(([k, v]) => k + ':' + v).join(', ')
          console.log('  - ' + idx.name + ': {' + keyStr + '}' + (idx.unique ? ' (UNIQUE)' : ''))
        })

        // Check for existing documents
        const count = await col.countDocuments()
        console.log('  Total documents: ' + count)

        // List all documents with slugs
        if (count > 0 && count < 50) {
          const docs = await col.find({}, { projection: { slug: 1, name: 1, title: 1, tenant: 1 } }).limit(20).toArray()
          console.log('  Sample documents (slug, tenant):')
          docs.forEach(doc => {
            const name = doc.name || doc.title || doc.slug
            console.log('    - ' + name + ' | slug: ' + doc.slug + ' | tenant: ' + doc.tenant)
          })
        }
      } catch (e) {
        console.log('  ' + colName + ': collection does not exist')
      }
    }

    // Check tenants
    try {
      const tenantsCol = db.collection('tenants')
      const tenants = await tenantsCol.find({}, { projection: { slug: 1, name: 1 } }).toArray()
      console.log('\nTenants (' + tenants.length + ' total):')
      tenants.forEach(t => {
        console.log('  - ' + t.slug + ': ' + t.name + ' (' + t._id + ')')
      })
    } catch (e) {
      console.log('\nTenants: collection does not exist')
    }

    // Check teams with tenant info
    try {
      const teamsCol = db.collection('teams')
      const teams = await teamsCol.find({}).toArray()
      console.log('\nTeam members (' + teams.length + ' total):')
      teams.forEach(t => {
        console.log('  - ' + t.name + ' | slug: ' + t.slug + ' | tenant: ' + t.tenant)
      })
    } catch (e) {
      console.log('\nTeams: collection does not exist')
    }
  } finally {
    await client.close()
  }
}

checkIndexesAndData()
