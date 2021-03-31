module.exports = {
    prefix: '',
    purge: {
        content: [
            './src/**/*.{html,ts}',
        ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                'sans': ["'Noto Sans'", 'sans-serif']
            },
            fontSize: {
                '4.5xl': '2.625rem'
            },
            spacing: {
                '50': '12.5rem'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};
