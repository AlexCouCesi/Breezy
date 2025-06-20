'use client';

export function Input({ type = "text", ...props }) {
    return (
        <input
        type={type}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        {...props}
        />
    );
}
