// frontend/src/app/page.js
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur Breezy</h1>
      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Se connecter
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Créer un compte
        </Link>
      </div>
    </main>
  )
}
