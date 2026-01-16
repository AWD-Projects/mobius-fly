import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "var(--color-white)",
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      text: "var(--color-text)",
      neutral: "var(--color-neutral)",
      muted: "var(--color-muted)",
      border: "var(--color-border)",
      surface: "var(--color-surface)",
      background: "var(--color-background)",
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      disabled: "var(--color-disabled)",
      transparent: "transparent",
      current: "currentColor",
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["var(--font-size-h1)", { lineHeight: "var(--line-height-h1)" }],
        h2: ["var(--font-size-h2)", { lineHeight: "var(--line-height-h2)" }],
        h3: ["var(--font-size-h3)", { lineHeight: "var(--line-height-h3)" }],
        h4: ["var(--font-size-h4)", { lineHeight: "var(--line-height-h4)" }],
        body: ["var(--font-size-body)", { lineHeight: "var(--line-height-body)" }],
        small: ["var(--font-size-small)", { lineHeight: "var(--line-height-small)" }],
        caption: ["var(--font-size-caption)", { lineHeight: "var(--line-height-caption)" }],
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        hover: "var(--shadow-hover)",
        modal: "var(--shadow-modal)",
      },
    },
  },
  plugins: [],
};

export default config;
