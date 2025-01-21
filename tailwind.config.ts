import type { Config } from "tailwindcss";
import scrollbar from 'tailwind-scrollbar';
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBg: '#000C18',
        orange: {
          650: '#F84F08', 
        }
      },
      spacing: {
        14: '3.5rem', 
        16: '4rem',    
        18: '4.5rem', 
        20: '5rem',    
        24: '10rem', 
      },
    },
  },
  plugins: [
    scrollbar,
    scrollbarHide,
  ],
} satisfies Config;
