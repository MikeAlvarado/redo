import type { LocalizedString } from '../i18n/types'

export interface ServiceImage {
  src: string
  alt: LocalizedString
}

export interface ServiceRow {
  id: string
  index: string
  title: LocalizedString
  items: LocalizedString[]
  // One photograph renders as the row's thumbnail; several render as a
  // mosaic (the first one large, the rest in a strip underneath).
  images: [ServiceImage, ...ServiceImage[]]
}

// Four rows in Mike's own words (founder, leader, engineer, lifelong
// learner). The first item of each row is the belief; the rest is the
// evidence, every line backed by the CV (v3.2) or a repository under
// ~/Developer/personal. Photographs are Mike's own (2026-10-28).
export const services: ServiceRow[] = [
  {
    id: 'founder',
    index: '01',
    title: { en: 'As a founder', es: 'Como fundador' },
    items: [
      {
        en: 'Great products come from asking the right questions, listening to users, and creating with intention.',
        es: 'Los grandes productos nacen de hacer las preguntas correctas, escuchar a los usuarios y crear con intención.',
      },
      {
        en: 'Co-founded Kodda and took it through Y Combinator (S21).',
        es: 'Cofundé Kodda y la llevé por Y Combinator (S21).',
      },
      {
        en: 'Steered its evolution from pet insurance into a wellness and lifestyle platform, from 30 to 8,000+ users.',
        es: 'Guié su evolución de seguros para mascotas a una plataforma de bienestar y estilo de vida, de 30 a más de 8,000 usuarios.',
      },
      {
        en: 'Now building midflight and preride with the same intention.',
        es: 'Hoy construyo midflight y preride con la misma intención.',
      },
    ],
    images: [
      {
        src: '/art/photos/team-black.webp',
        alt: {
          en: 'The Kodda team, seven people dressed in black, smiling together in the office',
          es: 'El equipo de Kodda, siete personas vestidas de negro, sonriendo juntas en la oficina',
        },
      },
    ],
  },
  {
    id: 'leader',
    index: '02',
    title: { en: 'As a leader', es: 'Como líder' },
    items: [
      {
        en: 'My goal is to give people the tools and clarity to do their best work.',
        es: 'Mi meta es darle a la gente las herramientas y la claridad para hacer su mejor trabajo.',
      },
      {
        en: 'Worked alongside more than 30 people at once at Kodda, and learned from them every single day.',
        es: 'Trabajé con más de 30 personas a la vez en Kodda, y aprendí de ellas todos los días.',
      },
      {
        en: 'Helping each of them grow in their careers was an honor, and the part I am proudest of.',
        es: 'Ayudar a cada una a crecer en su carrera fue un honor, y de lo que más orgulloso estoy.',
      },
      {
        en: 'CTO, then CEO, of a Y Combinator company.',
        es: 'CTO y después CEO de una empresa de Y Combinator.',
      },
    ],
    images: [
      {
        src: '/art/photos/leader-mic.webp',
        alt: {
          en: 'Mike from behind with a headset microphone, speaking to a seated crowd at an outdoor Kodda class',
          es: 'Mike de espaldas con micrófono de diadema, hablando a un grupo sentado en una clase de Kodda al aire libre',
        },
      },
    ],
  },
  {
    id: 'engineer',
    index: '03',
    title: { en: 'As an engineer', es: 'Como ingeniero' },
    items: [
      {
        en: 'Use technology with purpose and empathy.',
        es: 'Usar la tecnología con propósito y empatía.',
      },
      {
        en: 'Swift and SwiftUI, React and TypeScript, Node and Firebase, Rust.',
        es: 'Swift y SwiftUI, React y TypeScript, Node y Firebase, Rust.',
      },
      {
        en: 'OCR at the register for 70+ supermarkets at Softtek; +37% payment completion at Moneypool.',
        es: 'OCR en caja para más de 70 supermercados en Softtek; +37% de pagos completados en Moneypool.',
      },
      {
        en: 'Accessibility and performance treated as features, not polish.',
        es: 'Accesibilidad y rendimiento tratados como funciones, no como acabado.',
      },
    ],
    images: [
      {
        src: '/art/photos/engineer-desk.webp',
        alt: {
          en: 'Mike at his desk from behind, reading on a large monitor next to a laptop with a Y Combinator sticker',
          es: 'Mike en su escritorio, de espaldas, leyendo en un monitor grande junto a una laptop con calcomanía de Y Combinator',
        },
      },
    ],
  },
  {
    id: 'learner',
    index: '04',
    title: { en: 'As a lifelong learner', es: 'Como eterno aprendiz' },
    items: [
      {
        en: 'Keep growing in order to keep building.',
        es: 'Seguir creciendo para seguir construyendo.',
      },
      {
        en: 'Giving back to the community is a critical part of my life. It is where I learned the most, and where I keep learning.',
        es: 'Devolverle a la comunidad es una parte crítica de mi vida. Ahí fue donde más aprendí, y donde sigo aprendiendo.',
      },
      {
        en: 'From FIRST Robotics and campus hackathons to the run clubs and rooftop classes we hosted with Kodda.',
        es: 'De FIRST Robotics y los hackathones del campus a los run clubs y las clases en azoteas que organizamos con Kodda.',
      },
      {
        en: 'PMI-PMP training in 2025; Scrum Master and Lean Six Sigma before that. Rust and WidgetKit this year, by shipping with them.',
        es: 'Formación PMI-PMP en 2025; Scrum Master y Lean Six Sigma antes. Rust y WidgetKit este año, publicando con ellos.',
      },
    ],
    images: [
      {
        src: '/art/photos/run-club.webp',
        alt: {
          en: 'A run club of about forty people posing together at dawn before a race',
          es: 'Un run club de unas cuarenta personas posando juntas al amanecer antes de una carrera',
        },
      },
      {
        src: '/art/photos/rooftop-class.webp',
        alt: {
          en: 'Dozens of people in plank position on yoga mats on a rooftop at sunrise, Kodda flags behind them',
          es: 'Decenas de personas en plancha sobre tapetes de yoga en una azotea al amanecer, con banderas de Kodda detrás',
        },
      },
      {
        src: '/art/photos/hackathon.webp',
        alt: {
          en: 'A large group photo at a campus hackathon, most people in blue event shirts',
          es: 'Foto grupal en un hackathon de campus, la mayoría con playeras azules del evento',
        },
      },
      {
        src: '/art/photos/first-robotics.webp',
        alt: {
          en: 'Two students from behind at the driver station of a FIRST Robotics competition field',
          es: 'Dos estudiantes de espaldas en la estación de pilotos de un campo de competencia de FIRST Robotics',
        },
      },
      {
        src: '/art/photos/kodda-gym.webp',
        alt: {
          en: 'Mike smiling in a white bucket hat and a Kodda quarter-zip with a Y Combinator patch',
          es: 'Mike sonriendo con un bucket hat blanco y una sudadera de Kodda con parche de Y Combinator',
        },
      },
      {
        src: '/art/photos/studio.webp',
        alt: {
          en: 'Mike taking a selfie in a small studio set up with cameras and lights for a recording',
          es: 'Mike tomándose una selfie en un estudio pequeño montado con cámaras y luces para una grabación',
        },
      },
      {
        src: '/art/photos/bass.webp',
        alt: {
          en: 'Mike playing bass on stage in a gold jacket under purple lights',
          es: 'Mike tocando el bajo en un escenario con chamarra dorada bajo luces moradas',
        },
      },
    ],
  },
]
