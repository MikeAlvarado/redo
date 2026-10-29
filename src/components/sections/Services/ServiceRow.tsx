import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useId, useState } from 'react'
import type { ServiceRow as ServiceRowData } from '../../../data/services'
import { useLanguage } from '../../../hooks/useLanguage'
import { cn } from '../../../lib/cn'
import { hoverSpring } from '../../../lib/easing'
import { useServiceRow } from './useServiceRow'

export function ServiceRow({ service }: { service: ServiceRowData }) {
  const { t, l } = useLanguage()
  const rowRef = useServiceRow<HTMLLIElement>()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const [lead, ...rest] = service.images

  return (
    <li ref={rowRef} className="flex flex-col">
      <div data-divider className="bg-hairline h-px w-full" />
      <div className="tab:flex-row tab:gap-8 tab:py-12 flex flex-col py-6">
        <div
          data-reveal
          className="tab:basis-[34%] tab:flex-col tab:items-start tab:justify-start tab:gap-2 flex items-center justify-between gap-4"
        >
          <div className="tab:gap-2 flex flex-col gap-1">
            <span className="tab:text-base text-xs text-white/60">({service.index})</span>
            <h3 className="text-cream tab:text-4xl text-xl tracking-tight">
              {l(service.title)}
            </h3>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${t.services.toggleDetails} ${l(service.title)}`}
            onClick={() => setOpen((current) => !current)}
            className="text-cream tab:hidden flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20"
          >
            <Plus
              size={16}
              aria-hidden
              className={cn('transition-transform duration-300', open && 'rotate-45')}
            />
          </button>
        </div>
        <div
          id={panelId}
          className={cn(
            'tab:max-h-none tab:flex-1 tab:flex-row tab:gap-8 tab:opacity-100 flex flex-col gap-6 overflow-hidden transition-[max-height,opacity,margin] duration-500',
            open
              ? cn('mt-6 opacity-100', rest.length > 0 ? 'max-h-[80rem]' : 'max-h-[44rem]')
              : 'tab:mt-0 max-h-0 opacity-0',
          )}
        >
          <div data-reveal className="tab:order-none tab:min-w-0 tab:flex-1 order-2">
            <ul className="flex flex-col gap-2.5">
              {service.items.map((item) => (
                <li key={item.en} className="text-cream/60 text-base">
                  {l(item)}
                </li>
              ))}
            </ul>
          </div>
          <div
            data-reveal
            className="tab:order-none tab:basis-[44%] order-1 flex flex-col gap-2"
          >
            <motion.img
              data-thumb
              src={lead.src}
              alt={l(lead.alt)}
              width={1600}
              height={900}
              loading="lazy"
              className="rounded-thumb aspect-video w-full object-cover"
              whileHover={{ scale: 1.03, filter: 'brightness(1.12)' }}
              transition={hoverSpring}
            />
            {rest.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {rest.map((image) => (
                  <li key={image.src} className="basis-[calc(33.333%-0.375rem)]">
                    <motion.img
                      data-thumb
                      src={image.src}
                      alt={l(image.alt)}
                      width={800}
                      height={450}
                      loading="lazy"
                      className="rounded-thumb aspect-video w-full object-cover"
                      whileHover={{ scale: 1.04, filter: 'brightness(1.12)' }}
                      transition={hoverSpring}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
