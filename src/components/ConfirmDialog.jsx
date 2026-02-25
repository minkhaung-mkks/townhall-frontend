import { useState, useEffect } from 'react';

function ConfirmDialog({ 
    isOpen, 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?', 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmStyle = 'danger',
    onConfirm, 
    onCancel 
}) {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        setVisible(isOpen);
    }, [isOpen]);

    if (!visible) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        setVisible(false);
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        setVisible(false);
    };

    const buttonStyles = {
        danger: 'btn-danger',
        primary: 'btn-primary',
        warning: 'btn-secondary'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <h3 style={{ marginBottom: '15px' }}>{title}</h3>
                <p style={{ color: '#666', marginBottom: '25px' }}>{message}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`btn ${buttonStyles[confirmStyle] || 'btn-primary'}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;