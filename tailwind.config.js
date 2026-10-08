/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0066cc',
                    dark: '#0052a3',
                    light: '#3399ff',
                },
                background: '#ffffff',
                foreground: '#1a1a1a',
                surface: '#f8f9fa',
                border: '#e0e0e0',
                accent: '#00b4d8',
                success: '#06a77d',
                warning: '#f77f00',
                destructive: '#d62828',
                'text-primary': '#1a1a1a',
                'text-secondary': '#666666',
                'text-muted': '#999999',
            },
        },
    },
    plugins: [],
}
