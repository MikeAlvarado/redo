import { Fragment, useRef, type ReactNode } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { useWordReveal } from '../../../hooks/useWordReveal'
import { DotGrid } from '../../ui/DotGrid'

export function ScrollStatement({ footer }: { footer?: ReactNode }) {
  const { t } = useLanguage()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const containerRef = useRef<HTMLDivElement | null>(null)
  useWordReveal(containerRef, {
    pinLength: isMobile ? '+=120%' : '+=180%',
    window: isMobile ? 2.4 : 1.6,
    revision: t.statement,
  })

  return (
    <section data-section="statement">
      <div ref={containerRef} className="relative flex min-h-svh flex-col">
        <DotGrid />
        <div className="nav:px-16 relative flex flex-1 items-center justify-center px-6">
          <p className="font-display text-statement text-cream max-w-[77rem] text-center leading-[1.12]">
            {t.statement.split(' ').map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span data-word className="inline-block">
                  {word}
                </span>{' '}
              </Fragment>
            ))}
          </p>
        </div>
        {footer && <div className="relative">{footer}</div>}
      </div>
    </section>
  )
}
