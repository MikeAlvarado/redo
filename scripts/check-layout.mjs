import { execSync } from 'node:child_process'

const pattern = String.raw`\b(grid-cols|grid-rows|grid-flow|col-span|row-span|col-start|row-start|display:\s*grid)\b|className=("|{\x60)[^"\x60]*\bgrid\b`

let out = ''
try {
  out = execSync(
    `grep -rnE '${pattern}' src --include='*.tsx' --include='*.ts' --include='*.css'`,
    {
      encoding: 'utf8',
    },
  )
} catch (err) {
  if (err.status !== 1) throw err
}

if (out.trim()) {
  console.log(
    'grid usage found (every line must be justified in CLAUDE.md ## Layout exceptions):',
  )
  console.log(out.trim())
} else {
  console.log('check:layout — no grid usage in src/. Flexbox-first holds.')
}
