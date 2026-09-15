import process from 'node:process'
import startServer from './server.js'
import connectToDatabase from './db.js'

process.loadEnvFile()

const PORT = process.env.PORT ?? 4000
const MONGODB_URI = process.env.MONGODB_URI

const run = async () => {
  await connectToDatabase(MONGODB_URI)
  startServer(PORT)
}

run()
