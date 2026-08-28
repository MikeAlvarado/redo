import type { LocalizedString } from '../i18n/types'

export interface ServiceRow {
  id: string
  index: string
  title: LocalizedString
  items: LocalizedString[]
  image: string
  imageAlt: LocalizedString
}

export const services: ServiceRow[] = [
  {
    id: 'mobile',
    index: '01',
    title: { en: 'Mobile Apps', es: 'Apps móviles' },
    items: [
      { en: 'React Native', es: 'React Native' },
      { en: 'Swift', es: 'Swift' },
      { en: 'Offline data sync', es: 'Sincronización de datos sin conexión' },
      { en: 'Role-based access', es: 'Acceso por roles' },
      { en: 'App Store delivery', es: 'Publicación en la App Store' },
    ],
    image: '/projects/kodda-app.webp',
    imageAlt: {
      en: 'Official Kodda iOS app screenshots from the App Store showing wellness programs and class bookings',
      es: 'Screenshots oficiales de la app iOS de Kodda en el App Store mostrando programas de bienestar y reservas de clases',
    },
  },
  {
    id: 'web',
    index: '02',
    title: { en: 'Web & Frontend', es: 'Web y frontend' },
    items: [
      { en: 'React', es: 'React' },
      { en: 'TypeScript', es: 'TypeScript' },
      { en: 'Vite', es: 'Vite' },
      { en: 'GSAP motion', es: 'Motion con GSAP' },
      { en: 'React Query', es: 'React Query' },
      { en: 'Responsive systems', es: 'Sistemas responsivos' },
    ],
    image: '/projects/mediterra-hero.webp',
    imageAlt: {
      en: "Mediterra homepage hero in cream and deep green with the headline 'Preventive medicine, with time to listen'",
      es: "Hero de la página principal de Mediterra en crema y verde profundo con el titular 'Preventive medicine, with time to listen'",
    },
  },
  {
    id: 'backend',
    index: '03',
    title: { en: 'Backend & Infrastructure', es: 'Backend e infraestructura' },
    items: [
      { en: 'Node.js', es: 'Node.js' },
      { en: 'Express', es: 'Express' },
      { en: 'Firebase Functions', es: 'Firebase Functions' },
      { en: 'Firestore', es: 'Firestore' },
      { en: 'Firebase Auth', es: 'Firebase Auth' },
      { en: 'Stripe', es: 'Stripe' },
      { en: 'REST APIs', es: 'APIs REST' },
    ],
    image: '/projects/cloudfunctions-ts.webp',
    imageAlt: {
      en: 'GitHub repository page for cloudfunctions-ts showing the Firebase Functions project structure',
      es: 'Página del repositorio cloudfunctions-ts en GitHub mostrando la estructura del proyecto de Firebase Functions',
    },
  },
  {
    id: 'ai',
    index: '04',
    title: { en: 'AI & Automation', es: 'IA y automatización' },
    items: [
      { en: 'ML Kit OCR', es: 'OCR con ML Kit' },
      { en: 'On-device inference', es: 'Inferencia en el dispositivo' },
      { en: 'Pinecone', es: 'Pinecone' },
      { en: 'Agentic tooling', es: 'Herramientas agénticas' },
    ],
    image: '/projects/aimeter-launch.webp',
    imageAlt: {
      en: 'AIMeter launch graphic showing iPhone home screen widgets with Claude usage percentages next to the AIMeter wordmark',
      es: 'Gráfico de lanzamiento de AIMeter mostrando los widgets de pantalla de inicio del iPhone con los porcentajes de uso de Claude junto al logotipo de AIMeter',
    },
  },
  {
    id: 'open-source',
    index: '05',
    title: { en: 'Open Source', es: 'Código abierto' },
    items: [
      { en: 'npm publishing', es: 'Publicación en npm' },
      { en: 'Library API design', es: 'Diseño de API de librerías' },
      { en: 'SSR-safe rendering', es: 'Renderizado seguro en servidor' },
      { en: 'Peer dependency hygiene', es: 'Higiene de peer dependencies' },
    ],
    image: '/projects/vitrina-npm.webp',
    imageAlt: {
      en: 'The vitrina package page on npm showing the readme and the install command',
      es: 'La página del paquete vitrina en npm mostrando el readme y el comando de instalación',
    },
  },
  {
    id: 'leadership',
    index: '06',
    title: { en: 'Engineering Leadership', es: 'Liderazgo técnico' },
    items: [
      { en: 'Team building and mentoring', es: 'Formación y mentoría de equipos' },
      { en: 'Code review standards', es: 'Estándares de code review' },
      { en: 'CI/CD with GitHub Actions', es: 'CI/CD con GitHub Actions' },
      { en: 'PostHog-informed roadmaps', es: 'Roadmaps informados con PostHog' },
    ],
    image: '/projects/y-combinator-kodda.webp',
    imageAlt: {
      en: 'Kodda company profile on Y Combinator listing the Summer 2021 batch and founders',
      es: 'Perfil de Kodda en Y Combinator mostrando el batch de verano 2021 y los fundadores',
    },
  },
]
