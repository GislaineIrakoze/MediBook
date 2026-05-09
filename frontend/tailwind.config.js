/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        pine: "#0f3d2f",
        forest: "#145c44",
        emerald: "#1f8f65",
        mint: "#dff6ec",
        sage: "#eff7f3",
        silver: "#f3f5f4"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(20, 92, 68, 0.18)",
        card: "0 20px 50px rgba(15, 61, 47, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))"
      }
    }
  },
  plugins: []
};
