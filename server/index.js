import express from 'express'
import cors from 'cors'
import { AccessToken } from 'livekit-server-sdk'
import dotenv from 'dotenv'
import path, { dirname } from 'path'
import process from 'node:process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
app.use(cors())
app.use(express.json())

const API_KEY = process.env.LIVEKIT_API_KEY
const API_SECRET = process.env.LIVEKIT_API_SECRET
const LIVEKIT_URL = process.env.LIVEKIT_URL

app.get('/api/connection-details', (req, res) => {
  try {
    const { roomName, participantName, region } = req.query

    if (!roomName || !participantName) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Create access token
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: `${participantName}_${Math.random().toString(36).substr(2, 4)}`,
      name: participantName,
    })

    at.ttl = '5m'
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    })

    const data = {
      serverUrl: LIVEKIT_URL,
      roomName: roomName,
      participantToken: at.toJwt(),
      participantName: participantName,
    }

    res.json(data)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
})
console.log(process.env.PORT)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
