import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Ballistic Intel Brand Colors
  			ballistic: {
  				blue: {
  					50: '#E6F0FF',
  					100: '#CCE0FF',
  					200: '#99C2FF',
  					300: '#66A3FF',
  					400: '#3385FF',
  					500: '#0066FF',  // Primary brand blue
  					600: '#0052CC',
  					700: '#003D99',
  					800: '#002966',
  					900: '#001433',
  				},
  				navy: {
  					50: '#E8EBF0',
  					100: '#D1D7E0',
  					200: '#A3AFC2',
  					300: '#7587A3',
  					400: '#475F85',
  					500: '#1A3766',  // Primary navy
  					600: '#152C52',
  					700: '#10213D',
  					800: '#0A1629',
  					900: '#050B14',
  				},
  				gray: {
  					50: '#F8F9FA',
  					100: '#F1F3F5',
  					200: '#E9ECEF',
  					300: '#DEE2E6',
  					400: '#CED4DA',
  					500: '#ADB5BD',
  					600: '#6C757D',
  					700: '#495057',
  					800: '#343A40',
  					900: '#212529',
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
