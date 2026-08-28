import type { StatRow } from '../../../data/stats'
import { stats } from '../../../data/stats'
import { useCountUp } from '../../../hooks/useCountUp'
import { useLanguage } from '../../../hooks/useLanguage'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'

function StatNumeral({ stat }: { stat: StatRow }) {
  const numeralRef = useCountUp<HTMLSpanElement>(stat.value, {
    digits: 0,
    group: stat.group,
  })
  return (
    <span className="font-display text-numeral text-cream/85 leading-none tracking-tight italic">
      {stat.prefix && <span aria-hidden>{stat.prefix}</span>}
      <span ref={numeralRef} />
      {stat.suffix && <span aria-hidden>{stat.suffix}</span>}
    </span>
  )
}

function StatSource({ stat }: { stat: StatRow }) {
  const { t, l } = useLanguage()
  return (
    <span
      title={t.stats.sourceLabel}
      className="text-cream/55 flex items-center gap-2 text-xs tracking-[0.16em] uppercase"
    >
      {stat.mark && (
        <img
          src={stat.mark.src}
          alt={l(stat.mark.alt)}
          width={72}
          height={24}
          loading="lazy"
          className="h-4 w-auto opacity-60"
        />
      )}
      {stat.source}
    </span>
  )
}

function StatRowItem({ stat }: { stat: StatRow }) {
  const { l } = useLanguage()
  const rowRef = useRevealOnScroll<HTMLLIElement>({ selector: '[data-reveal]' })
  return (
    <li ref={rowRef} className="flex flex-col">
      <div className="bg-hairline h-px w-full" />
      <div className="tab:gap-12 tab:py-16 flex flex-row items-start gap-5 py-10">
        <div
          data-reveal
          className="tab:basis-[38%] tab:items-end flex shrink-0 basis-[34%] flex-col items-start gap-2"
        >
          <StatNumeral stat={stat} />
          <StatSource stat={stat} />
        </div>
        <div data-reveal className="flex max-w-md flex-col gap-3">
          <h3 className="text-cream tab:text-xl text-base">{l(stat.label)}</h3>
          <p className="text-cream/55 tab:text-base text-sm leading-relaxed">
            {l(stat.body)}
          </p>
        </div>
      </div>
    </li>
  )
}

export function Stats() {
  const { t } = useLanguage()
  return (
    <section
      data-section="stats"
      aria-label={t.stats.regionLabel}
      className="px-inset-sm nav:px-inset nav:py-24 py-16"
    >
      <ul className="mx-auto flex max-w-5xl flex-col">
        {stats.map((stat) => (
          <StatRowItem key={stat.id} stat={stat} />
        ))}
      </ul>
    </section>
  )
}
