import { createElement, Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface MixedHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  brClassName?: string
}

function parseLine(line: string, keyPrefix: string): ReactNode[] {
  return line.split('*').map((part, index) =>
    index % 2 === 1 ? (
      <em key={`${keyPrefix}-${index}`} className="italic">
        {part}
      </em>
    ) : (
      part
    ),
  )
}

function parseMixedText(text: string, brClassName?: string): ReactNode[] {
  return text.split('\n').map((line, lineIndex, lines) => (
    <Fragment key={lineIndex}>
      {parseLine(line, `l${lineIndex}`)}
      {lineIndex < lines.length - 1 && <br className={brClassName} />}
      {lineIndex < lines.length - 1 && brClassName && ' '}
    </Fragment>
  ))
}

export function MixedHeading({
  text,
  as = 'h2',
  className,
  brClassName,
  ...rest
}: MixedHeadingProps) {
  return createElement(
    as,
    { ...rest, className: cn('font-display text-cream', className) },
    parseMixedText(text, brClassName),
  )
}
