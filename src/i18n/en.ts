import type { Dictionary } from './types'

export const en = {
  meta: {
    title: 'Mike Alvarado — Technical Founder & Software Engineer',
    description:
      'Portfolio of Mike Alvarado, a technical founder focused on building meaningful, scalable technology. Product, engineering, and leadership.',
  },
  nav: {
    wordmark: 'Mike.',
    services: 'Services',
    work: 'Previous Work',
    reviews: 'Reviews',
    cta: 'Get in touch',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    langLabel: 'Language',
    navLabel: 'Main navigation',
  },
  // TODO(mike): hero.line1 / line2 / sub are the last placeholder copy on the
  // site — write them here and in es.ts (both files, same three keys).
  hero: {
    line1: 'Imagine a space',
    line2: 'between idea & product',
    sub: "That's where I build.",
    scroll: 'Scroll to Explore',
    location: 'MTY, MX',
    clockLabel: 'My local time',
  },
  statement:
    'I am a technical founder focused on building meaningful, scalable technology. I care about clarity, craftsmanship, and leading teams that build with purpose.',
  marquee: {
    lockup: 'Y Combinator S21',
    trackLabel: 'Organizations I have worked with',
  },
  journey: {
    heading: 'Three ways to\n*build* together',
  },
  services: {
    heading: 'What we can *build* together',
    sub: 'Six ways I plug into a team, from the first commit to the shipped product',
    listLabel: 'Services',
    toggleDetails: 'Toggle details for',
    cta: 'Build your vision with me',
  },
  showcase: {
    heading: '*Featured* work',
    sub: 'Products, libraries and experiments I have shipped end to end',
    prev: 'Previous project',
    next: 'Next project',
    goToSlide: 'Go to project',
    openProject: 'Open project details',
    back: 'Back to projects',
    visit: 'Visit live site',
    repo: 'View repository',
    caseStudy: 'Read case study',
    roleLabel: 'Role',
    yearLabel: 'Year',
    clientLabel: 'Client',
    galleryLabel: 'Project gallery',
    carouselLabel: 'Featured projects',
  },
  clients: {
    heading: 'Organizations I have built with and for',
    gridLabel: 'Organizations I have built with and for',
  },
  testimonials: {
    heading: 'Hear *from* my clients',
    sub: 'Words from the people I have built with',
    prev: 'Previous testimonial',
    next: 'Next testimonial',
    goTo: 'Go to testimonial',
    paginationLabel: 'Testimonials pagination',
    regionLabel: 'Testimonials',
  },
  stats: {
    regionLabel: 'Numbers that back it up',
    sourceLabel: 'Where this number comes from',
  },
  credentials: {
    regionLabel: 'Credentials and education',
  },
  founders: {
    heading: 'Get in touch *with me*',
    sub: "I'm always up for a good coffee chat",
    regionLabel: 'Contact card',
  },
  closing: {
    eyebrow: "Have a project in mind? Reach out and let's create something amazing.",
    heading: "Let's *work together*",
    cta: 'Get in touch',
    rights: 'All rights reserved.',
    emailLabel: 'Email me',
    reachLabel: 'Ways to reach me',
    connectLabel: 'Connect',
  },
} satisfies Dictionary
