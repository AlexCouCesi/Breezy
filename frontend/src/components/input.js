export function Input({ type = "text", ...props }) {
    return (
        <input
        type={type}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
        />
    );
}