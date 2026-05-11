import { createCipheriv, randomBytes, scryptSync } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ENV_PATH = resolve(ROOT, '.env')
const ENC_PATH = resolve(ROOT, '.env.enc')

const KEY = process.env.ENV_DECRYPT_KEY || process.argv[2]
if (!KEY) {
  console.error('用法: node scripts/encrypt-env.js <你的加密密码>')
  console.error('或设置环境变量: ENV_DECRYPT_KEY=你的密码 node scripts/encrypt-env.js')
  process.exit(1)
}

const plaintext = readFileSync(ENV_PATH, 'utf-8')

// Generate random salt (32 bytes) and IV (16 bytes)
const salt = randomBytes(32)
const iv = randomBytes(16)

// Derive 256-bit key using scrypt
const derivedKey = scryptSync(KEY, salt, 32, { N: 2 ** 14, r: 8, p: 1 })

// Encrypt with AES-256-GCM
const cipher = createCipheriv('aes-256-gcm', derivedKey, iv)
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()])
const authTag = cipher.getAuthTag()

// Bundle: salt + iv + authTag + ciphertext (all Base64)
const bundle = {
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  authTag: authTag.toString('base64'),
  data: encrypted.toString('base64'),
}

writeFileSync(ENC_PATH, JSON.stringify(bundle, null, 2), 'utf-8')
console.log('✅ .env 已加密为 .env.enc')
console.log('   请将 ENV_DECRYPT_KEY 设置为 Vercel 环境变量')
