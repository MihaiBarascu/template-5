'use client'

import React, { useId, useMemo } from 'react'
import { cn } from '@/utilities/cn'

export type PatternType =
  | 'bubbles'        // Organic circles like plasturi.ro
  | 'floating-dots'  // Random floating dots
  | 'diagonal-lines' // Elegant diagonal lines
  | 'waves'          // Flowing wave lines
  | 'grid'           // Simple grid
  | 'hexagons'       // Tech hexagon pattern
  | 'topography'     // Organic topographic lines
  | 'circuit'        // Tech circuit board
  | 'diamonds'       // Luxury diamond pattern
  | 'moroccan'       // Spa/beauty pattern
  | 'plus'           // Medical plus signs
  | 'noise'          // Subtle grain texture
  | 'crosshatch'     // Cross-hatch lines

export type PatternPosition =
  | 'full'           // Cover entire section
  | 'left'           // Only left side (like plasturi)
  | 'right'          // Only right side
  | 'top-left'       // Corner positioning
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'         // Centered, fade to edges

export type PatternColor = 'primary' | 'accent' | 'dark' | 'light' | 'white' | 'black' | 'current'

export interface SectionPatternProps {
  type: PatternType
  position?: PatternPosition
  opacity?: number // 0.01 to 0.5
  color?: PatternColor
  className?: string
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Bubble base positions - carefully placed for organic, professional look
const BUBBLE_BASE_POSITIONS = [
  { cx: 50, cy: 80, r: 80 },
  { cx: 120, cy: 200, r: 60 },
  { cx: 30, cy: 350, r: 100 },
  { cx: 150, cy: 500, r: 45 },
  { cx: 80, cy: 650, r: 70 },
  { cx: 180, cy: 150, r: 35 },
  { cx: 200, cy: 400, r: 55 },
  { cx: 60, cy: 800, r: 90 },
  { cx: 140, cy: 900, r: 40 },
  { cx: 100, cy: 1050, r: 75 },
] as const

// Size multipliers for pattern scaling
const SIZE_MULTIPLIERS = {
  sm: 0.6,
  md: 1,
  lg: 1.4,
} as const

// Generate organic bubbles/circles pattern (like plasturi.ro)
const BubblesPattern: React.FC<{ color: string; size: 'sm' | 'md' | 'lg'; gradientId: string }> = ({
  color,
  size,
  gradientId,
}) => {
  const sizeMultiplier = SIZE_MULTIPLIERS[size]

  const bubbles = useMemo(() =>
    BUBBLE_BASE_POSITIONS.map(b => ({
      cx: b.cx,
      cy: b.cy,
      r: b.r * sizeMultiplier,
    })),
    [sizeMultiplier]
  )

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 250 1200"
      preserveAspectRatio="xMinYMin slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="30%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {bubbles.map((bubble, i) => (
        <circle
          key={i}
          cx={bubble.cx}
          cy={bubble.cy}
          r={bubble.r}
          fill={`url(#${gradientId})`}
        />
      ))}
    </svg>
  )
}

// Seeded random number generator for consistent SSR/client rendering
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Pre-generated dot positions for consistent rendering (avoids hydration mismatch)
const generateDotPositions = (dotSize: number) => {
  const dots: { x: number; y: number; r: number; opacity: number }[] = []
  let seed = 12345 // Fixed seed for consistency

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      seed++
      if (seededRandom(seed) > 0.6) {
        seed++
        const offsetX = seededRandom(seed) * 20 - 10
        seed++
        const offsetY = seededRandom(seed) * 20 - 10
        seed++
        const radiusMultiplier = 0.5 + seededRandom(seed) * 0.5
        seed++
        const opacity = 0.3 + seededRandom(seed) * 0.4

        dots.push({
          x: i * 50 + offsetX,
          y: j * 50 + offsetY,
          r: dotSize * radiusMultiplier,
          opacity,
        })
      }
    }
  }
  return dots
}

// Floating dots pattern - scattered with seeded randomization
const FloatingDotsPattern: React.FC<{ color: string; size: 'sm' | 'md' | 'lg' }> = ({ color, size }) => {
  const dotSize = SIZE_MULTIPLIERS[size] * 5

  // Memoize dots to prevent recalculation on every render
  const dots = useMemo(() => generateDotPositions(dotSize), [dotSize])

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={color}
          opacity={dot.opacity}
        />
      ))}
    </svg>
  )
}

// Flowing waves pattern
const WavesPattern: React.FC<{ color: string }> = ({ color }) => (
  <svg
    className="w-full h-full"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeWidth="2"
      d="M0,160 C320,220 420,100 720,160 C1020,220 1120,100 1440,160"
    />
    <path
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.5"
      d="M0,200 C320,260 420,140 720,200 C1020,260 1120,140 1440,200"
    />
    <path
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
      d="M0,240 C320,300 420,180 720,240 C1020,300 1120,180 1440,240"
    />
  </svg>
)

// Topography lines pattern (modern, organic)
const TopographyPattern: React.FC<{ color: string; patternId: string }> = ({ color, patternId }) => (
  <svg
    className="w-full h-full"
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id={patternId} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path
          fill="none"
          stroke={color}
          strokeWidth="1"
          d="M25,0 Q50,25 25,50 T25,100"
        />
        <path
          fill="none"
          stroke={color}
          strokeWidth="1"
          d="M75,0 Q50,25 75,50 T75,100"
        />
        <path
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          d="M0,25 Q25,50 0,75"
        />
        <path
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          d="M100,25 Q75,50 100,75"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
  </svg>
)

// Map color prop to actual color value
const getColorValue = (color: PatternColor): string => {
  switch (color) {
    case 'primary':
      return 'var(--theme-primary)'
    case 'accent':
      return 'var(--theme-accent)'
    case 'dark':
      return 'var(--theme-dark)'
    case 'light':
      return 'var(--theme-light)'
    case 'white':
      return '#ffffff'
    case 'black':
      return '#000000'
    case 'current':
    default:
      return 'currentColor'
  }
}

// Get position styles
const getPositionStyles = (position: PatternPosition): string => {
  switch (position) {
    case 'left':
      return 'w-1/3 md:w-1/4 left-0 top-0 bottom-0'
    case 'right':
      return 'w-1/3 md:w-1/4 right-0 top-0 bottom-0'
    case 'top-left':
      return 'w-1/2 h-1/2 left-0 top-0'
    case 'top-right':
      return 'w-1/2 h-1/2 right-0 top-0'
    case 'bottom-left':
      return 'w-1/2 h-1/2 left-0 bottom-0'
    case 'bottom-right':
      return 'w-1/2 h-1/2 right-0 bottom-0'
    case 'center':
      return 'inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]'
    case 'full':
    default:
      return 'inset-0'
  }
}

// Get CSS class for simple patterns
const getPatternClass = (type: PatternType): string | null => {
  switch (type) {
    case 'grid':
      return 'pattern-grid'
    case 'hexagons':
      return 'pattern-hexagons'
    case 'circuit':
      return 'pattern-circuit'
    case 'diamonds':
      return 'pattern-diamonds'
    case 'moroccan':
      return 'pattern-moroccan'
    case 'plus':
      return 'pattern-plus'
    case 'noise':
      return 'pattern-noise'
    case 'crosshatch':
      return 'pattern-crosshatch'
    default:
      return null
  }
}

export const SectionPattern: React.FC<SectionPatternProps> = ({
  type,
  position = 'full',
  opacity = 0.08,
  color = 'primary',
  className,
  animated = false,
  size = 'md',
}) => {
  // Generate unique ID for SVG gradients/patterns to avoid conflicts
  const uniqueId = useId()
  const colorValue = getColorValue(color)
  const positionStyles = getPositionStyles(position)
  const patternClass = getPatternClass(type)

  // Add fade gradient for partial positions
  const fadeGradient = position === 'left'
    ? '[mask-image:linear-gradient(to_right,black_60%,transparent_100%)]'
    : position === 'right'
    ? '[mask-image:linear-gradient(to_left,black_60%,transparent_100%)]'
    : position.includes('top')
    ? '[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]'
    : position.includes('bottom')
    ? '[mask-image:linear-gradient(to_top,black_60%,transparent_100%)]'
    : ''

  // Animation class
  const animationClass = animated ? 'animate-pulse-slow' : ''

  // For CSS-based patterns (simpler, repeating)
  if (patternClass) {
    return (
      <div
        className={cn(
          'pattern-layer absolute pointer-events-none',
          positionStyles,
          fadeGradient,
          patternClass,
          animationClass,
          className
        )}
        style={{
          opacity,
          color: colorValue,
        }}
        aria-hidden="true"
      />
    )
  }

  // For SVG-based patterns (complex, organic)
  const renderPattern = () => {
    switch (type) {
      case 'bubbles':
        return <BubblesPattern color={colorValue} size={size} gradientId={`bubble-${uniqueId}`} />
      case 'floating-dots':
        return <FloatingDotsPattern color={colorValue} size={size} />
      case 'waves':
        return <WavesPattern color={colorValue} />
      case 'topography':
        return <TopographyPattern color={colorValue} patternId={`topo-${uniqueId}`} />
      case 'diagonal-lines':
        return (
          <div
            className="w-full h-full pattern-diagonal-flowing"
            style={{ color: colorValue }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'pattern-layer absolute pointer-events-none overflow-hidden',
        positionStyles,
        fadeGradient,
        animationClass,
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      {renderPattern()}
    </div>
  )
}

export default SectionPattern
