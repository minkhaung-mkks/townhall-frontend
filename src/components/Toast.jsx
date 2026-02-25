import { useState, useEffect } from 'react';
import theme from '../theme';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const style = theme.toast[type] || theme.toast.info;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: style.bg,
            border: `1px solid ${style.border}`,
            borderLeft: `4px solid ${style.border}`,
            color: style.text,
            borderRadius: '2px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: theme.fonts.body,
            animation: 'slideIn 0.3s ease-out'
        }}>
            <style>
                {`@keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }`}
            </style>
            <span>{message}</span>
            <button
                onClick={() => { setVisible(false); if (onClose) onClose(); }}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: style.text,
                    padding: '0',
                    lineHeight: '1'
                }}
            >
                &times;
            </button>
        </div>
    );
}

export default Toast;
