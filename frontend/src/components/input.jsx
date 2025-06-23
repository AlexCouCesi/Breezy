'use client';

// Champ de saisie réutilisable avec styles par défaut
export function Input({ type = "text", ...props }) {
    return (
        <input
            type={type}
            // Styles par défaut : responsive, accessible et cohérents
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            {...props} // Permet de passer `value`, `onChange`, `id`, `name`, etc.
        />
    );
}
