// scripts/hash-password.js
// Usage: node scripts/hash-password.js yourpassword
const bcrypt = require('bcryptjs')
const password = process.argv[2]
if (!password) { console.error('Usage: node scripts/hash-password.js <password>'); process.exit(1) }
bcrypt.hash(password, 12).then(hash => {
  console.log('\nADMIN_PASSWORD_HASH=' + hash)
  console.log('\nPaste this into your Vercel environment variables.')
})
