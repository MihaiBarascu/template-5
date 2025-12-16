/**
 * Unit Tests for PortfolioBlock Component
 *
 * Tests cover:
 * - Rendering with different props
 * - Empty state handling
 * - External vs internal links
 * - Accessibility attributes
 * - Different variants
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { PortfolioBlock, type PortfolioItem } from '@/blocks/Portfolio/Component'

// Cleanup after each test
beforeEach(() => {
  cleanup()
})

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock Media component
vi.mock('@/components/Media', () => ({
  Media: ({ resource }: { resource: { alt?: string } }) => (
    <img alt={resource?.alt || 'mock image'} data-testid="media-image" />
  ),
}))

// Sample portfolio items for testing
const mockItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Project One',
    shortDescription: 'Description for project one',
    client: 'Client A',
    externalUrl: 'https://example.com/project1',
    featuredImage: { id: 'img1', alt: 'Project One Image' } as any,
    slug: 'project-one',
  },
  {
    id: '2',
    title: 'Project Two',
    shortDescription: 'Description for project two',
    client: 'Client B',
    externalUrl: null,
    featuredImage: { id: 'img2', alt: 'Project Two Image' } as any,
    slug: 'project-two',
  },
  {
    id: '3',
    title: 'Project Three',
    shortDescription: null,
    client: null,
    externalUrl: '',
    featuredImage: null,
    slug: null,
  },
]

describe('PortfolioBlock Component', () => {
  describe('rendering', () => {
    it('renders heading and subheading when provided', () => {
      render(
        <PortfolioBlock
          heading="Our Portfolio"
          subheading="Check out our work"
          items={mockItems}
        />
      )

      expect(screen.getByText('Our Portfolio')).toBeTruthy()
      expect(screen.getByText('Check out our work')).toBeTruthy()
    })

    it('does not render header section when no heading or subheading', () => {
      render(<PortfolioBlock items={mockItems} />)

      // The heading container should not exist
      expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
    })

    it('renders all portfolio items', () => {
      render(<PortfolioBlock items={mockItems} />)

      expect(screen.getByText('Project One')).toBeTruthy()
      expect(screen.getByText('Project Two')).toBeTruthy()
      expect(screen.getByText('Project Three')).toBeTruthy()
    })

    it('renders descriptions when showDescription is true', () => {
      render(<PortfolioBlock items={mockItems} showDescription={true} />)

      expect(screen.getByText('Description for project one')).toBeTruthy()
      expect(screen.getByText('Description for project two')).toBeTruthy()
    })

    it('renders client info when showClient is true', () => {
      render(<PortfolioBlock items={mockItems} showClient={true} />)

      expect(screen.getByText('Client: Client A')).toBeTruthy()
      expect(screen.getByText('Client: Client B')).toBeTruthy()
    })

    it('does not render client info when showClient is false', () => {
      render(<PortfolioBlock items={mockItems} showClient={false} />)

      expect(screen.queryByText('Client: Client A')).toBeNull()
    })
  })

  describe('empty state', () => {
    it('renders empty state when no items provided', () => {
      render(<PortfolioBlock items={[]} />)

      expect(screen.getByText('Nu sunt proiecte în portofoliu.')).toBeTruthy()
    })

    it('renders empty state with correct styling', () => {
      const { container } = render(<PortfolioBlock items={[]} />)

      const emptyState = container.querySelector('.border-dashed')
      expect(emptyState).toBeTruthy()
    })
  })

  describe('external links', () => {
    it('renders external links with correct attributes', () => {
      render(<PortfolioBlock items={mockItems} />)

      const externalLink = screen.getByRole('link', { name: /Project One/i })
      expect(externalLink.getAttribute('href')).toBe('https://example.com/project1')
      expect(externalLink.getAttribute('target')).toBe('_blank')
      expect(externalLink.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('renders internal links for items without externalUrl', () => {
      render(<PortfolioBlock items={mockItems} />)

      const internalLink = screen.getByRole('link', { name: /Project Two/i })
      expect(internalLink.getAttribute('href')).toBe('/portofoliu/project-two')
      expect(internalLink.getAttribute('target')).toBeNull()
    })

    it('renders fallback link for items without slug or externalUrl', () => {
      render(<PortfolioBlock items={mockItems} />)

      const fallbackLink = screen.getByRole('link', { name: /Project Three/i })
      expect(fallbackLink.getAttribute('href')).toBe('#')
    })

    it('shows correct CTA text for external links', () => {
      render(<PortfolioBlock items={[mockItems[0]]} />)

      expect(screen.getByText('Vezi site-ul')).toBeTruthy()
    })

    it('shows correct CTA text for internal links', () => {
      render(<PortfolioBlock items={[mockItems[1]]} />)

      expect(screen.getByText('Vezi proiectul')).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('has correct aria-labelledby when heading is provided', () => {
      const { container } = render(
        <PortfolioBlock heading="Portfolio" items={mockItems} />
      )

      const section = container.querySelector('section')
      expect(section?.getAttribute('aria-labelledby')).toBe('portfolio-heading')
    })

    it('heading has correct id for aria connection', () => {
      render(<PortfolioBlock heading="Portfolio" items={mockItems} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading.getAttribute('id')).toBe('portfolio-heading')
    })

    it('external links have descriptive aria-label', () => {
      render(<PortfolioBlock items={[mockItems[0]]} />)

      const link = screen.getByRole('link', { name: /Project One/i })
      expect(link.getAttribute('aria-label')).toContain('Project One')
      expect(link.getAttribute('aria-label')).toContain('fereastră nouă')
    })

    it('internal links have descriptive aria-label', () => {
      render(<PortfolioBlock items={[mockItems[1]]} />)

      const link = screen.getByRole('link', { name: /Project Two/i })
      expect(link.getAttribute('aria-label')).toContain('Project Two')
    })

    it('links have focus-visible styles', () => {
      render(<PortfolioBlock items={mockItems} />)

      const link = screen.getByRole('link', { name: /Project One/i })
      expect(link.className).toContain('focus-visible:ring')
    })
  })

  describe('variants', () => {
    it('renders grid-masonry variant with columns class', () => {
      const { container } = render(
        <PortfolioBlock variant="grid-masonry" items={mockItems} />
      )

      const masonryContainer = container.querySelector('.columns-1')
      expect(masonryContainer).toBeTruthy()
    })

    it('renders grid variant with grid class', () => {
      const { container } = render(
        <PortfolioBlock variant="grid-uniform" items={mockItems} />
      )

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toBeTruthy()
    })

    it('applies correct column classes for 2 columns', () => {
      const { container } = render(
        <PortfolioBlock variant="grid-uniform" columns="2" items={mockItems} />
      )

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer?.className).toContain('sm:grid-cols-2')
    })

    it('applies correct column classes for 4 columns', () => {
      const { container } = render(
        <PortfolioBlock variant="grid-uniform" columns="4" items={mockItems} />
      )

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer?.className).toContain('lg:grid-cols-4')
    })
  })

  describe('background colors', () => {
    it('applies default background class', () => {
      const { container } = render(
        <PortfolioBlock backgroundColor="default" items={mockItems} />
      )

      const section = container.querySelector('section')
      expect(section?.className).toContain('bg-theme-surface')
    })

    it('applies light background class', () => {
      const { container } = render(
        <PortfolioBlock backgroundColor="light" items={mockItems} />
      )

      const section = container.querySelector('section')
      expect(section?.className).toContain('bg-theme-light')
    })

    it('applies dark background class', () => {
      const { container } = render(
        <PortfolioBlock backgroundColor="dark" items={mockItems} />
      )

      const section = container.querySelector('section')
      expect(section?.className).toContain('bg-theme-dark')
    })

    it('applies white text on dark background', () => {
      render(
        <PortfolioBlock
          backgroundColor="dark"
          heading="Portfolio"
          items={mockItems}
        />
      )

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading.className).toContain('text-white')
    })
  })

  describe('CTA button', () => {
    it('renders CTA button when enabled', () => {
      render(
        <PortfolioBlock
          items={mockItems}
          ctaButton={{
            enabled: true,
            label: 'View All Projects',
            link: '/portfolio',
          }}
        />
      )

      const ctaLink = screen.getByRole('link', { name: /View All Projects/i })
      expect(ctaLink).toBeTruthy()
      expect(ctaLink.getAttribute('href')).toBe('/portfolio')
    })

    it('does not render CTA button when disabled', () => {
      render(
        <PortfolioBlock
          items={mockItems}
          ctaButton={{
            enabled: false,
            label: 'View All Projects',
            link: '/portfolio',
          }}
        />
      )

      expect(screen.queryByRole('link', { name: /View All Projects/i })).toBeNull()
    })

    it('does not render CTA button when label is missing', () => {
      render(
        <PortfolioBlock
          items={mockItems}
          ctaButton={{
            enabled: true,
            label: null,
            link: '/portfolio',
          }}
        />
      )

      // CTA should not render without a label
      const links = screen.getAllByRole('link')
      const ctaLink = links.find(link => link.getAttribute('href') === '/portfolio')
      expect(ctaLink).toBeUndefined()
    })

    it('does not render CTA button when link is missing', () => {
      render(
        <PortfolioBlock
          items={mockItems}
          ctaButton={{
            enabled: true,
            label: 'View All',
            link: null,
          }}
        />
      )

      expect(screen.queryByText('View All')).toBeNull()
    })
  })

  describe('placeholder image', () => {
    it('renders placeholder when no featured image', () => {
      const itemsWithoutImages: PortfolioItem[] = [
        {
          id: '1',
          title: 'No Image Project',
          featuredImage: null,
          slug: 'no-image',
        },
      ]

      const { container } = render(<PortfolioBlock items={itemsWithoutImages} />)

      // Should have a placeholder div with min-height
      const placeholder = container.querySelector('.min-h-\\[200px\\]')
      expect(placeholder).toBeTruthy()
    })
  })

  describe('edge cases', () => {
    it('handles items with empty strings', () => {
      const itemsWithEmptyStrings: PortfolioItem[] = [
        {
          id: '1',
          title: 'Test',
          shortDescription: '',
          externalUrl: '   ', // whitespace only
          slug: '',
        },
      ]

      render(<PortfolioBlock items={itemsWithEmptyStrings} showDescription={true} />)

      // Should treat empty/whitespace externalUrl as no external URL
      const link = screen.getByRole('link', { name: /Test/i })
      expect(link.getAttribute('href')).toBe('#')
    })

    it('handles null values gracefully', () => {
      const itemsWithNulls: PortfolioItem[] = [
        {
          id: '1',
          title: 'Null Test',
          shortDescription: null,
          client: null,
          externalUrl: null,
          featuredImage: null,
          slug: null,
        },
      ]

      // Should not throw
      expect(() => {
        render(<PortfolioBlock items={itemsWithNulls} showDescription={true} showClient={true} />)
      }).not.toThrow()
    })

    it('handles undefined ctaButton gracefully', () => {
      expect(() => {
        render(<PortfolioBlock items={mockItems} ctaButton={undefined} />)
      }).not.toThrow()
    })
  })
})
