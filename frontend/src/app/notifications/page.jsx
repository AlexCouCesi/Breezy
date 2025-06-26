'use client';
import React from 'react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 8,
      type: "info",
      icon: "📄",
      title: "Mise à jour des conditions d'utilisation",
      description: "Nos conditions d'utilisation ont été mises à jour",
      time: "Il y a 1 semaine",
      unread: false,
      color: "bg-gray-50 border-gray-200",
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <span className="text-2xl"><img src="/assets/icones_nav/bell_icon.png" alt="Notification" className="w-5 h-5" /></span>
            </div>
            <div>
              <h1 className="text-3xl font-light text-slate-800">Notifications</h1>
              <p className="text-slate-500 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} nouvelle${unreadCount > 1 ? "s" : ""} notification${unreadCount > 1 ? "s" : ""}`
                  : "Toutes les notifications sont lues"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <span>⚙️</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${notification.color} ${
                notification.unread ? "shadow-sm" : "opacity-75"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg text-lg ${
                    notification.type === "system"
                      ? "bg-blue-100"
                      : notification.type === "activity"
                        ? "bg-green-100"
                        : notification.type === "info"
                          ? "bg-amber-100"
                          : notification.type === "feature"
                            ? "bg-purple-100"
                            : notification.type === "performance"
                              ? "bg-orange-100"
                              : "bg-gray-100"
                  }`}
                >
                  {notification.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                        {notification.title}
                        {notification.unread && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Nouveau
                          </span>
                        )}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{notification.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <span>🕒</span>
                      {notification.time}
                    </span>

                    {notification.unread && (
                      <button className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Message */}
        <div className="text-center mt-12 py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔔</span>
          </div>
          <p className="text-slate-500 text-sm">Vous êtes à jour avec toutes vos notifications</p>
        </div>
      </div>
    </div>
  )
}