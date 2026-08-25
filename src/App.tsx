import { Nav } from './components/layout/Nav'
import { ClientGrid } from './components/sections/ClientGrid'
import { ClientMarquee } from './components/sections/ClientMarquee'
import { ClosingCta } from './components/sections/ClosingCta'
import { Founders } from './components/sections/Founders'
import { Hero } from './components/sections/Hero'
import { JourneyCards } from './components/sections/JourneyCards'
import { ScrollStatement } from './components/sections/ScrollStatement'
import { Services } from './components/sections/Services'
import { Showcase } from './components/sections/Showcase'
import { Stats } from './components/sections/Stats'
import { Testimonials } from './components/sections/Testimonials'
import { useRef } from 'react'
import { useLanguageFade } from './hooks/useLanguageFade'
import { useLenis } from './hooks/useLenis'
import { LanguageProvider } from './i18n/LanguageProvider'

function Site() {
  useLenis()
  const fadeRef = useRef<HTMLDivElement | null>(null)
  useLanguageFade(fadeRef)
  return (
    <div ref={fadeRef}>
      <Nav />
      <main className="flex flex-col">
        <div className="tab:order-none order-1">
          <Hero />
        </div>
        <div className="tab:order-none order-2">
          <ScrollStatement footer={<ClientMarquee />} />
        </div>
        <div className="tab:order-none order-3">
          <JourneyCards />
        </div>
        <div className="tab:order-none order-4">
          <Services />
        </div>
        <div className="tab:order-none order-5">
          <Showcase />
        </div>
        <div className="tab:order-none order-8">
          <ClientGrid />
        </div>
        <div className="tab:order-none order-6">
          <Testimonials />
        </div>
        <div className="tab:order-none order-7">
          <Stats />
        </div>
        <div className="tab:order-none order-9">
          <Founders />
        </div>
        <div className="tab:order-none order-10">
          <ClosingCta />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  )
}
