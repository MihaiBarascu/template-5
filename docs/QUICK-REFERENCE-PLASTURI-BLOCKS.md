# Quick Reference: Plasturi Design Blocks

One-page reference for using Plasturi-style premium blocks in template-5.

---

## PREMIUM BLOCKS (Plasturi Design)

### 1. VideoHero - Fullscreen Video Background
```typescript
{
  blockType: 'video-hero',
  videoSource: 'url',                    // or 'upload'
  videoUrl: '/videos/hero.mp4',
  overlayColor: 'rgba(26, 26, 46, 0.6)',
  overlayOpacity: 60,
  headline: 'Your Main Message',
  subheadline: 'Supporting text',
  ctaButtons: [
    { label: 'Primary CTA', link: '/contact', variant: 'primary', pillShape: true },
    { label: 'Secondary', link: '/about', variant: 'secondary', pillShape: true },
  ],
  textAlignment: 'left',                 // left/center/right
  height: 'fullscreen',                  // fullscreen/large/medium
  showScrollIndicator: true,
}
```

**Use When:** High-impact hero for homepage, landing pages
**Business Types:** fitness, restaurant, wellness, tech, auto

---

### 2. ProcessSteps - How It Works / Benefits
```typescript
{
  blockType: 'process-steps',
  variant: 'zigzag',                     // zigzag/timeline/horizontal/grid/carousel
  heading: 'How It Works',
  subheading: 'Simple process description',
  steps: [
    {
      title: 'Step 1: Start',
      description: 'Detailed explanation',
      icon: 'ClipboardCheck',            // or image: imageId
      badge: 'Step 1',
    },
    // ... more steps
  ],
  showNumbers: true,
  showConnectors: true,
  imagePosition: 'right',                // For zigzag: which side starts
  ctaButton: {
    enabled: true,
    label: 'Get Started',
    link: '/contact',
  },
  backgroundColor: 'light',
}
```

**Variants:**
- `zigzag` - Alternating left-right (best for 3-4 steps)
- `timeline` - Vertical with dates/milestones
- `horizontal` - Cards in a row
- `grid` - 2x2 or 3x3 grid
- `carousel` - Horizontal scrolling (best for 6+ benefits)

**Use When:** Explaining process, showcasing benefits
**Business Types:** ALL (most versatile block)

---

### 3. PricingKits - Product/Service Packages
```typescript
{
  blockType: 'pricing-kits',
  variant: 'cards-image',                // cards/cards-image/compact/highlighted
  heading: 'Pricing Packages',
  subheading: 'DISCOUNT 30-50%',
  kits: [
    {
      name: 'Starter Kit',
      price: 1645,
      priceLabel: 'lei (TVA inclus)',
      description: 'Perfect for beginners',
      badge: 'popular',                  // popular/best-value/new/none
      features: [
        { text: 'Feature 1', included: true },
        { text: 'Feature 2', included: true },
        { text: 'Feature 3', included: false },
      ],
      cta: { label: 'Order Now', link: '/order' },
      image: kitImageId,                 // Optional
    },
    // ... more kits
  ],
  backgroundColor: 'default',
}
```

**Use When:** Multiple pricing tiers, product bundles
**Business Types:** ecommerce, courses, memberships, SaaS

---

### 4. TrustBadges - Certifications & Guarantees
```typescript
{
  blockType: 'trust-badges',
  variant: 'minimal',                    // minimal/detailed/icons-only
  presets: ['certified', 'non-invasive', 'money-back-30'],
  backgroundColor: 'default',
}
```

**Available Presets:**
- `certified` - Certified professional
- `non-invasive` - Non-invasive treatment
- `money-back-30` - 30-day money-back guarantee
- `patented` - Patented technology

**Custom Badges:**
```typescript
customBadges: [
  { icon: 'Award', text: 'ISO Certified', subtext: 'Since 2020' },
]
```

**Use When:** Building credibility, trust signals
**Business Types:** medical, legal, wellness, ecommerce

---

### 5. Timeline - Company History / Results
```typescript
{
  blockType: 'timeline',
  variant: 'vertical-alternating',       // vertical/horizontal/vertical-alternating
  heading: 'Our Journey',
  subheading: 'Over a decade of excellence',
  events: [
    {
      year: '2015',
      title: 'Company Founded',
      description: 'Started with a vision...',
      icon: 'Lightbulb',
    },
    // ... more events
  ],
  showConnector: true,
  backgroundColor: 'light',
  conclusion: {
    enabled: true,
    quote: 'Every journey starts with a single step.',
    author: 'Founder Name',
    role: 'CEO',
  },
}
```

**Use When:** Company history, results timeline, milestones
**Business Types:** wellness, fitness, coaching, corporate

---

### 6. DownloadLinks - PDF Guides & Resources
```typescript
{
  blockType: 'download-links',
  variant: 'buttons',                    // buttons/list/grid
  links: [
    {
      label: 'Download Product Guide',
      linkType: 'external',
      url: '/pdfs/guide.pdf',
      icon: 'pdf',                       // Auto-detected or manual
      openInNewTab: true,
    },
  ],
  alignment: 'center',                   // left/center/right
  backgroundColor: 'default',
}
```

**Use When:** Offering downloadable resources
**Business Types:** education, consulting, legal, medical

---

### 7. Newsletter - GDPR Compliant Subscription
```typescript
{
  blockType: 'newsletter',
  variant: 'with-pattern',               // simple/with-image/dark/with-pattern
  heading: 'Subscribe to Newsletter',
  subheading: 'Get tips and exclusive offers',
  placeholder: 'Your email address',
  buttonText: 'Subscribe',
  successMessage: 'Successfully subscribed!',

  // GDPR Compliance
  requireConsent: true,
  consentText: 'I agree to receive newsletter and accept privacy policy.',
  privacyText: 'Your data is safe. We don\'t spam.',
  showPrivacyLink: true,

  // Benefits
  benefits: [
    { text: 'Weekly health tips' },
    { text: 'Exclusive course discounts' },
    { text: 'Latest news' },
  ],

  // Pattern (for with-pattern variant)
  pattern: {
    enabled: true,
    type: 'bubbles',                     // bubbles/dots/waves/lines
    position: 'left',                    // left/right/both
    color: 'white',
    opacity: '40',
    size: 'lg',                          // sm/md/lg
    animated: false,
  },
}
```

**Use When:** Email list building (required for EU businesses)
**Business Types:** ALL

---

## GLOBAL WIDGETS

### FloatingCTA - Sticky Call-to-Action Button

**Configure in BusinessInfo global:**
```typescript
floatingCta: {
  enabled: true,
  text: 'Subscribe Now',
  href: '/contact',
  variant: 'gradient',                   // solid/gradient/outline
  icon: 'arrow',                         // arrow/sparkles/heart/phone/mail/star
  position: 'bottom-center',             // bottom-right/left/center, right-center, top-right
  shape: 'rectangle',                    // rectangle/pill
  showOnMobile: true,
  pulseAnimation: true,
  dismissible: false,                    // Show close button?
  showAfterScroll: 300,                  // Pixels before showing
}
```

**Positions:**
- `bottom-right` - Classic position (Plasturi style)
- `bottom-left` - Mirror of right
- `bottom-center` - Full-width bar at bottom
- `right-center` - Vertical tab on right edge
- `top-right` - Notification style

---

## HEADER CONFIGURATION

### Transparent Header with TopBar (Plasturi Style)

```typescript
// In seedHeader() call:
await seedHeader(payload, {
  variant: 'full-width',                 // Full-width without container
  isTransparent: true,                   // Overlay on VideoHero
  transparentTextColor: 'white',         // Text color when transparent
  navItems: [...],
  ctaButton: { enabled: false },         // No CTA in header
  topBar: {
    backgroundColor: 'dark',
    layout: 'social-left',               // social-left/center/right
    showPhone: true,
    showEmail: true,
    showSocial: true,
    showWorkingHours: false,
    customText: '',                      // Optional custom message
  },
})
```

**When to use transparent:**
- With VideoHero fullscreen
- With image hero with dark overlay
- For modern, overlay-style design

---

## THEME CONFIGURATION

### Plasturi Design System

```typescript
// In seedSiteTheme() call:
await seedSiteTheme(payload, {
  variant: 'revital-harmony',            // Gold/Navy for wellness

  // Typography
  headingFont: 'Prompt',                 // Plasturi font
  bodyFont: 'Open_Sans',
  headingWeight: '400',                  // Light weight for flat look
  headingScale: 'small',                 // Smaller headings
  bodyTextSize: 'large',                 // Bigger body text

  // Layout
  borderRadius: 'medium',
  shadows: 'none',                       // Flat design
  sectionSpacing: 'spacious',
  cardGap: 'spacious',

  // Buttons
  useCustomButtons: true,
  buttonRounding: 'pill',                // 24px rounded
  buttonTextTransform: 'none',
  buttonFontWeight: '500',
  buttonPadding: 'normal',

  // Animations
  animations: 'moderate',                // smooth transitions

  // Colors (optional override)
  useCustomColors: true,
  colors: {
    primary: '#FFE468',                  // Gold
    secondary: '#272630',                // Navy
    accent: '#FFE468',
    // ... rest auto-filled
  },
})
```

---

## COMMON PATTERNS

### Pattern 1: Full Plasturi Homepage
```typescript
const layout = [
  { blockType: 'video-hero', ... },      // Hero
  { blockType: 'trust-badges', ... },    // Trust signals
  { blockType: 'team', variant: 'featured' },  // About
  { blockType: 'process-steps', variant: 'zigzag' },  // How it works
  { blockType: 'download-links', ... },  // Resources
  { blockType: 'services', variant: 'grid-3' },  // Services
  { blockType: 'stats', ... },           // Achievements
  { blockType: 'timeline', ... },        // History
  { blockType: 'testimonials', variant: 'carousel' },  // Social proof
  { blockType: 'videoGallery', ... },    // Video testimonials
  { blockType: 'faq', ... },             // Questions
  { blockType: 'contact', ... },         // Contact form
  { blockType: 'process-steps', variant: 'carousel' },  // Benefits
  { blockType: 'newsletter', variant: 'with-pattern' },  // Subscribe
  { blockType: 'cta', ... },             // Final CTA
]
```

### Pattern 2: Service Landing Page
```typescript
const layout = [
  { blockType: 'video-hero', height: 'medium' },
  { blockType: 'trust-badges', presets: ['certified', 'money-back-30'] },
  { blockType: 'process-steps', variant: 'zigzag' },
  { blockType: 'pricing-kits', ... },
  { blockType: 'faq', ... },
  { blockType: 'testimonials', variant: 'carousel' },
  { blockType: 'cta', ... },
]
```

### Pattern 3: About Page
```typescript
const layout = [
  { blockType: 'video-hero', height: 'medium' },
  { blockType: 'team', variant: 'featured' },
  { blockType: 'stats', ... },
  { blockType: 'timeline', variant: 'vertical-alternating' },
  { blockType: 'process-steps', variant: 'grid' },  // Certifications
  { blockType: 'testimonials', ... },
  { blockType: 'cta', ... },
]
```

---

## BUSINESS TYPE RECOMMENDATIONS

### Wellness / Healing (terapii-energetice)
- VideoHero ✅
- ProcessSteps (zigzag + carousel) ✅
- Timeline ✅
- Trust badges ✅
- Download links ✅
- Newsletter with GDPR ✅

### Fitness Gym
- VideoHero ✅
- ProcessSteps (grid for programs) ✅
- PricingKits (memberships) ✅
- Stats (results) ✅
- Video testimonials ✅

### Restaurant
- VideoHero (food preparation) ✅
- ProcessSteps (ordering process) ⚠️
- Timeline (chef experience) ⚠️
- Gallery (food photos) ✅

### Ecommerce / Shop
- VideoHero (product demo) ✅
- PricingKits (bundles) ✅
- Trust badges ✅
- Process steps (delivery) ✅

### Professional Services (dentist, avocat)
- Hero (minimal or image) ⚠️
- ProcessSteps (consultation process) ✅
- Timeline (experience) ✅
- Trust badges (certifications) ✅
- Download links (forms) ✅

---

## TESTING CHECKLIST

Before going live with Plasturi blocks:

- [ ] VideoHero plays on mobile (fallback to poster)
- [ ] ProcessSteps carousel scrolls smoothly
- [ ] Newsletter GDPR checkbox validates
- [ ] FloatingCTA appears after scroll
- [ ] TrustBadges display correctly
- [ ] Timeline conclusion quote shows
- [ ] PricingKits features checkmarks visible
- [ ] All CTAs link to correct pages
- [ ] Mobile responsive (test on phone)
- [ ] Build passes: `pnpm build`

---

## COMMON ISSUES & FIXES

### Video doesn't play
- Check video format (MP4 H.264 recommended)
- Add `videoPoster` for fallback
- Verify URL is accessible
- Mobile: autoplay muted only

### Transparent header not working
- Set `isTransparent: true` in header config
- Add VideoHero as first block
- Set `transparentTextColor: 'white'`

### Newsletter not saving
- Check `NewsletterSubscribers` collection exists
- Verify GDPR checkbox if required
- Check email validation

### FloatingCTA not appearing
- Set `enabled: true` in BusinessInfo
- Check `showAfterScroll` value
- Verify link is valid

---

## PERFORMANCE TIPS

1. **Video Optimization**
   - Use MP4 H.264 codec
   - Max 1920x1080 resolution
   - Compress with HandBrake (CRF 23)
   - File size: < 5MB for autoplay

2. **Images**
   - Upload at correct size (don't rely on browser resize)
   - Use WebP format when possible
   - Trust badges: max 200x200px

3. **Carousels**
   - Max 8-10 items for smooth performance
   - Use native scroll-snap (no JS library)

4. **Animations**
   - Use `animations: 'moderate'` or 'subtle'
   - Don't enable stagger on 20+ items

---

## RESOURCES

- **Full Gap Analysis:** `/docs/GAP-ANALYSIS-PLASTURI-VS-TEMPLATE5.md`
- **Feature Matrix:** `/docs/FEATURE-MATRIX-PLASTURI.md`
- **Design System:** `/docs/PLASTURI-DESIGN-SYSTEM.md`
- **Widgets Comparison:** `/docs/PLASTURI-WIDGETS-COMPARISON.md`
- **Integration Plan:** `/docs/PLASTURI-INTEGRATION-PLAN.md`
- **Seeder Example:** `/src/seed/businesses/terapii-energetice.ts`

---

**Quick Start:**
```bash
# Seed example business
SEED_TYPE=terapii-energetice pnpm seed

# Build & test
pnpm build && pnpm start

# Run E2E tests
pnpm test:e2e
```

**Last Updated:** 2025-12-21
