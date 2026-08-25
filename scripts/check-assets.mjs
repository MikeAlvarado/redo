import { execSync } from 'node:child_process'

let out = ''
try {
  out = execSync(`grep -rnE '(from|import|require\\(|url\\()[^\\n]*reference/' src`, {
    encoding: 'utf8',
  })
} catch (err) {
  if (err.status !== 1) throw err
}

if (out.trim()) {
  console.error('check:assets FAILED — src/ must never reference /reference/ material:')
  console.error(out.trim())
  process.exit(1)
}
console.log('check:assets — src/ is clean of /reference/ imports.')
