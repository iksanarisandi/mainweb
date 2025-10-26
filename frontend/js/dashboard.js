// Dashboard Page JavaScript
let currentUser = null;
let materials = [];
let userProgress = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;
    
    // Setup logout button
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Setup category tabs
    setupCategoryTabs();
    
    // Load all data
    await Promise.all([
        loadUserProfile(),
        loadMaterials(),
        loadUserProgress()
    ]);
});

async function loadUserProfile() {
    try {
        const response = await fetchWithAuth(config.endpoints.auth.profile);
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            displayUserInfo(data.user);
            
            // Show admin link if user is admin
            if (data.user.role === 'admin') {
                const adminLink = document.getElementById('adminLink');
                if (adminLink) {
                    adminLink.style.display = 'inline-block';
                }
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadMaterials() {
    try {
        const response = await fetchWithAuth(config.endpoints.materials.all);
        const data = await response.json();
        
        if (response.ok) {
            materials = data.materials || [];
            displayMaterials(materials);
        }
    } catch (error) {
        console.error('Error loading materials:', error);
        document.getElementById('materialsGrid').innerHTML = 
            '<div class="error">Gagal memuat materi. Silakan refresh halaman.</div>';
    }
}

async function loadUserProgress() {
    try {
        const response = await fetchWithAuth(config.endpoints.progress.all);
        const data = await response.json();
        
        if (response.ok) {
            userProgress = data;
            updateProgressDisplay();
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function displayUserInfo(user) {
    document.getElementById('username').textContent = user.username;
    document.getElementById('welcomeName').textContent = user.username;
    document.getElementById('levelBadge').textContent = `Level ${user.level}`;
    document.getElementById('currentStreak').textContent = user.currentStreak || 0;
    document.getElementById('totalPoints').textContent = user.totalPoints || 0;
    document.getElementById('completedLessons').textContent = user.completedLessons || 0;
    
    // Update avatar if exists
    if (user.avatar) {
        document.getElementById('avatarImg').src = user.avatar;
        document.getElementById('avatarImg').style.display = 'block';
        document.getElementById('avatarPlaceholder').style.display = 'none';
    }
    
    // Display recent badges
    displayRecentBadges(user.badges || []);
}

function displayRecentBadges(badges) {
    const recentBadgesEl = document.getElementById('recentBadges');
    if (!badges || badges.length === 0) {
        recentBadgesEl.innerHTML = '<p class="empty-state">Belum ada badge</p>';
        return;
    }
    
    const recentThree = badges.slice(0, 3);
    recentBadgesEl.innerHTML = recentThree.map(badge => `
        <div class="badge-item" title="${badge.description}">
            <span class="badge-icon-small">${badge.icon}</span>
            <span class="badge-name-small">${badge.name}</span>
        </div>
    `).join('');
}

function updateProgressDisplay() {
    if (!userProgress || !materials.length) return;
    
    const completed = userProgress.completedMaterials?.length || 0;
    const total = materials.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update percentage text
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    
    // Update progress circle
    const circle = document.getElementById('progressCircle');
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

function displayMaterials(materialsToShow) {
    const grid = document.getElementById('materialsGrid');
    
    if (!materialsToShow || materialsToShow.length === 0) {
        grid.innerHTML = '<div class="empty-state">Belum ada materi tersedia</div>';
        return;
    }
    
    grid.innerHTML = materialsToShow.map(material => {
        const isCompleted = userProgress?.completedMaterials?.includes(material.id);
        
        return `
            <div class="material-card ${isCompleted ? 'completed' : ''}" onclick="openMaterial(${material.id})">
                <div class="material-header">
                    <span class="material-category ${material.category.toLowerCase()}">${material.category}</span>
                    <span class="material-level">${material.level}</span>
                </div>
                <h3 class="material-title">${material.title}</h3>
                <div class="material-footer">
                    <span class="material-points">⭐ ${material.points} poin</span>
                    ${isCompleted ? '<span class="completed-badge">✓ Selesai</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            filterMaterials(category);
        });
    });
}

function filterMaterials(category) {
    if (category === 'all') {
        displayMaterials(materials);
    } else {
        const filtered = materials.filter(m => m.category === category);
        displayMaterials(filtered);
    }
}

function openMaterial(materialId) {
    window.location.href = `learn.html?id=${materialId}`;
}

function closeLevelUpModal() {
    document.getElementById('levelUpModal').style.display = 'none';
}

function closeBadgeModal() {
    document.getElementById('badgeModal').style.display = 'none';
}

function showLevelUpModal(oldLevel, newLevel) {
    document.getElementById('oldLevel').textContent = `Level ${oldLevel}`;
    document.getElementById('newLevel').textContent = `Level ${newLevel}`;
    document.getElementById('levelUpModal').style.display = 'flex';
}

function showBadgeModal(badge) {
    document.getElementById('badgeIcon').textContent = badge.icon;
    document.getElementById('badgeName').textContent = badge.name;
    document.getElementById('badgeDescription').textContent = badge.description;
    document.getElementById('badgeModal').style.display = 'flex';
}
