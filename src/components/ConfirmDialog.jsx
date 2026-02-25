import { useState, useEffect } from 'react';
import theme from '../theme';

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
                background: theme.colors.cardBg,
                padding: '30px',
                borderRadius: '2px',
                maxWidth: '400px',
                width: '90%',
                border: `1px solid ${theme.colors.border}`,
            }}>
                <h3 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>{title}</h3>
                <p style={{ color: theme.colors.secondary, marginBottom: '25px' }}>{message}</p>
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
