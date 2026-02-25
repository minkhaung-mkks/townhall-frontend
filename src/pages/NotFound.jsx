import { Link } from 'react-router-dom';
import theme from '../theme';

function NotFound() {
    return (
        <div className="container" style={{
            textAlign: 'center',
            padding: '60px 20px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h1 style={{
                fontSize: '72px',
                color: theme.colors.rust,
                marginBottom: '20px',
                fontFamily: theme.fonts.heading,
                fontWeight: 900,
            }}>404</h1>
            <h2 style={{ marginBottom: '20px', fontFamily: theme.fonts.heading }}>Page Not Found</h2>
            <p style={{ color: theme.colors.secondary, marginBottom: '30px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back Home
            </Link>
        </div>
    );
}

export default NotFound;
