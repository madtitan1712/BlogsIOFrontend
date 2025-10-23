/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
            },
            colors: {
                'background': 'var(--color-bg)',
                'text-primary': 'var(--color-text)',
                'border-color': 'var(--color-border)',
                'accent': 'var(--color-accent)',
            }
        },
    },
    plugins: [],
};