module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6",          // bleu doux
                secondary: "#1E293B",        // gris très foncé
                accent: "#E0F2FE",           // bleu très pâle (hover / background doux)
                bg: "#F8FAFC",               // fond clair général
                card: "#FFFFFF",             // blocs / cartes
                text: "#0F172A",             // noir bleuté lisible
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                lg: "1rem",
                full: "9999px",
            },
            boxShadow: {
                soft: "0 4px 12px rgba(0, 0, 0, 0.05)",
            },
            }
    },
    plugins: [],
}
