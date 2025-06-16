export function FormGroup({ label, children, error = "" }) {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            {children}
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}

export default FormGroup;