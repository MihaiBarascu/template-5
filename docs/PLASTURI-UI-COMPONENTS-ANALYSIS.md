# Plasturi Fototerapeutici - Complete UI Component Analysis

> **Senior Frontend Developer Analysis**
> **Site**: https://www.plasturifototerapeutici.ro/
> **Platform**: Wix (Thunderbolt framework)
> **Analysis Date**: 2025-12-21
> **Purpose**: Reusable component abstraction for Template-5 system

---

## Executive Summary

Plasturifototerapeutici.ro is a **Wix-based** e-commerce/informational website built on the **Wix Thunderbolt** framework. The site demonstrates a **flat design philosophy** with zero shadows, minimal borders, and a focus on typography and whitespace. The design is characterized by:

- **Flat Design**: No shadows, zero border radius on most elements
- **Pill-style CTAs**: 24px border-radius on buttons for visual contrast
- **Video-first content**: Heavy use of embedded videos and video backgrounds
- **Clean typography**: Prompt font family (400-700 weight)
- **Grid-based layouts**: Consistent spacing with 24px gaps
- **Trust-building elements**: Money-back badges, certifications, testimonials

All components identified have been **successfully implemented** in Template-5 as reusable blocks.

---

## 1. HEADER COMPONENTS

### 1.1 TopBar (Announcement Bar)

**Structure:**
```html
<div class="topbar">
  <div class="topbar__social">
    <a href="[youtube]"><img src="youtube-icon.svg" /></a>
    <a href="[facebook]"><img src="facebook-icon.svg" /></a>
  </div>
  <div class="topbar__message">
    Te rugăm să te întorci la persoana care te-a recomandat!
  </div>
</div>
```

**CSS Characteristics:**
- Background: White or transparent
- Height: ~40px
- Layout: Flexbox, `justify-content: space-between`
- Social icons: 20x20px, grayscale with hover color
- Text: 14px, centered

**Accessibility:**
- Social links have `aria-label` attributes
- Semantic HTML (`<nav>` wrapper)
- Keyboard navigable

**Template-5 Implementation:**
- ✅ **Block**: `Header` with `variant: 'with-topbar'`
- ✅ **Config**: `topBar.showSocial`, `topBar.customText`
- ✅ **File**: `/src/components/Header/index.tsx`

**JavaScript Interactions:**
- None (static component)

---

### 1.2 Main Navigation Header

**Structure:**
```html
<header class="main-header transparent">
  <div class="header__container">
    <div class="header__logo">
      <img src="logo.png" alt="Plasturi Fototerapeutici" />
    </div>
    <nav class="header__nav">
      <a href="/">Pagina Principală</a>
      <a href="/blog">Blog</a>
      <a href="/despre">Despre</a>
      <a href="/shop">Shop</a>
    </nav>
    <div class="header__actions">
      <a href="/cart" class="cart-icon">
        <svg>...</svg>
        <span class="cart-count">0</span>
      </a>
    </div>
  </div>
</header>
```

**CSS Characteristics:**
- **Transparent on scroll top**: `background: transparent` with white text
- **Solid on scroll**: `background: white` with dark text (transition 0.3s)
- **Sticky positioning**: `position: sticky; top: 0; z-index: 100`
- **Height**: 80px (desktop), 60px (mobile)
- **Logo height**: 50px
- **Nav links**: 16px, weight 400, spacing 32px
- **Hover effect**: Underline (2px, 0.2s transition)

**Accessibility:**
- `<nav>` with `aria-label="Main navigation"`
- Active link has `aria-current="page"`
- Mobile: Hamburger menu with `aria-expanded` state
- Focus states: 2px outline with theme color

**Template-5 Implementation:**
- ✅ **Component**: `/src/components/Header/index.tsx`
- ✅ **Features**: Transparent header, sticky behavior, mobile hamburger
- ✅ **Config**: `isTransparent`, `transparentTextColor`, `stickyOnScroll`

**JavaScript Interactions:**
```javascript
// Scroll detection for transparency toggle
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded',
    mobileMenu.classList.contains('open'));
});
```

---

## 2. HERO SECTIONS

### 2.1 Video Hero (Fullscreen with Overlay)

**Structure:**
```html
<section class="video-hero fullscreen">
  <div class="video-hero__background">
    <video autoplay muted loop playsinline>
      <source src="hero.mp4" type="video/mp4">
    </video>
    <div class="video-hero__overlay"></div>
  </div>
  <div class="video-hero__content">
    <h1 class="video-hero__title">
      Redescoperă energia cu Plasturii Fototerapeutici
    </h1>
    <p class="video-hero__subtitle">
      Activează regenerarea naturală și ameliorează durerile
    </p>
    <div class="video-hero__badge">
      <img src="money-back-30.svg" alt="Garanție 30 zile" />
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Height**: 100vh (fullscreen), 70vh (large), 50vh (medium)
- **Video**: `object-fit: cover`, `width: 100%`, `height: 100%`
- **Overlay**: `background: rgba(0,0,0,0.35)` for readability
- **Text color**: White with text-shadow for contrast
- **Content positioning**: `position: absolute; top: 50%; transform: translateY(-50%)`
- **Title**: 36px (mobile), 48px (desktop), weight 400
- **Subtitle**: 18px (mobile), 24px (desktop), weight 300

**Accessibility:**
- Video has `aria-hidden="true"` (decorative)
- Heading hierarchy: `<h1>` for main title
- Sufficient contrast ratio (4.5:1 minimum)
- `prefers-reduced-motion` disables autoplay

**Template-5 Implementation:**
- ✅ **Block**: `VideoHero`
- ✅ **Config**: `height: 'fullscreen' | 'large' | 'medium'`, `videoUrl`, `overlayOpacity`
- ✅ **File**: `/src/blocks/VideoHero/Component.tsx`

**JavaScript Interactions:**
```javascript
// Pause video when not in viewport (performance)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause();
    }
  });
});

observer.observe(document.querySelector('.video-hero video'));

// Prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach(video => {
    video.removeAttribute('autoplay');
    video.pause();
  });
}
```

---

### 2.2 Image Hero (Secondary Pages)

**Structure:**
```html
<section class="image-hero" style="background-image: url('hero.jpg')">
  <div class="image-hero__overlay"></div>
  <div class="image-hero__content">
    <h1>Misiunea noastră</h1>
    <p>Trăiește mult. Trăiește bine.</p>
  </div>
</section>
```

**CSS Characteristics:**
- **Background**: `background-size: cover; background-position: center`
- **Height**: 60vh (desktop), 40vh (mobile)
- **Overlay**: `background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))`
- **Text alignment**: Center

**Template-5 Implementation:**
- ✅ **Block**: `Hero` (standard)
- ✅ **File**: `/src/blocks/Hero/Component.tsx`

---

## 3. CONTENT BLOCKS

### 3.1 Video + Text Section (Two Columns)

**Structure:**
```html
<section class="video-text-section">
  <div class="container">
    <div class="video-text-section__grid">
      <div class="video-text-section__media">
        <div class="video-badge">
          <svg>...</svg>
          <span>Urmărește videoclipul ~1:30 minute</span>
        </div>
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/..."
                  allowfullscreen></iframe>
        </div>
      </div>
      <div class="video-text-section__content">
        <h2>Cum funcționează tehnologia?</h2>
        <p>Când aplici un plasture X39 pe corp...</p>
        <p>[Paragraf explicativ lung]</p>
      </div>
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Grid**: `display: grid; grid-template-columns: 1fr 1fr; gap: 60px`
- **Mobile**: Stack vertically (grid-template-columns: 1fr)
- **Video aspect ratio**: 16:9 maintained with padding-bottom trick
- **Video badge**: Absolute position top-left, 14px font, icon + text
- **Content padding**: 40px on desktop, 20px on mobile

**Accessibility:**
- Video iframe has `title` attribute
- Headings follow semantic hierarchy
- Focus trap when video is fullscreen

**Template-5 Implementation:**
- ✅ **Block**: `MediaContent` (extended with video support)
- ✅ **File**: `/src/blocks/MediaContent/Component.tsx`

**JavaScript Interactions:**
```javascript
// YouTube API for video controls
const player = new YT.Player('video-player', {
  videoId: 'VIDEO_ID',
  events: {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
  }
});

function onPlayerReady(event) {
  // Auto-play logic or user-initiated play
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    // Track video completion for analytics
    gtag('event', 'video_complete', {
      'video_id': 'VIDEO_ID'
    });
  }
}
```

---

### 3.2 Process Steps (3-Step Visual Flow)

**Structure:**
```html
<section class="process-steps">
  <div class="container">
    <h2 class="process-steps__heading">Cum funcționează?</h2>
    <div class="process-steps__grid">
      <div class="process-step">
        <div class="process-step__image">
          <img src="step1.jpg" alt="Pasul 1" />
        </div>
        <div class="process-step__number">1</div>
        <h3 class="process-step__title">Aplică</h3>
        <p class="process-step__description">
          Aplici un plasture X39 pe corp, pe una dintre...
        </p>
      </div>
      <!-- Step 2 and 3 repeat -->
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Grid**: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px`
- **Mobile**: Single column stack
- **Step number**: Circle (60px diameter), centered, gradient background
- **Image**: Full width, aspect-ratio 1:1, object-fit cover
- **Title**: 20px, weight 600, margin-top 16px
- **Description**: 16px, weight 400, line-height 1.6

**Template-5 Implementation:**
- ✅ **Block**: `ProcessSteps`
- ✅ **Variants**: `horizontal`, `zigzag`, `timeline`, `grid`, `carousel`
- ✅ **File**: `/src/blocks/ProcessSteps/Component.tsx`

**JavaScript Interactions:**
- Carousel variant uses `snap-scroll` CSS with optional arrow navigation
- Intersection Observer for scroll-triggered animations

---

### 3.3 Accordion / FAQ

**Structure:**
```html
<section class="faq-section">
  <div class="container">
    <h2>Întrebări Frecvente</h2>
    <div class="accordion">
      <div class="accordion-item">
        <button class="accordion-header" aria-expanded="false">
          <span>Află mai multe!</span>
          <svg class="accordion-icon">...</svg>
        </button>
        <div class="accordion-content" hidden>
          <p>[Conținut expandabil]</p>
        </div>
      </div>
      <!-- More items -->
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Border**: 1px solid #E0E0E0 (bottom only)
- **Header**: Padding 20px, cursor pointer, hover background #F5F5F5
- **Icon**: Chevron down, rotates 180deg when expanded (transition 0.3s)
- **Content**: Max-height animation (0 to auto via JS calculation)
- **Animation**: Smooth expand/collapse with CSS transitions

**Accessibility:**
- `aria-expanded` toggles true/false
- `aria-controls` links button to content panel
- Keyboard: Enter/Space to toggle, Tab to navigate
- Focus visible on header button

**Template-5 Implementation:**
- ✅ **Block**: `FAQ`
- ✅ **File**: `/src/blocks/FAQ/Component.tsx`

**JavaScript Interactions:**
```javascript
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    const content = header.nextElementSibling;

    // Close all other accordions (optional single-open behavior)
    accordionHeaders.forEach(h => {
      h.setAttribute('aria-expanded', 'false');
      h.nextElementSibling.hidden = true;
    });

    // Toggle current
    header.setAttribute('aria-expanded', !expanded);
    content.hidden = expanded;

    // Smooth height animation
    if (!expanded) {
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = '0';
    }
  });
});
```

---

### 3.4 Download Links (PDF Downloads)

**Structure:**
```html
<section class="download-links">
  <div class="container">
    <h2>Materiale Descărcabile</h2>
    <div class="download-grid">
      <a href="/pdfs/cum-functioneaza.pdf"
         class="download-btn"
         download>
        <svg class="download-icon">...</svg>
        <span>Download și trimite cum funcționează?</span>
      </a>
      <a href="/pdfs/ce-contin.pdf"
         class="download-btn"
         download>
        <svg class="download-icon">...</svg>
        <span>Download și trimite ce conțin?</span>
      </a>
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Button style**: Border 2px solid, padding 16px 32px, hover background fill
- **Grid**: 2 columns on desktop, stack on mobile
- **Icon**: 24x24px, positioned left of text
- **Hover**: Background transition 0.3s, slight scale (1.02)

**Template-5 Implementation:**
- ✅ **Block**: `DownloadLinks`
- ✅ **Variants**: `buttons`, `list`, `grid`
- ✅ **File**: `/src/blocks/DownloadLinks/Component.tsx`

**JavaScript Interactions:**
```javascript
// Track downloads
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const fileName = e.currentTarget.getAttribute('href');

    // Analytics tracking
    gtag('event', 'file_download', {
      'file_name': fileName,
      'link_text': e.currentTarget.textContent
    });
  });
});
```

---

### 3.5 Timeline / Expectations Cards

**Structure:**
```html
<section class="timeline-section">
  <div class="container">
    <h2>Ce așteptări să ai de la Plasturii Fototerapeutici?</h2>
    <div class="timeline-cards">
      <div class="timeline-card">
        <img src="la-inceput.jpg" alt="" />
        <h3>La început</h3>
        <p>Senzația de energie crescută...</p>
      </div>
      <div class="timeline-card">
        <img src="claritate.jpg" alt="" />
        <h3>Claritate mentală</h3>
        <p>Concentrare îmbunătățită...</p>
      </div>
      <!-- More cards -->
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Layout**: Horizontal scroll on mobile, grid on desktop
- **Cards**: Min-width 280px, snap-scroll behavior
- **Image**: Aspect ratio 4:3, object-fit cover
- **Title**: 18px, weight 600
- **Scroll**: `scroll-snap-type: x mandatory`, `scroll-padding: 24px`

**Template-5 Implementation:**
- ✅ **Block**: `ProcessSteps` with `variant: 'carousel'`
- ✅ **File**: `/src/blocks/ProcessSteps/Component.tsx`

---

### 3.6 Numbered Steps List

**Structure:**
```html
<section class="numbered-steps">
  <div class="container">
    <h2>Cum maximizezi beneficiile?</h2>
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-number">1</div>
        <div class="step-content">
          <h3>Hidratează-te</h3>
          <p>Consumă 120-150 ml de apă la fiecare 30 minute</p>
        </div>
      </li>
      <!-- More steps -->
    </ol>
    <a href="/pdf/tracker.pdf" class="download-cta">
      📥 Descarcă - Urmărește-ți Rezultatele
    </a>
  </div>
</section>
```

**CSS Characteristics:**
- **Number circle**: 40px diameter, gradient background
- **Spacing**: 32px between steps
- **Connector line**: 2px dashed line between numbers (optional)
- **Font**: Title 20px weight 600, description 16px weight 400

**Template-5 Implementation:**
- ✅ **Block**: `ProcessSteps` with `showNumbers: true`
- ✅ Alternative: RichText with custom CSS

---

## 4. INTERACTIVE ELEMENTS

### 4.1 Buttons (All Variants)

**Primary CTA:**
```html
<button class="btn btn-primary">
  Cumpără Acum
</button>
```
**CSS:**
- Border-radius: 24px (pill style)
- Padding: 14px 32px
- Font: 16px, weight 600
- Background: Gradient (primary color)
- Hover: Scale 1.05, shadow 0 4px 12px rgba(0,0,0,0.15)
- Transition: all 0.3s ease

**Secondary CTA:**
```html
<button class="btn btn-secondary">
  Află Mai Mult
</button>
```
**CSS:**
- Border: 2px solid
- Background: Transparent
- Hover: Background fill with primary color

**Text Button:**
```html
<a href="#" class="btn-text">
  Vezi toate →
</a>
```
**CSS:**
- Underline on hover
- Arrow icon transitions right on hover

**Template-5 Implementation:**
- ✅ **Component**: `/src/components/ui/button.tsx`
- ✅ **Variants**: `primary`, `secondary`, `outline`, `ghost`, `link`

---

### 4.2 Forms and Inputs

**Email Input:**
```html
<div class="form-group">
  <label for="email">Email*</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    placeholder="nume@exemplu.ro"
    aria-describedby="email-error"
  />
  <span id="email-error" class="error-message" role="alert"></span>
</div>
```

**CSS:**
- Border: 1px solid #E0E0E0
- Border-radius: 0px (flat design)
- Padding: 12px 16px
- Focus: Border color changes to primary, outline 2px
- Error state: Border red, error message visible

**Checkbox (GDPR):**
```html
<div class="checkbox-group">
  <input
    type="checkbox"
    id="gdpr"
    name="gdpr"
    required
    aria-required="true"
  />
  <label for="gdpr">
    Da, mă abonez la newsletter*
  </label>
</div>
```

**JavaScript Validation:**
```javascript
const emailInput = document.getElementById('email');
const errorMessage = document.getElementById('email-error');

emailInput.addEventListener('blur', () => {
  if (!emailInput.validity.valid) {
    errorMessage.textContent = 'Te rugăm să introduci o adresă de email validă';
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    errorMessage.textContent = '';
    emailInput.setAttribute('aria-invalid', 'false');
  }
});
```

**Template-5 Implementation:**
- ✅ **Component**: Form fields in blocks (Newsletter, Contact)
- ✅ **Validation**: Built-in with error messages

---

### 4.3 Hover Effects

**Card Hover:**
```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

**Image Zoom:**
```css
.image-wrapper {
  overflow: hidden;
}

.image-wrapper img {
  transition: transform 0.5s ease;
}

.image-wrapper:hover img {
  transform: scale(1.1);
}
```

**Link Underline Animation:**
```css
.link {
  position: relative;
  text-decoration: none;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}
```

---

### 4.4 Scroll Animations

**Intersection Observer Pattern:**
```javascript
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target); // Animate once
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(el => {
  observer.observe(el);
});
```

**CSS Animation:**
```css
.fade-in-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 5. FOOTER STRUCTURE

### 5.1 Footer Layout (4 Columns)

**Structure:**
```html
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <!-- Column 1: Company Info -->
      <div class="footer__column">
        <h3>plasturifototerapeutici.ro</h3>
        <p>Firmă: UNIQUE LIGHT SRL</p>
        <p>Sediu social: București...</p>
        <p>Nr. registru: J2025...</p>
      </div>

      <!-- Column 2: Links -->
      <div class="footer__column">
        <h3>Link-uri Utile</h3>
        <ul>
          <li><a href="/politica-confidentialitate">Politica confidențialitate</a></li>
          <li><a href="/politica-cookies">Politica cookie-uri</a></li>
          <li><a href="/protectia-datelor">Protecția datelor</a></li>
          <li><a href="/termeni">Termeni și condiții</a></li>
        </ul>
      </div>

      <!-- Column 3: Empty or social -->
      <div class="footer__column">
        <!-- Optional content -->
      </div>

      <!-- Column 4: Payment badges -->
      <div class="footer__column">
        <img src="netopia.png" alt="Netopia Payments" />
        <img src="anpc-sol.png" alt="ANPC SOL" />
        <img src="anpc-sal.png" alt="ANPC SAL" />
      </div>
    </div>
  </div>

  <div class="footer__bottom">
    <p>&copy; 2025 Plasturi Fototerapeutici. Toate drepturile rezervate.</p>
  </div>
</footer>
```

**CSS Characteristics:**
- **Grid**: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px`
- **Mobile**: Single column stack
- **Background**: Dark (#1A1A2E) or light (#F5F5F5)
- **Text color**: Contrast with background
- **Link hover**: Underline or color change
- **Badge images**: Max-width 120px

**Template-5 Implementation:**
- ✅ **Component**: `/src/components/Footer/index.tsx`
- ✅ **Config**: Columns, links, badges from globals

---

## 6. SPECIAL COMPONENTS

### 6.1 Pricing Kits (Product Cards)

**Structure:**
```html
<section class="pricing-kits">
  <div class="container">
    <h2>Accesează cele mai mici prețuri prin kiturile noastre</h2>
    <p class="discount-badge">DISCOUNT 30-50%</p>

    <div class="pricing-grid">
      <div class="pricing-card">
        <img src="kit-core.jpg" alt="Kit Core" class="pricing-card__image" />
        <h3 class="pricing-card__title">Kit Core</h3>

        <ul class="pricing-card__features">
          <li><svg>✓</svg> 3 pachete X39</li>
          <li><svg>✓</svg> Transport DHL 1-2 zile</li>
          <li><svg>✓</svg> Garanție 30 de zile</li>
        </ul>

        <div class="pricing-card__price">
          <span class="price-amount">1645</span>
          <span class="price-currency">lei</span>
        </div>

        <p class="pricing-card__guarantee">
          Garanție 30 zile
        </p>

        <a href="/comanda/kit-core" class="btn btn-primary">
          Comandă Acum
        </a>
      </div>
      <!-- More pricing cards -->
    </div>
  </div>
</section>
```

**CSS Characteristics:**
- **Card**: Border 1px solid #E0E0E0, padding 24px
- **Image**: Aspect ratio 1:1, object-fit cover
- **Features**: Checkmark icon (green), 16px font
- **Price**: 32px font size, weight 700
- **Hover**: Box shadow subtle

**Template-5 Implementation:**
- ✅ **Block**: `PricingKits`
- ✅ **Variants**: `cards`, `cards-image`, `compact`, `highlighted`
- ✅ **File**: `/src/blocks/PricingKits/Component.tsx`

---

### 6.2 Testimonials Carousel

**Structure:**
```html
<section class="testimonials">
  <div class="container">
    <h2>Ce spun clienții</h2>

    <div class="testimonials-carousel">
      <div class="testimonial-slide">
        <img src="photo.jpg" alt="Mihaela Buzărnescu" class="testimonial-photo" />
        <blockquote>
          <p>"Testimonial text..."</p>
        </blockquote>
        <cite>
          <strong>Mihaela Buzărnescu</strong>
          <span>Tenismena profesionistă</span>
        </cite>
      </div>
      <!-- More slides -->
    </div>

    <div class="carousel-controls">
      <button aria-label="Previous" class="carousel-btn prev">‹</button>
      <button aria-label="Next" class="carousel-btn next">›</button>
    </div>

    <div class="carousel-dots">
      <button aria-label="Slide 1" class="dot active"></button>
      <button aria-label="Slide 2" class="dot"></button>
      <button aria-label="Slide 3" class="dot"></button>
    </div>
  </div>
</section>
```

**JavaScript (Carousel Logic):**
```javascript
class TestimonialsCarousel {
  constructor(element) {
    this.carousel = element;
    this.slides = element.querySelectorAll('.testimonial-slide');
    this.currentIndex = 0;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    this.showSlide(0);
    this.setupControls();
    this.startAutoplay();
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.setAttribute('aria-hidden', i !== index);
    });

    this.currentIndex = index;
    this.updateDots();
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.next(), 5000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  setupControls() {
    this.carousel.querySelector('.next').addEventListener('click', () => {
      this.stopAutoplay();
      this.next();
      this.startAutoplay();
    });

    this.carousel.querySelector('.prev').addEventListener('click', () => {
      this.stopAutoplay();
      this.prev();
      this.startAutoplay();
    });
  }

  updateDots() {
    const dots = this.carousel.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }
}

// Initialize
document.querySelectorAll('.testimonials-carousel').forEach(carousel => {
  new TestimonialsCarousel(carousel);
});
```

**Template-5 Implementation:**
- ✅ **Block**: `Testimonials`
- ✅ **Variants**: `carousel`, `grid`, `masonry`
- ✅ **File**: `/src/blocks/Testimonials/Component.tsx`

---

### 6.3 Video Gallery

**Structure:**
```html
<section class="video-gallery">
  <div class="container">
    <h2>Ce spune inventatorul?</h2>

    <div class="video-grid">
      <div class="video-item">
        <div class="video-thumbnail">
          <img src="thumb1.jpg" alt="" />
          <button class="play-btn" aria-label="Play video">
            <svg>▶</svg>
          </button>
        </div>
        <h3 class="video-title">Despre tehnologie</h3>
      </div>
      <!-- More videos -->
    </div>
  </div>
</section>
```

**JavaScript (Modal Video Player):**
```javascript
const videoItems = document.querySelectorAll('.video-item');
const modal = document.createElement('div');
modal.className = 'video-modal';
modal.innerHTML = `
  <div class="video-modal__overlay"></div>
  <div class="video-modal__content">
    <button class="video-modal__close" aria-label="Close">&times;</button>
    <div class="video-modal__player"></div>
  </div>
`;
document.body.appendChild(modal);

videoItems.forEach(item => {
  item.querySelector('.play-btn').addEventListener('click', () => {
    const videoUrl = item.dataset.videoUrl;
    openVideoModal(videoUrl);
  });
});

function openVideoModal(url) {
  const player = modal.querySelector('.video-modal__player');
  player.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus trap
  modal.querySelector('.video-modal__close').focus();
}

modal.querySelector('.video-modal__close').addEventListener('click', closeVideoModal);
modal.querySelector('.video-modal__overlay').addEventListener('click', closeVideoModal);

function closeVideoModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  modal.querySelector('.video-modal__player').innerHTML = '';
}
```

**Template-5 Implementation:**
- ✅ **Block**: `VideoGallery`
- ✅ **Variants**: `grid-2`, `grid-3`, `carousel`
- ✅ **File**: Custom block (implemented)

---

### 6.4 Floating CTA Button

**Structure:**
```html
<div class="floating-cta" data-show-after-scroll="300">
  <a href="/contact" class="floating-cta__button">
    <span>Abonează-te Acum</span>
    <svg class="arrow-icon">→</svg>
  </a>
</div>
```

**CSS:**
```css
.floating-cta {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 999;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.floating-cta.visible {
  opacity: 1;
  transform: translateY(0);
}

.floating-cta__button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #116DFF, #AD50F2);
  color: white;
  border-radius: 24px; /* Pill shape for Plasturi design */
  box-shadow: 0 4px 12px rgba(17, 109, 255, 0.3);
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.floating-cta__button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(17, 109, 255, 0.4);
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.floating-cta.pulse .floating-cta__button {
  animation: pulse 2s infinite;
}
```

**JavaScript:**
```javascript
const floatingCta = document.querySelector('.floating-cta');
const showAfterScroll = parseInt(floatingCta.dataset.showAfterScroll) || 300;

window.addEventListener('scroll', () => {
  if (window.scrollY > showAfterScroll) {
    floatingCta.classList.add('visible');
  } else {
    floatingCta.classList.remove('visible');
  }
});

// Optional: Dismiss button
const dismissBtn = floatingCta.querySelector('.dismiss-btn');
if (dismissBtn) {
  dismissBtn.addEventListener('click', (e) => {
    e.preventDefault();
    floatingCta.style.display = 'none';
    localStorage.setItem('floating-cta-dismissed', 'true');
  });
}

// Check if previously dismissed
if (localStorage.getItem('floating-cta-dismissed') === 'true') {
  floatingCta.style.display = 'none';
}
```

**Template-5 Implementation:**
- ✅ **Component**: `/src/components/ui/FloatingCTA.tsx`
- ✅ **Config**: `position`, `shape`, `showAfterScroll`, `dismissible`
- ✅ **Positions**: `bottom-right`, `bottom-left`, `bottom-center`, `right-center`, `left-center`

---

## 7. DESIGN SYSTEM SUMMARY

### 7.1 Color Tokens

```css
:root {
  /* Primary Colors */
  --color-primary: #116DFF;
  --color-secondary: #AD50F2;
  --color-accent: #00CED1;

  /* Neutral Colors */
  --color-dark: #1A1A2E;
  --color-text: #000000;
  --color-text-light: #666666;
  --color-border: #E0E0E0;
  --color-surface: #F5F5F5;
  --color-white: #FFFFFF;

  /* Functional Colors */
  --color-success: #4CAF50;
  --color-warning: #FFC107;
  --color-error: #F44336;
  --color-info: #2196F3;
}
```

### 7.2 Typography Tokens

```css
:root {
  /* Font Families */
  --font-heading: 'Prompt', sans-serif;
  --font-body: 'Open Sans', sans-serif;

  /* Font Sizes */
  --font-size-h1: clamp(28px, 4vw, 48px);
  --font-size-h2: clamp(24px, 3vw, 36px);
  --font-size-h3: clamp(20px, 2.5vw, 28px);
  --font-size-h4: clamp(18px, 2vw, 24px);
  --font-size-h5: clamp(16px, 1.5vw, 20px);
  --font-size-body: 16px;
  --font-size-small: 14px;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  --line-height-loose: 2;
}
```

### 7.3 Spacing Tokens

```css
:root {
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 80px;
  --space-4xl: 120px;

  /* Section Spacing */
  --section-padding-y: clamp(40px, 8vw, 80px);
  --section-padding-x: clamp(20px, 5vw, 60px);

  /* Container */
  --container-max-width: 1200px;
  --container-padding: 24px;
}
```

### 7.4 Border & Shadow Tokens

```css
:root {
  /* Border Radius (Flat Design) */
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-pill: 24px;
  --radius-full: 9999px;

  /* Borders */
  --border-width: 1px;
  --border-width-thick: 2px;
  --border-color: var(--color-border);

  /* Shadows (Minimal for Flat Design) */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

### 7.5 Animation Tokens

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## 8. ACCESSIBILITY CONSIDERATIONS

### 8.1 Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<nav>`, `<main>`, `<section>`, `<article>` landmarks
- Use `<button>` for interactive elements (not `<div>`)
- Use `<a>` for navigation links

### 8.2 ARIA Attributes
- `aria-label` for icon-only buttons
- `aria-expanded` for accordion/dropdown states
- `aria-hidden="true"` for decorative elements
- `aria-live` for dynamic content updates
- `aria-current="page"` for active navigation links

### 8.3 Keyboard Navigation
- All interactive elements must be focusable
- Logical tab order
- Visible focus indicators (2px outline)
- Escape key closes modals
- Enter/Space activates buttons

### 8.4 Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Sufficient contrast for all interactive elements

### 8.5 Motion & Animation
- Respect `prefers-reduced-motion` media query
- Disable autoplay for users with motion sensitivity
- Provide pause controls for carousels

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. PERFORMANCE OPTIMIZATIONS

### 9.1 Image Optimization
- Use WebP format with JPEG fallback
- Implement lazy loading (`loading="lazy"`)
- Use responsive images with `srcset`
- Optimize image sizes (max 200KB per image)

```html
<img
  src="image.jpg"
  srcset="image-320w.webp 320w, image-640w.webp 640w, image-1024w.webp 1024w"
  sizes="(max-width: 640px) 100vw, 640px"
  loading="lazy"
  alt="Description"
/>
```

### 9.2 Video Optimization
- Use poster images for videos
- Preload only critical videos
- Pause videos when not in viewport
- Compress videos (H.264, max bitrate 5Mbps)

### 9.3 Font Loading
- Use `font-display: swap` to prevent FOIT
- Preload critical fonts
- Subset fonts to only needed characters

```css
@font-face {
  font-family: 'Prompt';
  src: url('/fonts/prompt.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
}
```

### 9.4 Critical CSS
- Inline critical above-the-fold CSS
- Defer non-critical CSS
- Use CSS containment for isolated components

### 9.5 JavaScript Performance
- Use Intersection Observer instead of scroll events
- Debounce/throttle event handlers
- Code splitting for route-based loading
- Lazy load non-critical JavaScript

---

## 10. COMPONENT IMPLEMENTATION CHECKLIST

For each component implemented in Template-5:

- [x] **Semantic HTML** structure
- [x] **Responsive design** (mobile-first)
- [x] **Accessibility** (ARIA, keyboard nav)
- [x] **Performance** (lazy loading, optimized assets)
- [x] **Cross-browser** compatibility
- [x] **Dark mode** support (where applicable)
- [x] **Theme tokens** usage (no hardcoded colors)
- [x] **Error states** handling
- [x] **Loading states** indication
- [x] **Empty states** design
- [x] **Documentation** and examples
- [x] **TypeScript** types
- [x] **Unit tests** (Vitest)
- [x] **E2E tests** (Playwright)

---

## 11. TEMPLATE-5 MAPPING

| Plasturi Component | Template-5 Block | Status | File |
|-------------------|-----------------|--------|------|
| Video Hero | `VideoHero` | ✅ Complete | `/src/blocks/VideoHero/` |
| Trust Badges | `TrustBadges` | ✅ Complete | `/src/blocks/TrustBadges/` |
| Process Steps | `ProcessSteps` | ✅ Complete | `/src/blocks/ProcessSteps/` |
| Download Links | `DownloadLinks` | ✅ Complete | `/src/blocks/DownloadLinks/` |
| Video Gallery | `VideoGallery` | ✅ Complete | Custom block |
| Pricing Kits | `PricingKits` | ✅ Complete | `/src/blocks/PricingKits/` |
| Timeline | `Timeline` | ✅ Complete | Custom block |
| Newsletter | `Newsletter` | ✅ Complete | `/src/blocks/Newsletter/` |
| Floating CTA | `FloatingCTA` | ✅ Complete | `/src/components/ui/FloatingCTA.tsx` |
| Header + TopBar | `Header` | ✅ Complete | `/src/components/Header/` |
| Footer | `Footer` | ✅ Complete | `/src/components/Footer/` |
| Testimonials | `Testimonials` | ✅ Complete | `/src/blocks/Testimonials/` |
| FAQ Accordion | `FAQ` | ✅ Complete | `/src/blocks/FAQ/` |
| Contact Form | `Contact` | ✅ Complete | `/src/blocks/Contact/` |
| Stats Section | `Stats` | ✅ Complete | `/src/blocks/Stats/` |

---

## 12. CONCLUSION

The plasturifototerapeutici.ro website demonstrates a **clean, flat design approach** with a strong emphasis on:

1. **Typography hierarchy** over decorative elements
2. **Whitespace** for visual breathing room
3. **Trust signals** (badges, testimonials, guarantees)
4. **Video content** for engagement
5. **Pill-style CTAs** for visual contrast against flat design
6. **Accessibility-first** approach

All identified components have been successfully abstracted into **reusable Template-5 blocks** with:
- Full configuration options
- Responsive design
- Accessibility compliance
- Performance optimization
- TypeScript type safety

The implementation is **production-ready** and can be used for any business requiring a similar design aesthetic, particularly in the **health, wellness, and energy therapy** sectors.

---

## References

- **Source Website**: https://www.plasturifototerapeutici.ro/
- **Platform**: Wix (Thunderbolt Framework)
- **Screenshots**: `/home/evr/Desktop/website-templates/template-5/.playwright-mcp/plasturi-*.png`
- **Template-5 Docs**:
  - `/docs/PLASTURI-DESIGN-SYSTEM.md`
  - `/docs/PLASTURI-WIDGETS-COMPARISON.md`
  - `/docs/lessons/_LESSONS-INDEX.md`
