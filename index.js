import * as Client from '@storacha/client'
import { filesFromPaths } from 'files-from-path'
import fs from 'fs'
import path from 'path'

const EMAIL = 'walletverse.eth@gmail.com'
const testDir = './test-upload'

if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir)
  fs.writeFileSync(path.join(testDir, 'hello.txt'), 'Hello Storacha from walletverse.eth!')
  fs.writeFileSync(path.join(testDir, 'world.txt'), 'Second file - upload works 100%!')
  console.log('تم إنشاء مجلد test-upload مع ملفين للاختبار')
}

async function main() {
  console.log('جاري بدء التشغيل...')
  const client = await Client.create()
  console.log('جاري تسجيل الدخول بـ walletverse.eth@gmail.com ...')
  await client.login(EMAIL)

  const spaces = await client.spaces()
  if (spaces.length === 0) {
    console.error('لا يوجد Space! أنشئ واحدة أولاً بـ w3 space create')
    process.exit(1)
  }

  await client.setCurrentSpace(spaces[0].did())
  console.log(`تم اختيار الـ Space: ${spaces[0].name || spaces[0].did()}`)

  const files = await filesFromPaths([testDir])
  console.log('جاري رفع المجلد...')
  const directoryCid = await client.uploadDirectory(files)

  const url = `https://${directoryCid}.ipfs.storacha.network`
  console.log('\nتم الرفع بنجاح!')
  console.log(`CID: ${directoryCid}`)
  console.log(`رابط المشاهدة: ${url}\n`)
}

main().catch(err => {
  console.error('فشل:', err.message || err)
  process.exit(1)
})
