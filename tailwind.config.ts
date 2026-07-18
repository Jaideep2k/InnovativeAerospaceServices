import type { Config } from "tailwindcss";

/**
 * Brand tokens transcribed from brandassets/brand assets- color scheme etc.png
 * Palette: Jet Black #0D0D0D · Charcoal #333333 · Aerospace Red #E31B23 ·
 * Silver Gray #BFC3C7 · White #FFFFFF
 * Type: Raleway (headings) · Open Sans (body)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: "#0D0D0D",
        charcoal: "#333333",
        aerored: "#E31B23",
        silver: "#BFC3C7",
      },
      fontFamily: {
        heading: ["var(--font-raleway)", "sans-serif"],
        body: ["var(--font-open-sans)", "sans-serif"],
      },
      maxWidth: {
        wrap: "76rem",
      },
    },
  },
  plugins: [],
};

export default config;
