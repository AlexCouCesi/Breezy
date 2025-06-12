export default function Button({ children, onClick, variant = "primary", type = "button" }) {
    const base = "px-6 py-2 rounded text-white font-medium transition duration-200";
    const variants = {
        primary: "bg-primary hover:bg-primary-dark",
        secondary: "bg-gray-800 hover:bg-gray-900",
        danger: "bg-error hover:bg-red-700",
    };

    return (
        <button onClick={onClick} type={type} className={`${base} ${variants[variant]}`}>
        {children}
        </button>
    );
}
