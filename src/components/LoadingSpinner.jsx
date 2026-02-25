function LoadingSpinner({ size = 'medium', text = '' }) {
    const sizes = {
        small: { width: '20px', height: '20px', border: '2px' },
        medium: { width: '40px', height: '40px', border: '4px' },
        large: { width: '60px', height: '60px', border: '6px' }
    };

    const spinnerStyle = {
        ...sizes[size],
        border: `${sizes[size].border} solid #f3f3f3`,
        borderTop: `${sizes[size].border} solid #007bff`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <style>
                {`@keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }`}
            </style>
            <div style={spinnerStyle}></div>
            {text && <p style={{ marginTop: '10px', color: '#666' }}>{text}</p>}
        </div>
    );
}

export default LoadingSpinner;