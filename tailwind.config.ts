import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* Base semantic colors */
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        /* Material Design 3 Surface System */
        surface: {
          DEFAULT: "var(--surface)",
          variant: "var(--surface-variant)",
        },
        "on-surface": {
          DEFAULT: "var(--on-surface)",
          variant: "var(--on-surface-variant)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },

        /* Primary Color System */
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          container: "var(--primary-container)",
        },
        "on-primary": {
          DEFAULT: "var(--on-primary)",
          container: "var(--on-primary-container)",
        },

        /* Secondary Color System */
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          container: "var(--secondary-container)",
        },
        "on-secondary": {
          DEFAULT: "var(--on-secondary)",
          container: "var(--on-secondary-container)",
        },

        /* Tertiary Color System */
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--tertiary-foreground)",
          container: "var(--tertiary-container)",
        },
        "on-tertiary": {
          DEFAULT: "var(--on-tertiary)",
          container: "var(--on-tertiary-container)",
        },

        /* Error/Destructive System */
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        error: {
          DEFAULT: "var(--destructive)",
          container: "var(--error-container)",
        },
        "on-error": {
          DEFAULT: "var(--on-error)",
          container: "var(--on-error-container)",
        },

        /* Success System */
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
          container: "var(--success-container)",
        },
        "on-success": {
          container: "var(--on-success-container)",
        },

        /* Warning System */
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
          container: "var(--warning-container)",
        },
        "on-warning": {
          container: "var(--on-warning-container)",
        },

        /* Info System */
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
          container: "var(--info-container)",
        },
        "on-info": {
          container: "var(--on-info-container)",
        },

        /* Neutral System */
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        /* Legacy Components */
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        /* Chart Colors */
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      borderRadius: {
        none: "var(--radius-none)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        "elevation-0": "var(--elevation-0)",
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
        "elevation-3": "var(--elevation-3)",
        "elevation-4": "var(--elevation-4)",
        "elevation-5": "var(--elevation-5)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
        stardom: ["var(--font-stardom)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
        "work-sans": ["var(--font-work-sans)", "sans-serif"],
        "cormorant-garamond": ["var(--font-cormorant-garamond)", "serif"],
        oswald: ["var(--font-oswald)", "sans-serif"],
        "bebas-neue": ["var(--font-bebas-neue)", "sans-serif"],
      },
      keyframes: {
        /* Legacy accordion animations */
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        /* Material Design 3 Animations */
        "material-fade-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "material-fade-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.9)" },
        },
        "material-slide-in-from-top": {
          from: { transform: "translateY(-8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "material-slide-in-from-bottom": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "material-slide-in-from-left": {
          from: { transform: "translateX(-8px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "material-slide-in-from-right": {
          from: { transform: "translateX(8px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "material-bounce": {
          "0%, 100%": { transform: "translateY(-4px)" },
          "50%": { transform: "translateY(0)" },
        },
        "material-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "material-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },

        /* Button Animations (Four Sigmatic inspired) */
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(-90deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      animation: {
        /* Legacy animations */
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        /* Material Design 3 Animations */
        "material-fade-in":
          "material-fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "material-fade-out":
          "material-fade-out 0.15s cubic-bezier(0.4, 0, 1, 1)",
        "material-slide-in-from-top":
          "material-slide-in-from-top 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "material-slide-in-from-bottom":
          "material-slide-in-from-bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "material-slide-in-from-left":
          "material-slide-in-from-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "material-slide-in-from-right":
          "material-slide-in-from-right 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "material-bounce": "material-bounce 1s infinite",
        "material-pulse":
          "material-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "material-spin": "material-spin 1s linear infinite",

        /* Button Animations */
        shimmer: "shimmer 1s ease-in-out",
        "scale-in": "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        ripple: "ripple 0.6s ease-out forwards",
      },
      transitionTimingFunction: {
        "material-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
        "material-decelerate": "cubic-bezier(0, 0, 0.2, 1)",
        "material-accelerate": "cubic-bezier(0.4, 0, 1, 1)",
      },
      transitionDuration: {
        "material-short1": "50ms",
        "material-short2": "100ms",
        "material-short3": "150ms",
        "material-short4": "200ms",
        "material-medium1": "250ms",
        "material-medium2": "300ms",
        "material-medium3": "350ms",
        "material-medium4": "400ms",
        "material-long1": "450ms",
        "material-long2": "500ms",
        "material-long3": "550ms",
        "material-long4": "600ms",
      },
    },
  },
  plugins: [],
};

export default config;
