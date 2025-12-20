# Plasturi Design - Ghid de Implementare Rapidă

## Quick Reference pentru Template-5

**Bazat pe:** Analiza completă plasturifototerapeutici.ro
**Pentru:** Dezvoltatori care vor să implementeze rapid pattern-urile identificate

---

## 1. COMPONENTE PRINCIPALE

### VideoHeroSection Component

```tsx
// src/components/sections/VideoHeroSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface VideoHeroProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  trustBadges?: {
    src: string;
    alt: string;
  }[];
}

export function VideoHeroSection({
  videoSrc,
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  trustBadges
}: VideoHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-[rgba(2,40,61,0.5)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight text-white/95 mb-6">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-4">
            {subtitle}
          </p>

          <p className="text-base md:text-lg text-white/80 mb-8">
            {description}
          </p>

          {/* Trust Badges */}
          {trustBadges && trustBadges.length > 0 && (
            <div className="flex gap-4 mb-8">
              {trustBadges.map((badge, index) => (
                <img
                  key={index}
                  src={badge.src}
                  alt={badge.alt}
                  className="h-24 w-auto drop-shadow-lg hover:scale-105 transition-transform"
                />
              ))}
            </div>
          )}

          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-pill px-8 shadow-glow-blue"
          >
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Usage:**
```tsx
<VideoHeroSection
  videoSrc="/videos/hero-background.mp4"
  title="Redescoperă energia cu Plasturii Fototerapeutici"
  subtitle="Activează regenerarea naturală și ameliorează durerile rapid"
  description="Simte claritate, vitalitate și mai multă energie zi de zi!"
  ctaText="Descoperă Mai Mult"
  ctaLink="#features"
  trustBadges={[
    { src: '/badges/patent.png', alt: 'Patent Approved' },
    { src: '/badges/guarantee.png', alt: '30 Day Money Back' }
  ]}
/>
```

---

### TwoColumnSection Component

```tsx
// src/components/sections/TwoColumnSection.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface TwoColumnSectionProps {
  imagePosition?: 'left' | 'right';
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  content: string | React.ReactNode;
  className?: string;
}

export function TwoColumnSection({
  imagePosition = 'left',
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  content,
  className
}: TwoColumnSectionProps) {
  return (
    <section className={cn("py-20 lg:py-32", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className={cn(
            "order-2",
            imagePosition === 'left' ? "lg:order-1" : "lg:order-2"
          )}>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          {/* Text Column */}
          <div className={cn(
            "order-1",
            imagePosition === 'left' ? "lg:order-2" : "lg:order-1"
          )}>
            {eyebrow && (
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                {eyebrow}
              </p>
            )}

            <h2 className="text-3xl md:text-4xl font-normal mb-6">
              {title}
            </h2>

            {typeof content === 'string' ? (
              <p className="text-lg leading-relaxed text-gray-700">
                {content}
              </p>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Usage:**
```tsx
<TwoColumnSection
  imagePosition="left"
  imageSrc="/images/technology.jpg"
  imageAlt="Cum functionează tehnologia"
  eyebrow="Urmărește videoclipul ~1:30 minute"
  title="Cum functionează tehnologia patentata cu lumina?"
  content={
    <div className="space-y-4">
      <p>Când aplici un plasture X39 pe corp...</p>
      <p>Lumina se conectează la propriul flux...</p>
      <p>Acest proces, denumit fotobiomodulare...</p>
    </div>
  }
/>
```

---

### ProcessSteps Component

```tsx
// src/components/sections/ProcessSteps.tsx
import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface ProcessStepsProps {
  steps: Step[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="space-y-20">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.number}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                {/* Text - Right on even, Left on odd */}
                <div className={cn(
                  isEven ? "lg:text-right lg:order-1" : "lg:order-2"
                )}>
                  <h6 className="text-sm font-semibold text-blue-600 uppercase mb-2">
                    Pasul {step.number}: {step.title}
                  </h6>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Image - Left on even, Right on odd */}
                <div className={cn(
                  isEven ? "lg:order-2" : "lg:order-1"
                )}>
                  <div className="relative">
                    <img
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      className="w-full rounded-xl shadow-lg"
                    />
                    {/* Optional: Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mix-blend-multiply" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Usage:**
```tsx
<ProcessSteps
  steps={[
    {
      number: 1,
      title: "Aplică",
      description: "Aplică un plasture într-un anumit punct de pe corp...",
      imageSrc: "/images/step1.png",
      imageAlt: "Aplicare plasture"
    },
    {
      number: 2,
      title: "Activează",
      description: "Activat de căldura corpului, plasturele reflectă...",
      imageSrc: "/images/step2.png",
      imageAlt: "Activare tehnologie"
    },
    {
      number: 3,
      title: "Stimulează",
      description: "Lungimile de undă specifice ale luminii stimulează...",
      imageSrc: "/images/step3.png",
      imageAlt: "Stimulare celulară"
    }
  ]}
/>
```

---

### BenefitCards Component

```tsx
// src/components/sections/BenefitCards.tsx
import React from 'react';

interface Benefit {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

interface BenefitCardsProps {
  title: string;
  subtitle?: string;
  benefits: Benefit[];
}

export function BenefitCards({ title, subtitle, benefits }: BenefitCardsProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={benefit.imageSrc}
                  alt={benefit.imageAlt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### FloatingCTA Component

```tsx
// src/components/ui/FloatingCTA.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface FloatingCTAProps {
  text: string;
  href: string;
  showOnMobile?: boolean;
}

export function FloatingCTA({
  text,
  href,
  showOnMobile = true
}: FloatingCTAProps) {
  return (
    <div className={showOnMobile ? "lg:hidden" : ""}>
      <Button
        asChild
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-pill px-7 py-3 shadow-glow-purple animate-pulse-glow"
      >
        <a href={href}>{text}</a>
      </Button>
    </div>
  );
}
```

**Usage:**
```tsx
<FloatingCTA
  text="Aboneaza-te Acum"
  href="/subscribe"
  showOnMobile={true}
/>
```

---

### TimelineSection Component

```tsx
// src/components/sections/TimelineSection.tsx
import React from 'react';

interface Milestone {
  timeframe: string;
  label: string;
  description: string;
}

interface TimelineSectionProps {
  title: string;
  subtitle: string;
  milestones: Milestone[];
  conclusion?: {
    quote: string;
    author: string;
    role: string;
  };
}

export function TimelineSection({
  title,
  subtitle,
  milestones,
  conclusion
}: TimelineSectionProps) {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
            {subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-white">
            {title}
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto space-y-12">
          {milestones.map((milestone, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="relative">
                {/* Milestone Content */}
                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
                  isEven ? "md:text-right" : ""
                )}>
                  {/* Timeframe - Left on even, Right on odd */}
                  <div className={cn(
                    isEven ? "md:order-1" : "md:order-2"
                  )}>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {milestone.timeframe}
                    </h3>
                  </div>

                  {/* Description - Right on even, Left on odd */}
                  <div className={cn(
                    isEven ? "md:order-2" : "md:order-1"
                  )}>
                    <p className="text-white/80 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line (except last item) */}
                {index < milestones.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="w-px h-16 bg-gradient-to-b from-purple-500 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conclusion Quote */}
        {conclusion && (
          <div className="mt-20 text-center max-w-2xl mx-auto">
            <blockquote className="text-2xl font-normal text-white italic mb-4">
              "{conclusion.quote}"
            </blockquote>
            <cite className="not-italic">
              <p className="text-white/90 font-semibold">
                {conclusion.author}
              </p>
              <p className="text-white/70 text-sm">
                {conclusion.role}
              </p>
            </cite>
          </div>
        )}
      </div>
    </section>
  );
}
```

**Usage:**
```tsx
<TimelineSection
  title="Rezultate pe Termen Lung X39"
  subtitle="CONFORM STUDIILOR DE CAZ"
  milestones={[
    {
      timeframe: "Primele zile",
      label: "4.000 de gene",
      description: "4.000 de gene încep să se reseteze"
    },
    {
      timeframe: "În decurs de 6 săptămâni",
      label: "Echilibru cerebral",
      description: "Creierul devine echilibrat"
    },
    // ... more milestones
  ]}
  conclusion={{
    quote: "NU ESTE ANTI-ÎMBĂTRÂNIRE, ESTE INVERSAREA VÂRSTEI.",
    author: "David Schmidt",
    role: "CEO, Inventatorul Lifewave"
  }}
/>
```

---

## 2. STILURI GLOBALE

### Tailwind Config Extensions

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#116DFF',
          light: '#3D89FF',
          dark: '#0D58CC',
        },
        accent: {
          purple: {
            DEFAULT: '#8B5CF6',
            light: '#A855F7',
            dark: '#7C3AED',
          },
          teal: {
            DEFAULT: '#0D9488',
            dark: '#0F766E',
          },
        },
      },
      borderRadius: {
        pill: '24px',
      },
      boxShadow: {
        'glow-blue': '0 4px 20px rgba(17, 109, 255, 0.25)',
        'glow-purple': '0 4px 20px rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)'
          },
          '50%': {
            boxShadow: '0 4px 28px rgba(139, 92, 246, 0.6)'
          },
        },
      },
    },
  },
};

export default config;
```

### Global CSS Utilities

```css
/* src/app/globals.css */

/* Custom utility classes */
@layer utilities {
  .hover-lift {
    @apply transition-all duration-300;
  }

  .hover-lift:hover {
    @apply -translate-y-2 shadow-xl;
  }

  .text-balance {
    text-wrap: balance;
  }

  .bg-overlay-dark {
    background: rgba(2, 40, 61, 0.5);
  }

  .gradient-overlay {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }
}

/* Custom scrollbar */
@layer base {
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }
}
```

---

## 3. BUTTON VARIANTS

### Button Component Extensions

```tsx
// src/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md',

        // Plasturi-style variants
        'pill-white': 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-pill shadow-glow-blue',
        'pill-purple': 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-pill shadow-glow-purple',
        'pill-teal': 'bg-accent-teal text-white hover:bg-accent-teal-dark rounded-lg',

        outline: 'border-2 border-accent-teal text-accent-teal hover:bg-accent-teal hover:text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

**Usage:**
```tsx
<Button variant="pill-white" size="lg">
  Descoperă Mai Mult
</Button>

<Button variant="pill-purple" size="xl" className="animate-pulse-glow">
  Aboneaza-te Acum
</Button>

<Button variant="pill-teal" size="default">
  Download PDF
</Button>
```

---

## 4. LAYOUT HELPERS

### Container Component

```tsx
// src/components/layout/Container.tsx
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1440px]',
  full: 'max-w-full',
};

export function Container({
  children,
  className,
  size = 'lg'
}: ContainerProps) {
  return (
    <div className={cn(
      'container mx-auto px-4 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}
```

### Section Component

```tsx
// src/components/layout/Section.tsx
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'dark' | 'gradient';
  spacing?: 'sm' | 'md' | 'lg';
}

const bgClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gradient-to-b from-slate-800 to-slate-900',
  gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
};

const spacingClasses = {
  sm: 'py-12 lg:py-16',
  md: 'py-16 lg:py-24',
  lg: 'py-20 lg:py-32',
};

export function Section({
  children,
  className,
  background = 'white',
  spacing = 'lg'
}: SectionProps) {
  return (
    <section className={cn(
      bgClasses[background],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </section>
  );
}
```

**Usage:**
```tsx
<Section background="gray" spacing="lg">
  <Container size="lg">
    {/* Section content */}
  </Container>
</Section>
```

---

## 5. RESPONSIVE PATTERNS

### Mobile-First Grid

```tsx
// Example usage patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* 1 col mobile, 2 cols tablet, 3 cols desktop */}
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  {/* 1 col mobile/tablet, 2 cols desktop */}
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {/* 2 cols mobile, 4 cols tablet+ */}
</div>
```

### Typography Scaling

```tsx
// Heading examples
<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
  {/* Scales from 36px → 48px → 60px → 72px */}
</h1>

<h2 className="text-3xl md:text-4xl lg:text-5xl">
  {/* Scales from 30px → 36px → 48px */}
</h2>

<p className="text-base md:text-lg">
  {/* Scales from 16px → 18px */}
</p>
```

### Spacing Scale

```tsx
// Section padding
<section className="py-12 md:py-16 lg:py-20 xl:py-32">

// Element gaps
<div className="space-y-4 md:space-y-6 lg:space-y-8">

// Grid gaps
<div className="gap-6 md:gap-8 lg:gap-12">
```

---

## 6. ANIMATION EXAMPLES

### Hover Effects

```tsx
// Lift on hover
<div className="hover:-translate-y-2 transition-transform duration-300">

// Scale on hover
<img className="hover:scale-105 transition-transform duration-300" />

// Glow on hover
<button className="hover:shadow-glow-blue transition-shadow duration-300">

// Color shift on hover
<a className="text-gray-700 hover:text-blue-600 transition-colors">
```

### Entrance Animations (cu Intersection Observer)

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function FadeInOnScroll({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      )}
    >
      {children}
    </div>
  );
}
```

---

## 7. PERFORMANCE TIPS

### Image Optimization

```tsx
import Image from 'next/image';

// Use Next.js Image component
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority // For above-fold images
  className="rounded-2xl"
/>

// Lazy load below-fold images
<Image
  src="/images/feature.jpg"
  alt="Feature"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Video Loading

```tsx
<video
  className="absolute inset-0 w-full h-full object-cover"
  autoPlay
  muted
  loop
  playsInline
  preload="metadata" // Only load metadata initially
  poster="/images/video-poster.jpg" // Placeholder image
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
```

---

## 8. ACCESSIBILITY

### Focus States

```css
/* Add to global CSS */
@layer base {
  *:focus-visible {
    @apply outline-none ring-2 ring-blue-500 ring-offset-2;
  }

  button:focus-visible,
  a:focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2;
  }
}
```

### Aria Labels

```tsx
<button aria-label="Close menu">
  <XIcon />
</button>

<section aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
  {/* ... */}
</section>
```

### Skip Links

```tsx
// Add to layout
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-50"
>
  Skip to main content
</a>
```

---

## 9. QUICK START TEMPLATE

### Page Example

```tsx
// app/energie-terapeutice/page.tsx
import { VideoHeroSection } from '@/components/sections/VideoHeroSection';
import { TwoColumnSection } from '@/components/sections/TwoColumnSection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BenefitCards } from '@/components/sections/BenefitCards';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { FloatingCTA } from '@/components/ui/FloatingCTA';

export default function EnergieTerapeuticePage() {
  return (
    <>
      {/* Hero */}
      <VideoHeroSection
        videoSrc="/videos/hero-energie.mp4"
        title="Redescoperă energia cu Terapii Energetice"
        subtitle="Activează regenerarea naturală"
        description="Simte claritate și vitalitate!"
        ctaText="Descoperă Mai Mult"
        ctaLink="#features"
        trustBadges={[
          { src: '/badges/certified.png', alt: 'Certified' },
          { src: '/badges/guarantee.png', alt: '30 Day Guarantee' }
        ]}
      />

      {/* How It Works */}
      <TwoColumnSection
        imagePosition="right"
        imageSrc="/images/technology.jpg"
        imageAlt="Tehnologie avansată"
        eyebrow="Urmărește videoclipul"
        title="Cum functionează tehnologia?"
        content="Explicație detaliată despre tehnologie..."
      />

      {/* Process Steps */}
      <ProcessSteps
        steps={[
          {
            number: 1,
            title: "Aplică",
            description: "Aplică pe zona dorită...",
            imageSrc: "/images/step1.jpg",
            imageAlt: "Aplicare"
          },
          // ... more steps
        ]}
      />

      {/* Benefits */}
      <BenefitCards
        title="Beneficii Imediate"
        benefits={[
          {
            imageSrc: "/images/benefit1.jpg",
            imageAlt: "Energie",
            title: "Energie crescută",
            description: "Simte o creștere imediată..."
          },
          // ... more benefits
        ]}
      />

      {/* Timeline */}
      <TimelineSection
        title="Rezultate pe Termen Lung"
        subtitle="STUDII DE CAZ"
        milestones={[
          {
            timeframe: "Primele zile",
            label: "Activare",
            description: "Proces de activare începe..."
          },
          // ... more milestones
        ]}
        conclusion={{
          quote: "Transformare completă a stării de sănătate",
          author: "Dr. Expert",
          role: "Specialist în terapii energetice"
        }}
      />

      {/* Floating CTA (Mobile) */}
      <FloatingCTA
        text="Programează Consult"
        href="/contact"
      />
    </>
  );
}
```

---

## 10. CHECKLIST IMPLEMENTARE

### Design System
- [ ] Configurare Tailwind cu theme colors
- [ ] Adăugare custom utilities în globals.css
- [ ] Configurare font family (Inter sau Poppins)
- [ ] Setup shadcn/ui Button cu variante custom

### Componente Core
- [ ] VideoHeroSection
- [ ] TwoColumnSection
- [ ] ProcessSteps
- [ ] BenefitCards
- [ ] TimelineSection
- [ ] FloatingCTA
- [ ] Container și Section layouts

### Features
- [ ] Lazy loading pentru imagini
- [ ] Video optimization cu poster images
- [ ] Intersection Observer pentru animations
- [ ] Mobile responsive testing
- [ ] Accessibility audit (contrast, focus states)

### Performance
- [ ] Next.js Image optimization
- [ ] Video compression și formats
- [ ] Code splitting pentru heavy components
- [ ] Lighthouse audit (90+ score target)

---

**Fin.**

Acest ghid oferă tot ce e necesar pentru a implementa rapid design pattern-urile identificate în analiza completă.
