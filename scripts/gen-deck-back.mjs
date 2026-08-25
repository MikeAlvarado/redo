import { writeFileSync } from 'node:fs'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1066 464" width="1066" height="464">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8391D"/>
      <stop offset="45%" stop-color="#CC1607"/>
      <stop offset="100%" stop-color="#7A0E05"/>
    </linearGradient>
    <linearGradient id="faceL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#B01505"/>
      <stop offset="100%" stop-color="#5E0A03"/>
    </linearGradient>
    <linearGradient id="faceD" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A0803"/>
      <stop offset="100%" stop-color="#230301"/>
    </linearGradient>
    <filter id="bgrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="1066" height="464" fill="url(#sky)" filter="url(#bgrain)"/>
  <path d="M0 340 Q 180 300 340 320 T 700 300 T 1066 330 V 464 H 0 Z" fill="#8F1206" opacity="0.55"/>
  <path d="M0 380 Q 240 330 480 360 T 1066 360 V 464 H 0 Z" fill="#6E0D04" opacity="0.6"/>
  <path d="M240 464 L 560 210 L 640 260 L 700 170 L 1010 464 Z" fill="url(#faceD)"/>
  <path d="M700 170 L 1010 464 L 700 464 Z" fill="url(#faceL)" opacity="0.8"/>
  <path d="M560 210 L 640 260 L 610 464 L 420 464 Z" fill="url(#faceL)" opacity="0.45"/>
  <path d="M0 420 Q 300 380 620 410 T 1066 400 V 464 H 0 Z" fill="#1C0301" opacity="0.85"/>
</svg>`

writeFileSync('public/art/deck-back.svg', svg)
console.log('deck back written')
