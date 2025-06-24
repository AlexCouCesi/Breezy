'use client';

// Liste des comptes que l'utilisateur suit (version statique pour l’instant)
export default function FollowedList({ followingList }) {
    return (
        <aside className="w-80 bg-white border-l p-6 hidden lg:block">
            <h2 className="text-xl font-semibold mb-4">Comptes suivis</h2>
            <ul className="space-y-4">
                {followingList.map((user, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <img
                            src={user.profilePicture || '/assets/icones_divers/profile_icon.png'}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover bg-gray-300"
                        />
                        <span className="text-gray-800">@{user.username}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
