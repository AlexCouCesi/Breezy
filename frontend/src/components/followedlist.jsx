export default function FollowedList({ following, onFilter, onUnfollow }) {
    return (
        <div>
            <h3 className="font-bold text-lg mb-4">Comptes suivis</h3>
            {following.length === 0 ? (
                <p className="text-gray-500 text-sm">Vous ne suivez encore personne.</p>
            ) : (
                <ul className="space-y-2">
                    {following.map(user => (
                        <li key={user._id} className="flex justify-between items-center">
                            <span
                                className="cursor-pointer text-teal-600 hover:underline"
                                onClick={() => onFilter(user._id)}
                            >
                                @{user.username}
                            </span>
                            <button
                                onClick={() => onUnfollow(user._id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {following.length > 0 && (
                <button
                    onClick={() => onFilter(null)}
                    className="mt-4 text-sm text-gray-500 hover:underline"
                >
                    Voir tous les posts
                </button>
            )}
        </div>
    );
}
