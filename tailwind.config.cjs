/** @type {import('tailwindcss').Config} */
module.exports = {
  //what we saying to tailwind that ,Go chechk at "src" folder for all the files
  //
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "SPgreen": "1DB954"
      },
      gridTemplateColumns: {
        "auto-fill-cards": "repeat(auto-fill, minmax(180px, 1fr))",
      },
      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 35px 35px rgba(0, 0, 0, 0.25)",
          "0 45px 65px rgba(0, 0, 0, 0.15)",
        ],
      },
      keyframes: {
        ChangeBarOpacity: {
          '0%': { opacity:'0' },
          '100%': { opacity:'100'},
        }
      },
      animation: {
        fadeColors: 'ChangeBarOpacity 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
