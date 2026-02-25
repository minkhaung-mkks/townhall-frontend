import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="container" style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h1 style={{ fontSize: '72px', color: '#dc3545', marginBottom: '20px' }}>404</h1>
            <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back Home
            </Link>
        </div>
    );
}

export default NotFound;