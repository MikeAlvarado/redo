export function ClosingBackdrop() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-60 mix-blend-multiply"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle
        cx="720"
        cy="380"
        r="250"
        fill="none"
        stroke="#FFE0E0"
        strokeOpacity="0.06"
      />
      <circle
        cx="720"
        cy="380"
        r="400"
        fill="none"
        stroke="#FFE0E0"
        strokeOpacity="0.04"
      />
      <circle
        cx="720"
        cy="380"
        r="560"
        fill="none"
        stroke="#FFE0E0"
        strokeOpacity="0.025"
      />
      <path
        d="M0 620 Q 300 500 620 590 T 1440 580 V 900 H 0 Z"
        fill="#2A0906"
        fillOpacity="0.45"
      />
      <path
        d="M0 760 Q 420 660 860 740 T 1440 720 V 900 H 0 Z"
        fill="#170402"
        fillOpacity="0.6"
      />
    </svg>
  )
}
