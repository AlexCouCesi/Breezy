'use client';
import React from 'react';

// Bouton réutilisable avec variantes de style
export default function Button({
    children,
    onClick,
    variant = "primary",   // Style par défaut : noir
    type = "button",       // Type HTML du bouton
    className = "",        // Classes supplémentaires
}) {
    // Classes de base communes à tous les boutons
    const base =
        "px-6 py-2 rounded-full font-medium text-white transition duration-200";

    // Variantes de couleur disponibles
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
