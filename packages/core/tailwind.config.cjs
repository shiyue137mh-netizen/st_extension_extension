/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
    // Prefix all Tailwind classes to avoid conflicts
    prefix: 'ee-',
    // Disable preflight to prevent global style pollution
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            // Custom color palette for Extension Extension
            colors: {
                'ee-bg': '#0a0a0b',
                'ee-panel': '#18181b',
                'ee-surface': '#27272a',
                'ee-border': '#3f3f46',
                'ee-accent': '#3b82f6',
                'ee-text': '#e4e4e7',
                'ee-muted': '#71717a',
            },
        },
    },
    plugins: [],
};
