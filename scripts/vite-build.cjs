const { webcrypto } = require('node:crypto')

if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto = webcrypto
}

const { build } = require('vite')

build().catch((error) => {
  console.error(error)
  process.exit(1)
})
