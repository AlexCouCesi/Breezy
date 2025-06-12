export default function Button({ children, onClick, variant = "primary", type = "button", className = "" }) {
    const base = "px-6 py-2 rounded-full font-medium text-white transition duration-200";
    const variants = {
        primary: "bg-primary hover:bg-blue-700",
        secondary: "bg-secondary hover:bg-gray-800",
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
