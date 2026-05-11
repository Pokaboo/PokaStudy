import { createClient } from '@supabase/supabase-js'

// ===== 使用前请替换为你的 service_role key =====
// 从 Supabase 控制台 → Settings → API → service_role 获取
const SERVICE_ROLE_KEY = 'your-service-role-key'

const supabaseUrl = 'https://kwbxuikugctasxrtnnhi.supabase.co'
const supabase = createClient(supabaseUrl, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'pokaboo@163.com',
    password: 'Pokaboo2026!',
    email_confirm: true,
    user_metadata: { display_name: 'Pokaboo' },
  })

  if (error) {
    console.error('创建失败:', error.message)
  } else {
    console.log('✅ 用户创建成功!')
    console.log('  ID:', data.user?.id)
    console.log('  Email:', data.user?.email)
    console.log('  Display Name:', data.user?.user_metadata?.display_name)
  }
}

createUser()
