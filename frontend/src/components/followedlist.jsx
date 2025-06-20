'use client';

export default function FollowedList() {
    return (
        <div>
        <h2 className="text-xl font-semibold mb-4">Comptes suivis</h2>
        <ul className="space-y-4">
            {[1, 2, 3].map((_, index) => (
            <li key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <span className="text-gray-800">@nickname</span>
            </li>
            ))}
        </ul>
        </div>
    );
}