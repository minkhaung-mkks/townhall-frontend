import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI, categoryAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import WorkCard from '../components/WorkCard';
import SearchBar from '../components/SearchBar';

function Home() {
    const [works, setWorks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchCategories();
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