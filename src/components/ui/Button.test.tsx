import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders a link when given an href', () => {
    render(<Button href="mailto:x@y.z">Write</Button>)
    const link = screen.getByRole('link', { name: 'Write' })
    expect(link).toHaveAttribute('href', 'mailto:x@y.z')
    expect(link.className).toContain('bg-cream')
  })

  it('renders a type=button with the ghost variant', () => {
    render(
      <Button variant="ghost" onClick={() => undefined}>
        Back
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Back' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button.className).toContain('border')
    expect(button.className.split(' ')).not.toContain('bg-cream')
  })
})
