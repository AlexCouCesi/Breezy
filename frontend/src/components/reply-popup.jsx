"use client"

import { useState } from "react"

export default function ReplyPopup({ originalMessage, authorName, onReply, trigger }) {
  const [replyText, setReplyText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    if (replyText.trim()) {
      onReply(replyText.trim())
      setReplyText("")
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setReplyText("")
    setIsOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit()
    }
    if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <>
      {/* Trigger button */}
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button
            type="button"
            className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors duration-200 p-2 rounded hover:bg-teal-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Répondre
          </button>
        )}
      </div>

      {/* Modal backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-[9999] p-4" // Moins sombre + très haut z-index
          onClick={handleBackdropClick}
        >
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden transform -translate-y-10">
            {/* Message original */}
            <div className="bg-green-700 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-90">Message de {authorName}</span>
                <button
                  onClick={handleCancel}
                  className="text-white hover:bg-green-600 rounded p-1 transition-colors"
                  title="Fermer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{originalMessage}</p>
            </div>

            {/* Zone de réponse */}
            <div className="bg-green-100 p-4">
              <label className="block text-sm font-medium text-green-800 mb-2">Votre réponse :</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre réponse ici... (Ctrl+Enter pour envoyer, Échap pour fermer)"
                className="w-full min-h-[100px] bg-white border-2 border-green-300 focus:border-green-500 focus:outline-none rounded-md p-3 resize-none transition-colors"
                autoFocus
              />

              <div className="text-xs text-green-600 mt-1">{replyText.length} caractères</div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border-2 border-green-300 text-green-700 hover:bg-green-50 rounded-md transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
