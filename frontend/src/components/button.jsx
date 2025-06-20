'use client';

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
        primary: "bg-black hover:bg-zinc-800",
        secondary: "bg-zinc-600 hover:bg-zinc-500",
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
