export default function Button({
    children,
    onClick,
    variant = "primary",
    type = "button",
    className = "",
    }) {
    const base =
        "px-6 py-2 rounded-full font-medium text-white transition duration-200";
    const variants = {
        primary: "bg-black hover:bg-zinc-800",          // bouton foncé
        secondary: "bg-zinc-700 hover:bg-zinc-600",      // bouton gris
    };

    return (
        <button
        onClick={onClick}
        type={type}
        className={`${base} ${variants[variant]} ${className}`}
        >
        {children}
        </button>
    );
}
