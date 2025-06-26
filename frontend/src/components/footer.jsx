// Composant Footer global
import React from 'react';
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
        
        {/* Texte de copyright avec année dynamique */}
        <p>&copy; {new Date().getFullYear()} Breezy. Tous droits réservés.</p>

        {/* Liens de navigation secondaire */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-zinc-700">Conditions</a>
          <a href="#" className="hover:text-zinc-700">Confidentialité</a>
          <a href="#" className="hover:text-zinc-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}
