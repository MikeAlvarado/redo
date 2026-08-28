export type Locale = 'en' | 'es'

export type LocalizedString = Record<Locale, string>

export interface Dictionary {
  meta: {
    title: string
    description: string
  }
  nav: {
    wordmark: string
    services: string
    work: string
    reviews: string
    cta: string
    openMenu: string
    closeMenu: string
    langLabel: string
    navLabel: string
  }
  hero: {
    line1: string
    line2: string
    sub: string
    scroll: string
    location: string
    clockLabel: string
  }
  statement: string
  marquee: {
    lockup: string
    trackLabel: string
  }
  journey: {
    heading: string
  }
  services: {
    heading: string
    sub: string
    listLabel: string
    toggleDetails: string
    cta: string
  }
  showcase: {
    heading: string
    sub: string
    prev: string
    next: string
    goToSlide: string
    openProject: string
    closeOverlay: string
    visit: string
    repo: string
    caseStudy: string
    roleLabel: string
    yearLabel: string
    clientLabel: string
    galleryLabel: string
    carouselLabel: string
  }
  clients: {
    heading: string
    gridLabel: string
  }
  testimonials: {
    heading: string
    sub: string
    prev: string
    next: string
    goTo: string
    paginationLabel: string
    regionLabel: string
  }
  stats: {
    regionLabel: string
    sourceLabel: string
  }
  credentials: {
    regionLabel: string
  }
  founders: {
    heading: string
    sub: string
    regionLabel: string
  }
  closing: {
    eyebrow: string
    heading: string
    cta: string
    rights: string
    emailLabel: string
    reachLabel: string
    connectLabel: string
  }
}
