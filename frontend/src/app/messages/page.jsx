import React from 'react';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-light text-slate-800">Messages</h1>
              <p className="text-slate-500 mt-1">Aucun message dans votre boîte de réception</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="mr-2">✏️</span>
              Nouveau message
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              Paramètres
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mb-8">
          <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
            Boîte de réception (0)
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            Envoyés (0)
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            Brouillons (0)
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            Archivés (0)
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            Corbeille (0)
          </button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          {/* Main illustration */}
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <span className="text-5xl">📭</span>
          </div>

          {/* Title and description */}
          <h2 className="text-2xl font-light text-slate-800 mb-3">Votre boîte de réception est vide</h2>
          <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
            Vous n'avez aucun message pour le moment. Commencez une conversation ou attendez de recevoir votre premier
            message.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <button className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
              <span className="mr-2">✏️</span>
              Écrire un message
            </button>
            <button className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              Inviter des contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
