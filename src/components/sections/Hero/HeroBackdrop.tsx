export function HeroBackdrop() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-70 mix-blend-multiply"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle
        cx="720"
        cy="450"
        r="330"
        fill="none"
        stroke="#FFE0E0"
        strokeOpacity="0.06"
      />
      <circle
        cx="720"
        cy="450"
        r="480"
        fill="none"
        stroke="#FFE0E0"
        strokeOpacity="0.045"
      />
      <circle
        cx="720"
        cy="450"
        r="640"
        fill="none"
        stroke="#FFE0E0"
        strokeOpacity="0.03"
      />
      <path
        d="M0 560 Q 280 420 560 540 T 1080 500 T 1440 560 V 900 H 0 Z"
        fill="#1A0503"
        fillOpacity="0.5"
      />
      <path
        d="M0 660 Q 360 540 720 640 T 1440 640 V 900 H 0 Z"
        fill="#120302"
        fillOpacity="0.65"
      />
      <path
        d="M0 780 Q 420 690 840 760 T 1440 750 V 900 H 0 Z"
        fill="#0B0201"
        fillOpacity="0.8"
      />
    </svg>
  )
}
