import theme from '../theme';

function SearchBar({ search, onSearchChange, onSearch }) {
    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
        }}>
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search works by title or content..."
                style={{
                    flex: 1,
                    padding: '10px 15px',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '2px',
                    fontSize: '14px',
                    background: theme.colors.cardBg,
                    fontFamily: theme.fonts.body,
                    color: theme.colors.ink,
                }}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        onSearch();
                    }
                }}
            />
            <button
                className="btn btn-primary"
                onClick={onSearch}
            >
                Search
            </button>
        </div>
    );
}

export default SearchBar;
