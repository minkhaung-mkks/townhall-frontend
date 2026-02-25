function EmptyState({ 
    icon = '📝', 
    title = 'No data found', 
    description = '', 
    action = null 
}) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>{icon}</div>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>{title}</h3>
            {description && (
                <p style={{ marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}

export default EmptyState;