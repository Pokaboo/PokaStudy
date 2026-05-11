import { createDecipheriv, scryptSync } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ENV_PATH = resolve(ROOT, '.env')
const ENC_PATH = resolve(ROOT, '.env.enc')

const KEY = process.env.ENV_DECRYPT_KEY
if (!KEY) {
  if (process.env.VERCEL) {
    console.log('ℹ️  Vercel 环境中 ENV_DECRYPT_KEY 未设置，跳过解密')
    console.log('   请确保已在 Vercel Dashboard 中直接设置了以下环境变量：')
    console.log('   - VITE_SUPABASE_URL')
    console.log('   - VITE_SUPABASE_ANON_KEY')
  } else {
    console.log('ℹ️  ENV_DECRYPT_KEY 未设置，本地开发请使用 .env 文件')
  }
  process.exit(0)
}

if (!existsSync(ENC_PATH)) {
  console.error('❌ 未找到 .env.enc 文件')
  process.exit(1)
}

try {
  const raw = readFileSync(ENC_PATH, 'utf-8')
  const bundle = JSON.parse(raw)

  const salt = Buffer.from(bundle.salt, 'base64')
  const iv = Buffer.from(bundle.iv, 'base64')
  const authTag = Buffer.from(bundle.authTag, 'base64')
  const encrypted = Buffer.from(bundle.data, 'base64')

  const derivedKey = scryptSync(KEY, salt, 32, { N: 2 ** 14, r: 8, p: 1 })

  const decipher = createDecipheriv('aes-256-gcm', derivedKey, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  writeFileSync(ENV_PATH, decrypted.toString('utf-8'), 'utf-8')

  console.log('✅ .env 解密完成')
} catch (err) {
  console.error('❌ 解密失败，请检查 ENV_DECRYPT_KEY 是否正确:', err.message)
  process.exit(1)
}
