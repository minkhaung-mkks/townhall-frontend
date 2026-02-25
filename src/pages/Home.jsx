import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI, categoryAPI, statsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import WorkCard from '../components/WorkCard';
import SearchBar from '../components/SearchBar';

function Home() {
    const [works, setWorks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
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
    }, [pagination.page, selectedCategory]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchWorks();
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };



    const TopWriterCard = ({ writer, rank }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            background: rank <= 3 ? '#f8f9fa' : 'transparent',
            borderRadius: '8px',
            marginBottom: '8px'
        }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                marginRight: '12px'
            }}>
                {rank}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>
                    {writer.author?.firstname} {writer.author?.lastname}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    @{writer.author?.username}
                </div>
            </div>
            <div style={{
                background: '#007bff',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                {writer.workCount} {writer.workCount === 1 ? 'work' : 'works'}
            </div>
        </div>
    );

    const TopArticleCard = ({ article, rank }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            background: rank <= 3 ? '#f8f9fa' : 'transparent',
            borderRadius: '8px',
            marginBottom: '8px'
        }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                marginRight: '12px'
            }}>
                {rank}
            </div>
            <div style={{ flex: 1 }}>
                <Link to={`/work/${article.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: '500', color: '#007bff' }}>
                        {article.work?.title}
                    </div>
                </Link>
            </div>
            <div style={{
                background: '#28a745',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                {article.commentCount} {article.commentCount === 1 ? 'comment' : 'comments'}
            </div>
        </div>
    );

    const CategoryBar = ({ category, maxCount }) => (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '500' }}>{category.category?.name}</span>
                <span style={{ color: '#666' }}>{category.count}</span>
            </div>
            <div style={{
                height: '8px',
                background: '#e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${(category.count / maxCount) * 100}%`,
                    background: 'linear-gradient(90deg, #007bff, #6c63ff)',
                    borderRadius: '4px'
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
                <h1>Published Works</h1>
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
                            <h3 style={{ marginBottom: '15px' }}>Top Writers</h3>
                            {stats.topWriters?.length > 0 ? (
                                stats.topWriters.map((writer, index) => (
                                    <TopWriterCard key={writer.authorId} writer={writer} rank={index + 1} />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                                    No writers yet
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '15px' }}>Top Articles</h3>
                            {stats.topArticles?.length > 0 ? (
                                stats.topArticles.map((article, index) => (
                                    <TopArticleCard key={article.workId} article={article} rank={index + 1} />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
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
                            <h3 style={{ marginBottom: '15px' }}>Works by Category</h3>
                            {stats.worksByCategory?.length > 0 ? (
                                stats.worksByCategory.map((cat) => (
                                    <CategoryBar 
                                        key={cat.categoryId} 
                                        category={cat} 
                                        maxCount={Math.max(...stats.worksByCategory.map(c => c.count))}
                                    />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                                    No categories yet
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '15px' }}>Recent Works</h3>
                            {stats.recentWorks?.length > 0 ? (
                                stats.recentWorks.map((work) => (
                                    <Link 
                                        key={work._id} 
                                        to={`/work/${work._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <div style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #eee',
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                                {work.title}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                By {work.authorId}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                                    No works yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <SearchBar 
                search={search}
                onSearchChange={setSearch}
                onSearch={handleSearch}
            />

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '200px', flexShrink: 0 }}>
                    <div className="card">
                        <h4 style={{ marginBottom: '15px' }}>Categories</h4>
                        <div
                            onClick={() => setSelectedCategory('')}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                background: !selectedCategory ? '#e9ecef' : 'transparent',
                                borderRadius: '5px',
                                marginBottom: '5px'
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
                                    background: selectedCategory === cat._id ? '#e9ecef' : 'transparent',
                                    borderRadius: '5px',
                                    marginBottom: '5px'
                                }}
                            >
                                {cat.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    {loading ? (
                        <div className="loading">Loading works...</div>
                    ) : works.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                            <p>No works found.</p>
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
                                    <span style={{ padding: '10px' }}>
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