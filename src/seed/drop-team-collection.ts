/**
 * Drop team collection to test index creation
 */

import dotenv from 'dotenv'
import path from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function dropTeam() {
  const uri = process.env.DATABASE_URI
  if (!uri) throw new Error('DATABASE_URI not found')

  const client = new MongoClient(uri)
  try {
    await client.connect()
    await client.db().collection('team').drop()
    console.log('Team collection dropped')
  } catch (e) {
    console.log('Team collection does not exist or already dropped')
  } finally {
    await client.close()
  }
}

dropTeam()
