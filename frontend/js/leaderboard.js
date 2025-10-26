// Leaderboard Page JavaScript
let currentUser = null;
let leaderboardData = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;
    
    // Setup share button
    document.getElementById('shareLeaderboardBtn')?.addEventListener('click', shareLeaderboard);
    
    // Load data
    await Promise.all([
        loadLeaderboard(),
        loadUserProfile()
    ]);
});

async function loadUserProfile() {
    try {
        const response = await fetchWithAuth(config.endpoints.auth.profile);
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadLeaderboard() {
    try {
        const response = await fetchWithAuth(config.endpoints.leaderboard);
        const data = await response.json();
        
        if (response.ok) {
            leaderboardData = data.leaderboard || [];
            displayLeaderboard(leaderboardData);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        document.getElementById('leaderboardList').innerHTML = 
            '<div class="error">Gagal memuat leaderboard. Silakan refresh halaman.</div>';
    }
}

function displayLeaderboard(data) {
    if (!data || data.length === 0) {
        document.getElementById('leaderboardList').innerHTML = 
            '<div class="empty-state">Belum ada data leaderboard</div>';
        return;
    }
    
    // Display top 3 in podium
    displayPodium(data.slice(0, 3));
    
    // Display rest in list
    displayLeaderboardList(data.slice(3));
    
    // Display current user rank
    displayUserRank(data);
}

function displayPodium(topThree) {
    // Get podium elements (HTML order: podium-2, podium-1, podium-3)
    const podium1 = document.querySelector('.podium-1'); // Center, rank 1
    const podium2 = document.querySelector('.podium-2'); // Left, rank 2
    const podium3 = document.querySelector('.podium-3'); // Right, rank 3
    
    const podiums = [
        { element: podium1, rank: 0 }, // podium-1 gets rank 1 (topThree[0])
        { element: podium2, rank: 1 }, // podium-2 gets rank 2 (topThree[1])
        { element: podium3, rank: 2 }  // podium-3 gets rank 3 (topThree[2])
    ];
    
    podiums.forEach(({ element, rank }) => {
        if (topThree[rank]) {
            const user = topThree[rank];
            
            const avatar = element.querySelector('.podium-avatar');
            const name = element.querySelector('.podium-name');
            const points = element.querySelector('.podium-points');
            
            const avatarUrl = user.avatar_url || user.avatar;
            if (avatarUrl) {
                avatar.innerHTML = `<img src="${avatarUrl}" alt="${user.username}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                avatar.textContent = user.username.charAt(0).toUpperCase();
            }
            
            name.textContent = user.username;
            points.textContent = `${user.points || user.totalPoints || 0} poin`;
        }
    });
}

function displayLeaderboardList(users) {
    const listContainer = document.getElementById('leaderboardList');
    
    if (!users || users.length === 0) {
        listContainer.innerHTML = '';
        return;
    }
    
    listContainer.innerHTML = users.map((user, index) => {
        const rank = index + 4; // Starting from 4th place
        const isCurrentUser = currentUser && currentUser.id === user.id;
        const avatarUrl = user.avatar_url || user.avatar;
        
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <div class="rank-number">#${rank}</div>
                <div class="user-avatar-small">
                    ${avatarUrl ? 
                        `<img src="${avatarUrl}" alt="${user.username}">` : 
                        user.username.charAt(0).toUpperCase()
                    }
                </div>
                <div class="user-details">
                    <div class="user-name">${user.username}</div>
                    <div class="user-stats-small">
                        <span>🏆 Level ${user.level || 1}</span>
                        <span>🔥 Streak ${user.current_streak || user.currentStreak || 0}</span>
                    </div>
                </div>
                <div class="user-points-large">${user.points || user.totalPoints || 0} poin</div>
            </div>
        `;
    }).join('');
}

function displayUserRank(data) {
    if (!currentUser) return;
    
    const userRankIndex = data.findIndex(u => u.id === currentUser.id);
    
    if (userRankIndex === -1) {
        document.getElementById('yourRank').style.display = 'none';
        return;
    }
    
    const rank = userRankIndex + 1;
    const userPoints = currentUser.points || currentUser.totalPoints || 0;
    
    document.querySelector('.rank-position').textContent = `#${rank}`;
    document.querySelector('.rank-username').textContent = currentUser.username;
    document.querySelector('.rank-points').textContent = `${userPoints} poin`;
}

async function shareLeaderboard() {
    try {
        // Check if html2canvas is loaded
        if (typeof html2canvas === 'undefined') {
            alert('Feature sharing sedang dimuat...');
            return;
        }
        
        const container = document.querySelector('.leaderboard-container');
        const shareBtn = document.getElementById('shareLeaderboardBtn');
        
        shareBtn.textContent = '📸 Generating...';
        shareBtn.disabled = true;
        
        const canvas = await html2canvas(container, {
            backgroundColor: '#0f0f1e',
            scale: 2
        });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'leaderboard.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Main Web Leaderboard',
                        text: `Lihat ranking saya di Main Web! #MainWeb #Coding`
                    });
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        downloadImage(canvas);
                    }
                }
            } else {
                downloadImage(canvas);
            }
            
            shareBtn.textContent = '📸 Share';
            shareBtn.disabled = false;
        });
    } catch (error) {
        console.error('Error sharing:', error);
        alert('Gagal membuat screenshot');
        document.getElementById('shareLeaderboardBtn').textContent = '📸 Share';
        document.getElementById('shareLeaderboardBtn').disabled = false;
    }
}

function downloadImage(canvas) {
    const link = document.createElement('a');
    link.download = 'leaderboard.png';
    link.href = canvas.toDataURL();
    link.click();
}
