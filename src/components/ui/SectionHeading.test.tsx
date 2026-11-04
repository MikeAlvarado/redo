import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders the italic run and the sub', () => {
    render(<SectionHeading text="What *drives* me" sub="In my own words." />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('What drives me')
    expect(heading.querySelector('em')).toHaveTextContent('drives')
    expect(screen.getByText('In my own words.')).toBeInTheDocument()
  })

  it('marks only the sub for reveal when asked', () => {
    render(<SectionHeading text="Featured work" sub="Shipped" reveal="sub" />)
    expect(screen.getByRole('heading')).not.toHaveAttribute('data-reveal')
    expect(screen.getByText('Shipped')).toHaveAttribute('data-reveal')
  })
})
