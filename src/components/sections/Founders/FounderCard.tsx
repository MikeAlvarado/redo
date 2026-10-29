import { Mail } from 'lucide-react'
import type { Founder } from '../../../data/founders'
import { useLanguage } from '../../../hooks/useLanguage'
import { cn } from '../../../lib/cn'
import { GrainOverlay } from '../../ui/GrainOverlay'

function BrandIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[15px]" fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  )
}

const LINKEDIN_PATH =
  'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z'

const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z'

const INSTAGRAM_PATH =
  'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z'

const LINK_ICONS = {
  linkedin: <BrandIcon path={LINKEDIN_PATH} />,
  github: <BrandIcon path={GITHUB_PATH} />,
  instagram: <BrandIcon path={INSTAGRAM_PATH} />,
  mail: <Mail size={15} aria-hidden />,
} as const

export function FounderCard({
  founder,
  className,
}: {
  founder: Founder
  className?: string
}) {
  const { l } = useLanguage()
  return (
    <article
      className={cn(
        'relative flex w-[305px] flex-col items-center gap-5 overflow-hidden rounded-[10px] bg-[linear-gradient(165deg,#1d1d1d_0%,#141414_60%,#0f0f0f_100%)] px-7 py-9 shadow-[0_30px_60px_rgba(0,0,0,0.55)]',
        className,
      )}
    >
      <GrainOverlay />
      <img
        src={founder.portrait}
        alt={l(founder.portraitAlt)}
        width={400}
        height={400}
        loading="lazy"
        className="size-[130px] rounded-full object-cover"
      />
      <h3 className="font-display text-center text-[2.5rem] leading-[1.02] text-white italic">
        {founder.name.split('\n').map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>
      <p className="text-cream text-center text-base">{l(founder.role)}</p>
      <ul className="mt-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2">
        {founder.links.map((link) => (
          <li key={link.icon}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-cream/85 hover:text-cream inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              {LINK_ICONS[link.icon]}
              {l(link.label)}
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
