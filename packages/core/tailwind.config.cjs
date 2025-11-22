/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
        "../ui/src/**/*.{ts,tsx}"
    ],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false,
    },
    important: '#extension-extension-root',
    plugins: [],
}
