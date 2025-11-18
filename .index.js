import * as Client from '@storacha/client'
import { filesFromPaths } from 'files-from-path'
import fs from 'fs'
import path from 'path'

// الإيميل الذي استخدمته من قبل
const EMAIL = 'walletverse.eth@gmail.com'

// إنشاء مجلد اختبار مع ملفات داخلة
const testDir = './test-upload'
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir)
  fs.writeFileSync(path.join(testDir, 'hello.txt'), 'Hello Storacha from walletverse.eth!')
  fs.writeFileSync(path.join(testDir, 'demo.jpg'), 'This is a fake image just for demo') // ملف وهمي صغير
  console.log('تم إنشاء مجلد الاختبار مع ملفين')
}

async function main() {
  // 1. إنشاء العميل
  const client = await Client.create()

  // 2. تسجيل الدخول بالإيميل (سيرسل كود تحقق للإيميل)
  console.log('جاري تسجيل الدخول باستخدام walletverse.eth@gmail.com ...')
  await client.login(EMAIL)

  // 3. التأكد من وجود Space وتحديدها كـ current
  const spaces = await client.spaces()
  if (spaces.length === 0) {
    console.error('لا يوجد أي Space! قم بإنشائها أولاً من الـ CLI باستخدام w3 space create')
    process.exit(1)
  }

  const space = spaces[0]
  await client.setCurrentSpace(space.did())

  console.log(`تم اختيار الـ Space: ${space.name() || space.did()}`)

  // 4. تحويل المجلد إلى كائنات File
  const files = await filesFromPaths([testDir])

  // 5. رفع المجلد كاملاً باستخدام uploadDirectory
  console.log('جاري رفع المجلد...')
  const directoryCid = await client.uploadDirectory(files)

  // 6. طباعة الـ CID والرابط
  const gatewayUrl = `https://${directoryCid}.ipfs.storacha.network`

  console.log('تم الرفع بنجاح!')
  console.log(`CID: ${directoryCid}`)
  console.log(`Gateway URL: ${gatewayUrl}`)
  console.log(`يمكنك فتح الرابط التالي في المتصفح:`)
  console.log(gatewayUrl)
}

main().catch(err => {
  console.error('خطأ:', err)
  process.exit(1)
})
