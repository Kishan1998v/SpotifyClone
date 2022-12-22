/** @type {import('tailwindcss').Config} */
module.exports = {
  //what we saying to tailwind that ,Go chechk at "src" folder for all the files
  //
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {},
      gridTemplateColumns: {
        "auto-fill-cards": "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [],
};
