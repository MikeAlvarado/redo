import '@fontsource-variable/mona-sans'
import '@fontsource/instrument-serif'
import '@fontsource/instrument-serif/400-italic.css'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// iOS fires a resize every time a browser toolbar shows or hides; refreshing
// on each one makes pinned sections jump mid-scroll.
// https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config()
ScrollTrigger.config({ ignoreMobileResize: true })

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
