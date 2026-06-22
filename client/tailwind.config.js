/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,jsx,ts,tsx}"],
  // Use class-based dark mode so our data-theme="dark" attribute drives it
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Legacy food-blog tokens (kept for backward compat on any remaining components)
        ink:       "#1A1A18",
        ivory:     "#FAF7F2",
        parchment: "#F0EBE3",
        body:      "#3D3830",
        muted:     "#8A8275",
        border:    "#E5DFD3",
        saffron: {
          DEFAULT: "#E8A020",
          dark:    "#C2790F",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:       "0 2px 8px -2px rgba(26,26,24,0.08), 0 4px 16px -4px rgba(26,26,24,0.06)",
        "card-hover":"0 8px 24px -4px rgba(26,26,24,0.14), 0 4px 12px -2px rgba(26,26,24,0.08)",
      },
    },
  },
  plugins: [],
};
