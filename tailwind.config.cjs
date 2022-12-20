/** @type {import('tailwindcss').Config} */
module.exports = {
  //what we saying to tailwind that ,Go chechk at "src" folder for all the files
  //
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "spgreen": "1db954",
        "spdark": "191414",
      },
    },
  },
  plugins: [],
};
