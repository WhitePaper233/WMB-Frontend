/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.index',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
