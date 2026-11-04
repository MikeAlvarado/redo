import type { ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { MixedHeading } from './MixedHeading'

interface SectionHeadingProps {
  text: string
  sub?: ReactNode
  // Marks the heading and the sub with data-reveal so a parent
  // useRevealOnScroll({ selector: '[data-reveal]' }) animates them.
  reveal?: boolean | 'sub'
  // Wraps the heading alone (the showcase measures it for its ghost title).
  headingWrapperRef?: Ref<HTMLDivElement>
  className?: string
  headingClassName?: string
  subClassName?: string
  ref?: Ref<HTMLDivElement>
}

// The centred title block every section opens with: display heading with
// the soft glow, optional one-line sub in cream/60.
export function SectionHeading({
  text,
  sub,
  reveal = false,
  headingWrapperRef,
  className,
  headingClassName,
  subClassName,
  ref,
}: SectionHeadingProps) {
  const revealProps = reveal ? { 'data-reveal': true } : {}
  const heading = (
    <MixedHeading
      {...(reveal === true ? revealProps : {})}
      text={text}
      className={cn(
        'text-section leading-[1.02] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]',
        headingClassName,
      )}
    />
  )
  return (
    <div
      ref={ref}
      className={cn('mx-auto flex max-w-2xl flex-col items-center gap-4 text-center', className)}
    >
      {headingWrapperRef ? <div ref={headingWrapperRef}>{heading}</div> : heading}
      {sub && (
        <p {...revealProps} className={cn('text-cream/60 text-lg text-pretty', subClassName)}>
          {sub}
        </p>
      )}
    </div>
  )
}
