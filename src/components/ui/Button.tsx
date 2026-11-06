import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'solid' | 'ghost'

const BASE =
  'rounded-cta inline-flex items-center justify-center gap-2 text-sm font-medium transition-[transform,background-color,color] duration-300'

const VARIANTS: Record<Variant, string> = {
  // Cream pill on ink: the one call to action per section.
  solid: 'bg-cream text-ink max-tab:min-h-11 px-5 py-2.5 hover:scale-[1.03]',
  // Hairline pill that fills on hover: secondary actions (back, cancel).
  ghost: 'text-cream border border-white/20 px-4 py-2.5 hover:bg-cream hover:text-ink',
}

interface ButtonBaseProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

type ButtonLinkProps = ButtonBaseProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >
type ButtonButtonProps = ButtonBaseProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >

export type ButtonProps = ButtonLinkProps | ButtonButtonProps

// One pill for every CTA on the site. With `href` it renders an <a>,
// otherwise a <button type="button">.
export function Button({ variant = 'solid', className, children, ...rest }: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], className)
  if (rest.href !== undefined) {
    return (
      <a {...rest} className={classes}>
        {children}
      </a>
    )
  }
  const { href, ...buttonRest } = rest
  void href
  return (
    <button type="button" {...buttonRest} className={classes}>
      {children}
    </button>
  )
}
