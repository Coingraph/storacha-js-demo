import { create } from '@storacha/client'
import { filesFromPaths } from 'files-from-path'  // لقراءة الملفات من الـ filesystem في Node.js

async function main() {
  // 1. Initialize the client
  const client = await create()
  console.log('Client initialized!')

  // 2. Login with email (سيرسل لينك تأكيد للإيميل)
  const account = await client.login('walletverse.eth@gmail.com')
  console.log('Logged in successfully! Waiting for payment plan...')
  await account.plan.wait()  // انتظر خطة الدفع (إذا لزم الأمر)
  console.log('Payment plan ready!')

  // 3. Create a test file (مثال بسيط: نص في ملف)
  const fs = await import('fs/promises')  // Node.js fs module
  const testContent = 'Hello from Storacha JS Integration Pro Quest! 🚀'
  await fs.writeFile('test-file.txt', testContent)
  console.log('Test file created: test-file.txt')

  // 4. Upload using uploadDirectory() (مع مجلد افتراضي للحفاظ على الاسم)
  const files = await filesFromPaths(['test-file.txt'])  // قراءة الملف كـ File-like
  const directoryCid = await client.uploadDirectory(files)
  console.log('Upload successful!')

  // 5. Print CID and Gateway URL
  console.log('CID:', directoryCid.toString())
  console.log('Gateway URL:', `https://${directoryCid}.ipfs.storacha.link/`)
}

main().catch(console.error)
