import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
    // Grid variants
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '1.5rem',
        DEFAULT: '1rem',
        lg: '1.5rem',
        md: '1.5rem',
        sm: '1rem',
        xl: '1.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      maxWidth: {
        '7xl': '1400px',
        '8xl': '1600px',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'fade-in-down': 'fade-in-down 0.5s ease-out both',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        // Theme colors (from CSS variables - configurabile din admin)
        'theme-primary': 'var(--theme-primary)',
        'theme-primary-light': 'var(--theme-primary-light)',
        'theme-primary-dark': 'var(--theme-primary-dark)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-accent': 'var(--theme-accent)',
        'theme-dark': 'var(--theme-dark)',
        'theme-light': 'var(--theme-light)',
        'theme-text': 'var(--theme-text)',
        'theme-text-light': 'var(--theme-text-light)',
        'theme-text-muted': 'var(--theme-text-muted)',
        // Contrast text colors - for text on colored backgrounds
        'theme-text-on-primary': 'var(--theme-text-on-primary)',
        'theme-text-on-secondary': 'var(--theme-text-on-secondary)',
        'theme-text-on-accent': 'var(--theme-text-on-accent)',
        'theme-text-on-dark': 'var(--theme-text-on-dark)',
        'theme-text-on-light': 'var(--theme-text-on-light)',
        'theme-text-on-surface': 'var(--theme-text-on-surface)',
        'theme-surface': 'var(--theme-surface)',
        'theme-surface-secondary': 'var(--theme-surface-secondary)',
        'theme-border': 'var(--theme-border)',
        'theme-border-light': 'var(--theme-border-light)',

        // ShadCN colors for components
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        // Theme font sizes (from CSS variables)
        'theme-h1': 'var(--font-size-h1)',
        'theme-h2': 'var(--font-size-h2)',
        'theme-h3': 'var(--font-size-h3)',
        'theme-h4': 'var(--font-size-h4)',
        'theme-h5': 'var(--font-size-h5)',
        'theme-h6': 'var(--font-size-h6)',
        'theme-body': 'var(--font-size-body)',
        'theme-small': 'var(--font-size-small)',
      },
      spacing: {
        'section': 'var(--spacing-section)',
        'section-mobile': 'var(--spacing-section-mobile)',
        'card-gap': 'var(--spacing-card-gap)',
      },
      borderRadius: {
        'theme': 'var(--radius)',
        'theme-sm': 'var(--radius-sm)',
        'theme-md': 'var(--radius-md)',
        'theme-lg': 'var(--radius-lg)',
        'theme-xl': 'var(--radius-xl)',
        'theme-button': 'var(--radius-button)',
        'theme-card': 'var(--radius-card)',
        'theme-input': 'var(--radius-input)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'theme-xl': 'var(--shadow-xl)',
        'theme-card': 'var(--shadow-card)',
        'theme-card-hover': 'var(--shadow-card-hover)',
        'theme-button': 'var(--shadow-button)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--theme-text)',
              '--tw-prose-headings': 'var(--theme-text)',
              h1: {
                fontWeight: 'bold',
                marginBottom: '0.5em',
              },
              h2: {
                fontWeight: '600',
                marginBottom: '0.5em',
              },
              h3: {
                fontWeight: '600',
                marginBottom: '0.5em',
              },
              a: {
                color: 'var(--theme-primary)',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'var(--theme-primary-dark)',
                },
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
