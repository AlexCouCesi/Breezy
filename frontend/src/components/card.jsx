'use client';

// Composant de carte simple pour structurer le contenu
export function Card({ children }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {children}
        </div>
    );
}
