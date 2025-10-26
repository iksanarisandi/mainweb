// Profile Page JavaScript
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;
    
    // Setup avatar upload
    document.getElementById('avatarUpload')?.addEventListener('change', handleAvatarUpload);
    
    // Load profile data
    await loadProfile();
});

async function loadProfile() {
    try {
        const response = await fetchWithAuth(config.endpoints.auth.profile);
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            displayProfile(data.user);
            await Promise.all([
                loadBadges(),
                loadStreakHistory(),
                loadRecentActivity()
            ]);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Gagal memuat profil. Silakan refresh halaman.');
    }
}

function displayProfile(user) {
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileLevel').textContent = `Level ${user.level || 1}`;
    document.getElementById('profilePoints').textContent = user.totalPoints || user.points || 0;
    document.getElementById('profileStreak').textContent = user.currentStreak || user.current_streak || 0;
    document.getElementById('profileCompleted').textContent = user.completedLessons || user.completed_lessons || 0;
    
    // Update avatar
    const avatarUrl = user.avatar || user.avatar_url;
    const avatarImage = document.getElementById('avatarImage');
    const avatarPlaceholder = document.getElementById('avatarPlaceholderLarge');
    
    if (avatarUrl && avatarImage && avatarPlaceholder) {
        avatarImage.src = avatarUrl;
        avatarImage.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
    } else if (avatarPlaceholder) {
        // Show first letter of username if no avatar
        const firstLetter = user.username ? user.username.charAt(0).toUpperCase() : '?';
        avatarPlaceholder.textContent = firstLetter;
    }
}

async function loadBadges() {
    try {
        // Define all available badges
        const allBadges = [
            {
                id: 'html_master',
                name: 'HTML Master',
                icon: '🏗️',
                description: 'Selesaikan semua materi HTML',
                requirement: 'html_complete',
                color: '#e34c26'
            },
            {
                id: 'css_master',
                name: 'CSS Master',
                icon: '🎨',
                description: 'Selesaikan semua materi CSS',
                requirement: 'css_complete',
                color: '#264de4'
            },
            {
                id: 'js_master',
                name: 'JavaScript Master',
                icon: '⚡',
                description: 'Selesaikan semua materi JavaScript',
                requirement: 'js_complete',
                color: '#f0db4f'
            },
            {
                id: 'legend',
                name: 'Legend',
                icon: '👑',
                description: 'Selesaikan semua materi',
                requirement: 'all_complete',
                color: '#ffd700'
            },
            {
                id: 'streak_10',
                name: '10 Day Streak',
                icon: '🔥',
                description: 'Belajar 10 hari berturut-turut',
                requirement: 'streak_10',
                color: '#ff6b6b'
            }
        ];
        
        // Check which badges are unlocked
        const unlockedBadges = checkUnlockedBadges(allBadges);
        
        displayBadges(allBadges, unlockedBadges);
    } catch (error) {
        console.error('Error loading badges:', error);
        document.getElementById('badgesGrid').innerHTML = 
            '<div class="error">Gagal memuat badges</div>';
    }
}

function checkUnlockedBadges(badges) {
    if (!currentUser) return [];
    
    const unlocked = [];
    
    badges.forEach(badge => {
        let isUnlocked = false;
        
        switch(badge.requirement) {
            case 'html_complete':
                // Check if user completed all HTML lessons (assume 10 HTML lessons)
                isUnlocked = currentUser.completedLessons >= 10;
                break;
            case 'css_complete':
                // Check if user completed all CSS lessons
                isUnlocked = currentUser.completedLessons >= 22;
                break;
            case 'js_complete':
                // Check if user completed all JavaScript lessons
                isUnlocked = currentUser.completedLessons >= 37;
                break;
            case 'all_complete':
                // Check if user completed all lessons
                isUnlocked = currentUser.completedLessons >= 37;
                break;
            case 'streak_10':
                // Check if user has 10 day streak
                const streak = currentUser.longestStreak || currentUser.longest_streak || 0;
                isUnlocked = streak >= 10;
                break;
        }
        
        if (isUnlocked) {
            unlocked.push(badge.id);
        }
    });
    
    return unlocked;
}

function displayBadges(badges, unlockedBadges) {
    const grid = document.getElementById('badgesGrid');
    
    if (!badges || badges.length === 0) {
        grid.innerHTML = '<div class="empty-state">Belum ada badge</div>';
        return;
    }
    
    grid.innerHTML = badges.map(badge => {
        const isUnlocked = unlockedBadges.includes(badge.id);
        const lockedClass = isUnlocked ? '' : 'locked';
        
        return `
            <div class="badge-card ${lockedClass}" style="${isUnlocked ? `--badge-color: ${badge.color}` : ''}">
                <div class="badge-icon-large">${isUnlocked ? badge.icon : '🔒'}</div>
                <h3 class="badge-name">${badge.name}</h3>
                <p class="badge-description">${badge.description}</p>
                <div class="badge-status">
                    ${isUnlocked ? 
                        '<span class="unlocked">✓ Unlocked</span>' : 
                        '<span class="locked-text">Locked</span>'
                    }
                </div>
            </div>
        `;
    }).join('');
}

async function loadStreakHistory() {
    try {
        if (!currentUser) return;
        
        displayStreakStats(currentUser);
        displayStreakCalendar(currentUser.streakHistory || []);
    } catch (error) {
        console.error('Error loading streak history:', error);
    }
}

function displayStreakStats(data) {
    document.getElementById('currentStreakStat').textContent = 
        `${data.currentStreak || data.current_streak || 0} hari`;
    document.getElementById('longestStreakStat').textContent = 
        `${data.longestStreak || data.longest_streak || 0} hari`;
}

function displayStreakCalendar(streakHistory) {
    const calendar = document.getElementById('streakCalendar');
    
    if (!streakHistory || streakHistory.length === 0) {
        calendar.innerHTML = '<div class="empty-state">Belum ada aktivitas streak</div>';
        return;
    }
    
    // Display last 30 days
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const hasActivity = streakHistory.some(s => 
            s.date && s.date.startsWith(dateStr)
        );
        
        days.push({
            date: dateStr,
            day: date.getDate(),
            hasActivity
        });
    }
    
    calendar.innerHTML = `
        <div class="calendar-grid">
            ${days.map(day => `
                <div class="calendar-day ${day.hasActivity ? 'active' : ''}" 
                     title="${day.date}">
                    <span class="day-number">${day.day}</span>
                </div>
            `).join('')}
        </div>
    `;
}

async function loadRecentActivity() {
    try {
        // Generate recent activity from user progress
        const activities = generateRecentActivities();
        displayRecentActivity(activities);
    } catch (error) {
        console.error('Error loading activity:', error);
        document.getElementById('recentActivity').innerHTML = 
            '<div class="error">Gagal memuat aktivitas</div>';
    }
}

function generateRecentActivities() {
    if (!currentUser) return [];
    
    const activities = [];
    
    // Add lesson completion activity
    if (currentUser.completedLessons > 0) {
        activities.push({
            type: 'lesson_complete',
            description: `Menyelesaikan ${currentUser.completedLessons} materi pembelajaran`,
            points: currentUser.totalPoints || currentUser.points || 0,
            createdAt: new Date().toISOString()
        });
    }
    
    // Add streak activity
    const currentStreak = currentUser.currentStreak || currentUser.current_streak || 0;
    if (currentStreak > 0) {
        activities.push({
            type: 'streak_milestone',
            description: `Mempertahankan streak ${currentStreak} hari berturut-turut`,
            createdAt: new Date().toISOString()
        });
    }
    
    // Add level info
    if (currentUser.level > 1) {
        activities.push({
            type: 'level_up',
            description: `Mencapai Level ${currentUser.level}`,
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        });
    }
    
    return activities;
}

function displayRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="empty-state">Belum ada aktivitas</div>';
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-details">
                <div class="activity-text">${activity.description}</div>
                <div class="activity-time">${formatDate(activity.createdAt)}</div>
            </div>
            ${activity.points ? 
                `<div class="activity-points">+${activity.points} poin</div>` : 
                ''
            }
        </div>
    `).join('');
}

async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const token = getToken();
        const response = await fetch(config.endpoints.profile.uploadAvatar, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update avatar display
            document.getElementById('avatarImage').src = data.avatarUrl;
            document.getElementById('avatarImage').style.display = 'block';
            document.getElementById('avatarPlaceholderLarge').style.display = 'none';
            
            alert('Avatar berhasil diupload!');
        } else {
            alert(data.error || 'Gagal upload avatar');
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Terjadi kesalahan saat upload avatar');
    }
}

function getActivityIcon(type) {
    const icons = {
        'lesson_complete': '✅',
        'badge_unlock': '🏆',
        'level_up': '⬆️',
        'streak_milestone': '🔥'
    };
    return icons[type] || '📝';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
