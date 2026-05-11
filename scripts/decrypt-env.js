import { createDecipheriv, scryptSync } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ENV_PATH = resolve(ROOT, '.env')
const ENC_PATH = resolve(ROOT, '.env.enc')

const KEY = process.env.ENV_DECRYPT_KEY
if (!KEY) {
  console.error('❌ 未设置 ENV_DECRYPT_KEY 环境变量')
  console.error('   请在 Vercel Dashboard → Settings → Environment Variables 中添加')
  process.exit(1)
}

const raw = readFileSync(ENC_PATH, 'utf-8')
const bundle = JSON.parse(raw)

const salt = Buffer.from(bundle.salt, 'base64')
const iv = Buffer.from(bundle.iv, 'base64')
const authTag = Buffer.from(bundle.authTag, 'base64')
const encrypted = Buffer.from(bundle.data, 'base64')

// Re-derive key using same scrypt params
const derivedKey = scryptSync(KEY, salt, 32, { N: 2 ** 14, r: 8, p: 1 })

const decipher = createDecipheriv('aes-256-gcm', derivedKey, iv)
decipher.setAuthTag(authTag)

const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
writeFileSync(ENV_PATH, decrypted.toString('utf-8'), 'utf-8')

console.log('✅ .env 解密完成')
