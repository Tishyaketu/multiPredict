function DynamicForm({ schema, onSubmit, loading, initialValues = {} }) {
    const [formData, setFormData] = React.useState(initialValues);

    // Update formData when initialValues change (e.g. from prescription upload)
    React.useEffect(() => {
        if (Object.keys(initialValues).length > 0) {
            setFormData(prev => ({ ...prev, ...initialValues }));
        }
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!schema || schema.length === 0) return null;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schema.map(field => (
                <div key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{field.label}</label>
                    {field.inputType === 'select' ? (
                        <select
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={field.validation?.required}
                        >
                            <option value="">Select...</option>
                            {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.inputType || 'text'}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            min={field.validation?.min}
                            max={field.validation?.max}
                            step={field.inputType === 'number' ? 'any' : undefined}
                            required={field.validation?.required}
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '1rem' }}
            >
                {loading ? 'Analyzing...' : 'Predict'}
            </button>
        </form>
    );
}
import React from 'react';
export default DynamicForm;
