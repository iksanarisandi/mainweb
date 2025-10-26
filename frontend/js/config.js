// API Configuration
// Use relative URLs to route through _worker.js proxy (CORS-enabled)
const API_URL = '/api'; // Relative URL = same origin, goes through Pages _worker.js

const config = {
    apiUrl: API_URL,
    endpoints: {
        auth: {
            register: `${API_URL}/auth/register`,
            login: `${API_URL}/auth/login`,
            profile: `${API_URL}/auth/profile`
        },
        materials: {
            all: `${API_URL}/materials`,
            byId: (id) => `${API_URL}/materials/${id}`
        },
        progress: {
            all: `${API_URL}/progress`,
            submit: `${API_URL}/progress/submit`
        },
        leaderboard: `${API_URL}/leaderboard`,
        profile: {
            get: `${API_URL}/profile`,
            update: `${API_URL}/profile`,
            uploadAvatar: `${API_URL}/profile/avatar`,
            badges: `${API_URL}/profile/badges`,
            activity: `${API_URL}/profile/activity`
        },
        admin: {
            stats: `${API_URL}/admin/stats`,
            users: `${API_URL}/admin/users`,
            materials: `${API_URL}/admin/materials`,
            badges: `${API_URL}/admin/badges`,
            createMaterial: `${API_URL}/admin/materials`,
            updateMaterial: (id) => `${API_URL}/admin/materials/${id}`,
            deleteMaterial: (id) => `${API_URL}/admin/materials/${id}`,
            createBadge: `${API_URL}/admin/badges`
        }
    }
};

// Helper functions
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function isAuthenticated() {
    return !!getToken();
}

async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        removeToken();
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
    }
    
    return response;
}

function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}
