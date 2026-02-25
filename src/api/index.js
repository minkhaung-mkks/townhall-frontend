const API_BASE_URL = 'http://localhost:3000/api';

async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            return { error: data.message || 'Something went wrong', status: response.status };
        }
        
        return { data, status: response.status };
    } catch (error) {
        console.log('API Error:', error);
        return { error: 'Network error. Please check your connection.' };
    }
}

export const authAPI = {
    login: (email, password) => apiCall('/user/login', { method: 'POST', body: { email, password } }),
    register: (userData) => apiCall('/user', { method: 'POST', body: userData }),
    logout: () => apiCall('/user/logout', { method: 'POST' }),
    getProfile: () => apiCall('/user/profile'),
    updateProfile: (id, data) => apiCall(`/user/${id}`, { method: 'PATCH', body: data }),
};

export const userAPI = {
    getAll: (page = 1, limit = 10) => apiCall(`/user?page=${page}&limit=${limit}`),
    getById: (id) => apiCall(`/user/${id}`),
    update: (id, data) => apiCall(`/user/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => apiCall(`/user/${id}`, { method: 'DELETE' }),
};

export const workAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/work${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiCall(`/work/${id}`),
    create: (data) => apiCall('/work', { method: 'POST', body: data }),
    update: (id, data) => apiCall(`/work/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => apiCall(`/work/${id}`, { method: 'DELETE' }),
};

export const draftAPI = {
    getAll: (workId = null) => {
        const query = workId ? `?workId=${workId}` : '';
        return apiCall(`/draft${query}`);
    },
    getById: (id) => apiCall(`/draft/${id}`),
    create: (data) => apiCall('/draft', { method: 'POST', body: data }),
    update: (id, data) => apiCall(`/draft/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => apiCall(`/draft/${id}`, { method: 'DELETE' }),
};

export const commentAPI = {
    getByWork: (workId, page = 1, limit = 10) => apiCall(`/comment?workId=${workId}&page=${page}&limit=${limit}`),
    create: (data) => apiCall('/comment', { method: 'POST', body: data }),
    update: (id, data) => apiCall(`/comment/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => apiCall(`/comment/${id}`, { method: 'DELETE' }),
};

export const reviewAPI = {
    getAll: (workId = null) => {
        const query = workId ? `?workId=${workId}` : '';
        return apiCall(`/review${query}`);
    },
    create: (data) => apiCall('/review', { method: 'POST', body: data }),
    update: (id, data) => apiCall(`/review/${id}`, { method: 'PATCH', body: data }),
};

export const categoryAPI = {
    getAll: (page = 1, limit = 50) => apiCall(`/category?page=${page}&limit=${limit}`),
    getById: (id) => apiCall(`/category/${id}`),
    create: (data) => apiCall('/category', { method: 'POST', body: data }),
    update: (id, data) => apiCall(`/category/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => apiCall(`/category/${id}`, { method: 'DELETE' }),
};

export const adminAPI = {
    updateUser: (id, data) => apiCall(`/admin/user/${id}`, { method: 'PATCH', body: data }),
    deleteUser: (id) => apiCall(`/admin/user/${id}`, { method: 'DELETE' }),
    updateWork: (id, data) => apiCall(`/admin/work/${id}`, { method: 'PATCH', body: data }),
    deleteWork: (id) => apiCall(`/admin/work/${id}`, { method: 'DELETE' }),
    updateComment: (id, data) => apiCall(`/admin/comment/${id}`, { method: 'PATCH', body: data }),
    deleteComment: (id) => apiCall(`/admin/comment/${id}`, { method: 'DELETE' }),
};
