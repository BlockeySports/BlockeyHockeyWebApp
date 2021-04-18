module.exports = {
    prefix: '',
    important: true,
    purge: ["./src/**/*.{html,ts}"],
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
                'black': {
                    DEFAULT: '#000000',
                    '50': '#3C3C3C',
                    '100': '#383838',
                    '200': '#303030',
                    '300': '#292929',
                    '400': '#212121',
                    '500': '#1A1A1A',
                    '600': '#121212',
                    '700': '#0A0A0A',
                    '800': '#030303',
                    '900': '#000000'
                },
            },
            minWidth: {
                '36': '9rem'
            },
            margin: {
                '4.5': '1.125rem'
            }
        },
    },
    variants: {
        extend: {
            display: ['dark'],
            borderWidth: ['hover']
        },
        scrollbar: ['dark'],
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('tailwind-scrollbar')],
};
