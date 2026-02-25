import theme from '../theme';

function Footer() {
    return (
        <footer style={{
            background: theme.colors.pageBg,
            color: theme.colors.ink,
            padding: '24px 20px',
            marginTop: '40px',
            textAlign: 'center',
            borderTop: `1px solid ${theme.colors.ink}`,
        }}>
            <p style={{
                fontFamily: theme.fonts.heading,
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
            }}>Town Hall Board</p>
            <p style={{
                fontFamily: theme.fonts.accent,
                fontSize: '18px',
                color: theme.colors.muted,
                marginTop: '4px',
            }}>Est. 2024</p>
        </footer>
    );
}

export default Footer;
