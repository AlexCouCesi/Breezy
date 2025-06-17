'use client';

export function FormGroup({ label, children, error = "" }) {
    return (
        <div className="mb-5">
        {label && (
            <label className="block text-sm font-medium text-gray-800 mb-1">
            {label}
            </label>
        )}
        {children}
        {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
        </div>
    );
}

export default FormGroup;
