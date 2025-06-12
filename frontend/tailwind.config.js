// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: "#F9FAFB",
                card: "#E5E7EB",
                text: "#111827",
                primary: "#3B82F6",
                "primary-dark": "#1E40AF",
                error: "#DC2626",
                success: "#16A34A",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                lg: "1rem",
                full: "9999px",
            },
            boxShadow: {
                card: "0 1px 3px rgba(0, 0, 0, 0.1)",
                soft: "0 4px 6px rgba(0, 0, 0, 0.05)",
            },
        },
    },
    plugins: [],
}
