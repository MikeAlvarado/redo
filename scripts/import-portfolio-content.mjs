import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const PORTFOLIO_DIR =
  process.env.PORTFOLIO_DIR ??
  process.argv[2] ??
  join(homedir(), 'Developer', 'personal', 'portfolio', 'portfolio')

const OUT_DATA = join(process.cwd(), 'src', 'data', 'projects.ts')
const OUT_ART = join(process.cwd(), 'public', 'projects')

const LOCALES = ['en', 'es']

// Carousel order. Everything else keeps `featured: false`.
const FEATURED = [
  'vitrina',
  'mediterra',
  'aiMeter',
  'koddaStudio',
  'apex',
  'tequilaKaos',
  'reactPractice',
]

// `React Practice` ships as `React Lab`; i18nKey, slug and image paths are unchanged.
const TITLE_OVERRIDES = {
  reactPractice: { en: 'React Lab', es: 'React Lab' },
}

const CATEGORY_OVERRIDES = {
  reactPractice: { en: 'Open Source', es: 'Código abierto' },
}

// Compressions of each project's own description; they add no claim the
// description does not already make.
const SUMMARIES = {
  vitrina: {
    en: 'An open-source React library for draggable, zoomable planes of objects.',
    es: 'Librería React de código abierto: planos de objetos arrastrables y con zoom.',
  },
  mediterra: {
    en: 'A bilingual editorial site for a preventive-medicine practice in Monterrey.',
    es: 'Sitio editorial bilingüe para un consultorio de medicina preventiva en Monterrey.',
  },
  aiMeter: {
    en: 'A native iOS and macOS app for tracking AI usage and limits.',
    es: 'App nativa de iOS y macOS para monitorear uso y límites de IA.',
  },
  koddaStudio: {
    en: 'The product I co-founded and led from CTO to CEO, on the App Store.',
    es: 'El producto que cofundé y dirigí de CTO a CEO, publicado en la App Store.',
  },
  apex: {
    en: 'A browser tool that plots and compares racing lines lap by lap.',
    es: 'Herramienta web que traza y compara líneas de carrera vuelta por vuelta.',
  },
  tequilaKaos: {
    en: 'Product and web consulting for a tequila brand, from strategy to launch.',
    es: 'Consultoría de producto y web para una marca de tequila, de estrategia a lanzamiento.',
  },
  reactPractice: {
    en: 'A working lab where I build and publish React patterns in the open.',
    es: 'Un laboratorio donde construyo y publico patrones de React en abierto.',
  },
  lightcycleArena: {
    en: 'A browser lightcycle game built for speed and tight controls.',
    es: 'Juego de lightcycles en el navegador, hecho para velocidad y control preciso.',
  },
  cloudFunctionsTs: {
    en: 'A typed Firebase Functions starter with the patterns I reach for.',
    es: 'Base tipada de Firebase Functions con los patrones que uso siempre.',
  },
  yCombinator: {
    en: "Kodda was accepted into Y Combinator's S21 batch.",
    es: 'Kodda fue aceptada en el batch S21 de Y Combinator.',
  },
  pmp: {
    en: 'Project Management Professional training, completed in 2025.',
    es: 'Formación Project Management Professional, completada en 2025.',
  },
}

// A repo link to a private repository 404s for every visitor. Verified against
// the GitHub REST API on 2026-08-27; `tequilakaos` is NOT public and is dropped.
const PUBLIC_REPOS = new Set([
  'https://github.com/MikeAlvarado/vitrina',
  'https://github.com/MikeAlvarado/AIMeter',
  'https://github.com/MikeAlvarado/getapex',
  'https://github.com/MikeAlvarado/lightcycle_arena',
  'https://github.com/MikeAlvarado/cloudfunctions-ts',
  'https://github.com/MikeAlvarado/react_practice',
])

const CONTENT_FIELDS = ['title', 'category', 'role', 'description', 'tags', 'imageAlt']

function fail(message) {
  console.error(`import-portfolio-content FAILED — ${message}`)
  process.exit(1)
}

function readMessages(locale) {
  const path = join(PORTFOLIO_DIR, 'messages', `${locale}.json`)
  if (!existsSync(path)) fail(`missing source file ${path}`)
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readProjectMeta() {
  const path = join(PORTFOLIO_DIR, 'components', 'sections', 'Projects.tsx')
  if (!existsSync(path)) fail(`missing source file ${path}`)
  const source = readFileSync(path, 'utf8')
  const start = source.search(/const PROJECT_META\s*:[^=]*=\s*\[/)
  if (start === -1) fail(`could not find PROJECT_META in ${path}`)
  const open = source.indexOf('[', source.indexOf('=', start))
  let depth = 0
  let end = -1
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '[') depth += 1
    else if (source[i] === ']') {
      depth -= 1
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  if (end === -1) fail('PROJECT_META array is unbalanced')
  const literal = source
    .slice(open, end + 1)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/'/g, '"')
    .replace(/,(\s*[\]}])/g, '$1')
  try {
    return JSON.parse(literal)
  } catch (error) {
    fail(`could not parse PROJECT_META: ${error.message}`)
  }
}

function checkParity(messages, meta) {
  const buckets = LOCALES.map((locale) => {
    const bucket = messages[locale]?.ProjectsPage?.projects
    if (!bucket) fail(`${locale}.json has no ProjectsPage.projects`)
    return [locale, bucket]
  })
  const problems = []
  const keys = new Set(buckets.flatMap(([, bucket]) => Object.keys(bucket)))

  for (const key of keys) {
    for (const [locale, bucket] of buckets) {
      if (!bucket[key]) {
        problems.push(`projects.${key} is missing from ${locale}.json`)
        continue
      }
      for (const field of CONTENT_FIELDS) {
        if (bucket[key][field] === undefined) {
          problems.push(`projects.${key}.${field} is missing from ${locale}.json`)
        }
      }
    }
    const [en, es] = buckets.map(([, bucket]) => bucket[key])
    if (en?.tags && es?.tags && en.tags.length !== es.tags.length) {
      problems.push(
        `projects.${key}.tags has ${en.tags.length} entries in en.json and ${es.tags.length} in es.json`,
      )
    }
  }

  for (const entry of meta) {
    if (!keys.has(entry.i18nKey)) {
      problems.push(`PROJECT_META references projects.${entry.i18nKey}, absent from both locales`)
    }
    if (!SUMMARIES[entry.i18nKey]) {
      problems.push(`no summary written for projects.${entry.i18nKey}`)
    }
  }
  for (const key of FEATURED) {
    if (!meta.some((entry) => entry.i18nKey === key)) {
      problems.push(`featured order names ${key}, which PROJECT_META does not define`)
    }
  }

  if (problems.length > 0) {
    console.error('import-portfolio-content FAILED — locale parity check:')
    for (const problem of problems) console.error(`  · ${problem}`)
    process.exit(1)
  }
}

function slugify(i18nKey) {
  return i18nKey.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

async function convertImage(sourcePath) {
  const name = `${basename(sourcePath, extname(sourcePath))}.webp`
  const target = join(OUT_ART, name)
  const image = sharp(sourcePath)
  const { width, height } = await image.metadata()
  await image.webp({ quality: 82, effort: 5 }).toFile(target)
  return { src: `/projects/${name}`, width, height }
}

function ts(value) {
  return JSON.stringify(value)
}

function localized(pair) {
  return `{ en: ${ts(pair.en)}, es: ${ts(pair.es)} }`
}

function renderImage(image) {
  return `{ src: ${ts(image.src)}, width: ${image.width}, height: ${image.height} }`
}

function renderProject(project) {
  const lines = [
    '  {',
    `    id: ${ts(project.id)},`,
    `    slug: ${ts(project.slug)},`,
    `    title: ${localized(project.title)},`,
    `    summary: ${localized(project.summary)},`,
    `    description: ${localized(project.description)},`,
    `    category: ${localized(project.category)},`,
    '    categories: [',
    ...project.categories.map((category) => `      ${localized(category)},`),
    '    ],',
    `    year: ${project.year},`,
    `    role: ${localized(project.role)},`,
    `    cover: ${renderImage(project.cover)},`,
    `    coverAlt: ${localized(project.coverAlt)},`,
    '    gallery: [',
    ...project.gallery.map((image) => `      ${renderImage(image)},`),
    '    ],',
  ]
  const links = Object.entries(project.links).filter(([, href]) => Boolean(href))
  if (links.length > 0) {
    lines.push(`    links: { ${links.map(([key, href]) => `${key}: ${ts(href)}`).join(', ')} },`)
  }
  lines.push(`    featured: ${project.featured},`, '  },')
  return lines.join('\n')
}

function render(projects) {
  return `import type { Locale, LocalizedString } from '../i18n/types'

export type { Locale, LocalizedString }

export interface ProjectImage {
  src: string
  width: number
  height: number
}

export interface Project {
  id: string
  slug: string
  title: LocalizedString
  summary: LocalizedString
  description: LocalizedString
  category: LocalizedString
  categories: LocalizedString[]
  year: number
  client?: string
  role: LocalizedString
  cover: ProjectImage
  coverAlt: LocalizedString
  gallery: ProjectImage[]
  links?: { live?: string; repo?: string; caseStudy?: string }
  featured: boolean
}

// Generated by scripts/import-portfolio-content.mjs — edit that script, not this file.
export const projects: Project[] = [
${projects.map(renderProject).join('\n')}
]
`
}

async function main() {
  const messages = Object.fromEntries(
    LOCALES.map((locale) => [locale, readMessages(locale)]),
  )
  const meta = readProjectMeta()
  checkParity(messages, meta)

  mkdirSync(OUT_ART, { recursive: true })
  for (const file of readdirSync(OUT_ART)) unlinkSync(join(OUT_ART, file))

  const converted = new Map()
  const convert = async (webPath) => {
    if (converted.has(webPath)) return converted.get(webPath)
    const source = join(PORTFOLIO_DIR, 'public', webPath.replace(/^\//, ''))
    if (!existsSync(source)) fail(`missing image ${source}`)
    const image = await convertImage(source)
    converted.set(webPath, image)
    return image
  }

  const ordered = [
    ...FEATURED.map((key) => meta.find((entry) => entry.i18nKey === key)),
    ...meta.filter((entry) => !FEATURED.includes(entry.i18nKey)),
  ]

  const projects = []
  for (const entry of ordered) {
    const key = entry.i18nKey
    const content = Object.fromEntries(
      LOCALES.map((locale) => [locale, messages[locale].ProjectsPage.projects[key]]),
    )
    const pick = (field) => ({ en: content.en[field], es: content.es[field] })
    const categories = content.en.tags.map((tag, index) => ({
      en: tag,
      es: content.es.tags[index],
    }))
    const repo = entry.repo && PUBLIC_REPOS.has(entry.repo) ? entry.repo : undefined

    projects.push({
      id: key,
      slug: slugify(key),
      title: TITLE_OVERRIDES[key] ?? pick('title'),
      summary: SUMMARIES[key],
      description: pick('description'),
      category: CATEGORY_OVERRIDES[key] ?? pick('category'),
      categories,
      year: Number(entry.year),
      role: pick('role'),
      cover: await convert(entry.image),
      coverAlt: pick('imageAlt'),
      gallery: await Promise.all(entry.images.map(convert)),
      links: { live: entry.link, repo },
      featured: FEATURED.includes(key),
    })
  }

  writeFileSync(OUT_DATA, render(projects))
  const dropped = meta.filter((entry) => entry.repo && !PUBLIC_REPOS.has(entry.repo))
  console.log(`import-portfolio-content — ${projects.length} projects → ${OUT_DATA}`)
  console.log(`  ${converted.size} images → ${OUT_ART}`)
  console.log(`  featured (${FEATURED.length}): ${FEATURED.join(', ')}`)
  for (const entry of dropped) {
    console.log(`  dropped non-public repo link: ${entry.i18nKey} → ${entry.repo}`)
  }
}

await main()
