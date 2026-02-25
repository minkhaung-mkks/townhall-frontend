import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI, categoryAPI, statsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import WorkCard from '../components/WorkCard';
import SearchBar from '../components/SearchBar';
import theme from '../theme';

function Home() {
    const [works, setWorks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const { user } = useAuth();

    const fetchWorks = async () => {
        setLoading(true);
        const params = {
            page: pagination.page,
            limit: pagination.limit
        };

        if (search) {
            params.search = search;
        }
        if (selectedCategory) {
            params.categoryId = selectedCategory;
        }
        if (selectedTag) {
            params.tag = selectedTag;
        }
        if (selectedAuthor) {
            params.authorId = selectedAuthor;
        }
        if (sortBy) {
            params.sortBy = sortBy;
        }

        const result = await workAPI.getAll(params);

        if (result.data) {
            setWorks(result.data.works);
            setPagination(prev => ({
                ...prev,
                total: result.data.pagination.total,
                totalPages: result.data.pagination.totalPages
            }));
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        const result = await categoryAPI.getAll();
        if (result.data) {
            setCategories(result.data.categories);
        }
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        const result = await statsAPI.getStats();
        if (result.data) {
            setStats(result.data);
        }
        setStatsLoading(false);
    };

    useEffect(() => {
        fetchCategories();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchWorks();
    }, [pagination.page, selectedCategory, selectedTag, selectedAuthor, sortBy]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchWorks();
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const rankBg = (rank) =>
        rank === 1 ? theme.colors.rankGold :
        rank === 2 ? theme.colors.rankSilver :
        rank === 3 ? theme.colors.rankBronze : theme.colors.hoverBg;

    const TopWriterCard = ({ writer, rank }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            background: rank <= 3 ? theme.colors.hoverBg : 'transparent',
            borderRadius: '2px',
            marginBottom: '8px'
        }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: rankBg(rank),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                marginRight: '12px',
                color: rank <= 3 ? 'white' : theme.colors.ink,
            }}>
                {rank}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: theme.colors.ink }}>
                    {writer.author?.firstname} {writer.author?.lastname}
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.muted, fontFamily: theme.fonts.accent }}>
                    @{writer.author?.username}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{
                    background: theme.colors.rust,
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>
                    {writer.likeCount} {writer.likeCount === 1 ? 'like' : 'likes'}
                </div>
                <div style={{
                    background: theme.colors.burgundy,
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>
                    {writer.workCount} {writer.workCount === 1 ? 'work' : 'works'}
                </div>
            </div>
        </div>
    );

    const TopArticleCard = ({ article, rank }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            background: rank <= 3 ? theme.colors.hoverBg : 'transparent',
            borderRadius: '2px',
            marginBottom: '8px'
        }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: rankBg(rank),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                marginRight: '12px',
                color: rank <= 3 ? 'white' : theme.colors.ink,
            }}>
                {rank}
            </div>
            <div style={{ flex: 1 }}>
                <Link to={`/work/${article.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: '500', color: theme.colors.burgundy }}>
                        {article.work?.title}
                    </div>
                </Link>
            </div>
            <div style={{
                background: theme.colors.rust,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '2px',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                {article.likeCount} {article.likeCount === 1 ? 'like' : 'likes'}
            </div>
        </div>
    );

    const CategoryBar = ({ category, maxCount }) => (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '500', color: theme.colors.ink }}>{category.category?.name}</span>
                <span style={{ color: theme.colors.muted }}>{category.count}</span>
            </div>
            <div style={{
                height: '8px',
                background: theme.colors.hoverBg,
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${(category.count / maxCount) * 100}%`,
                    background: `linear-gradient(90deg, ${theme.colors.burgundy}, ${theme.colors.navy})`,
                    borderRadius: '2px'
                }} />
            </div>
        </div>
    );

    return (
        <div className="container">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h1 style={{ fontFamily: theme.fonts.heading }}>Published Works</h1>
                {user && (
                    <Link to="/create-work" className="btn btn-primary">
                        + Create New Work
                    </Link>
                )}
            </div>

            {!statsLoading && stats && (
                <div style={{ marginBottom: '30px' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>Top Writers</h3>
                            {stats.topWriters?.length > 0 ? (
                                stats.topWriters.map((writer, index) => (
                                    <TopWriterCard key={writer.authorId} writer={writer} rank={index + 1} />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: theme.colors.muted, padding: '20px' }}>
                                    No writers yet
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>Top Articles</h3>
                            {stats.topArticles?.length > 0 ? (
                                stats.topArticles.map((article, index) => (
                                    <TopArticleCard key={article.workId} article={article} rank={index + 1} />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: theme.colors.muted, padding: '20px' }}>
                                    No articles yet
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>Works by Category</h3>
                            {stats.worksByCategory?.length > 0 ? (
                                stats.worksByCategory.map((cat) => (
                                    <CategoryBar
                                        key={cat.categoryId}
                                        category={cat}
                                        maxCount={Math.max(...stats.worksByCategory.map(c => c.count))}
                                    />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: theme.colors.muted, padding: '20px' }}>
                                    No categories yet
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>Recent Works</h3>
                            {stats.recentWorks?.length > 0 ? (
                                stats.recentWorks.map((work) => (
                                    <Link
                                        key={work._id}
                                        to={`/work/${work._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <div style={{
                                            padding: '12px',
                                            borderBottom: `1px solid ${theme.colors.border}`,
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ fontWeight: '500', marginBottom: '4px', color: theme.colors.ink }}>
                                                {work.title}
                                            </div>
                                            <div style={{ fontSize: '12px', color: theme.colors.muted, fontFamily: theme.fonts.accent }}>
                                                By {work.author ? `${work.author.firstname} ${work.author.lastname}` : work.authorId}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: theme.colors.muted, padding: '20px' }}>
                                    No works yet
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="divider-ornament" />
                </div>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <SearchBar
                        search={search}
                        onSearchChange={setSearch}
                        onSearch={handleSearch}
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '2px',
                        border: `1px solid ${theme.colors.border}`,
                        background: theme.colors.paper,
                        color: theme.colors.ink,
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {(() => {
                const allTags = [...new Set(works.flatMap(w => w.tags || []))].sort();
                if (allTags.length === 0) return null;
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        <span
                            onClick={() => { setSelectedTag(''); setPagination(prev => ({ ...prev, page: 1 })); }}
                            style={{
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                background: !selectedTag ? theme.colors.burgundy : theme.colors.hoverBg,
                                color: !selectedTag ? 'white' : theme.colors.ink,
                                fontWeight: !selectedTag ? 'bold' : 'normal',
                            }}
                        >
                            All Tags
                        </span>
                        {allTags.map(tag => (
                            <span
                                key={tag}
                                onClick={() => { setSelectedTag(tag); setPagination(prev => ({ ...prev, page: 1 })); }}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    background: selectedTag === tag ? theme.colors.burgundy : theme.colors.hoverBg,
                                    color: selectedTag === tag ? 'white' : theme.colors.ink,
                                    fontWeight: selectedTag === tag ? 'bold' : 'normal',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                );
            })()}

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '200px', flexShrink: 0 }}>
                    <div className="card">
                        <h4 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>Categories</h4>
                        <div
                            onClick={() => setSelectedCategory('')}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                background: !selectedCategory ? theme.colors.hoverBg : 'transparent',
                                borderRadius: '2px',
                                marginBottom: '5px',
                                color: theme.colors.ink,
                            }}
                        >
                            All Categories
                        </div>
                        {categories.map(cat => (
                            <div
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                style={{
                                    padding: '8px',
                                    cursor: 'pointer',
                                    background: selectedCategory === cat._id ? theme.colors.hoverBg : 'transparent',
                                    borderRadius: '2px',
                                    marginBottom: '5px',
                                    color: theme.colors.ink,
                                }}
                            >
                                {cat.name}
                            </div>
                        ))}
                    </div>

                    {(() => {
                        const authors = works
                            .filter(w => w.author && w.authorId)
                            .reduce((acc, w) => {
                                if (!acc.find(a => a.id === w.authorId)) {
                                    acc.push({ id: w.authorId, name: `${w.author.firstname} ${w.author.lastname}` });
                                }
                                return acc;
                            }, []);
                        if (authors.length === 0) return null;
                        return (
                            <div className="card" style={{ marginTop: '16px' }}>
                                <h4 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>Authors</h4>
                                <div
                                    onClick={() => { setSelectedAuthor(''); setPagination(prev => ({ ...prev, page: 1 })); }}
                                    style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        background: !selectedAuthor ? theme.colors.hoverBg : 'transparent',
                                        borderRadius: '2px',
                                        marginBottom: '5px',
                                        color: theme.colors.ink,
                                    }}
                                >
                                    All Authors
                                </div>
                                {authors.map(author => (
                                    <div
                                        key={author.id}
                                        onClick={() => { setSelectedAuthor(author.id); setPagination(prev => ({ ...prev, page: 1 })); }}
                                        style={{
                                            padding: '8px',
                                            cursor: 'pointer',
                                            background: selectedAuthor === author.id ? theme.colors.hoverBg : 'transparent',
                                            borderRadius: '2px',
                                            marginBottom: '5px',
                                            color: theme.colors.ink,
                                        }}
                                    >
                                        {author.name}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                <div style={{ flex: 1 }}>
                    {loading ? (
                        <div className="loading">Loading works...</div>
                    ) : works.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: theme.colors.muted }}>No works found.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px'
                            }}>
                                {works.map(work => (
                                    <WorkCard key={work._id} work={work} />
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginTop: '30px'
                                }}>
                                    <button
                                        className="btn btn-secondary"
                                        disabled={pagination.page === 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ padding: '10px', color: theme.colors.secondary }}>
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        className="btn btn-secondary"
                                        disabled={pagination.page === pagination.totalPages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
