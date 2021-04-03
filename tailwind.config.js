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
            },
            colors: {
                gold: {
                    '50': '#f9f5e6',
                    '100': '#faefc2',
                    '200': '#f7e485',
                    '300': '#f2d041',
                    '400': '#ebb216',
                    '500': '#f7a738',
                    '600': '#d76b05',
                    '700': '#b65109',
                    '800': '#943f10',
                    '900': '#793411',
                },
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};
