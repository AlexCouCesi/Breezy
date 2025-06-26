'use client';
import React from 'react';

// Composant FormGroup : regroupe un label, un champ et un message d’erreur
export function FormGroup({ label, children, error = "" }) {
    return (
        <div className="mb-5">
            {/* Affiche le label si présent */}
            {label && (
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    {label}
                </label>
            )}

            {/* Champ passé en tant qu’enfant */}
            {children}

            {/* Message d’erreur en rouge si fourni */}
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}

export default FormGroup;
