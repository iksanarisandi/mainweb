// Admin Panel JavaScript
let currentSection = 'stats';

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;
    
    // Setup logout button
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Setup menu navigation
    setupMenuNavigation();
    
    // Setup modals
    setupModals();
    
    // Load initial section
    await loadSection('stats');
});

function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.admin-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.dataset.section;
            loadSection(section);
        });
    });
}

function setupModals() {
    // Material form
    document.getElementById('addMaterialBtn')?.addEventListener('click', () => {
        openMaterialModal();
    });
    
    document.getElementById('materialForm')?.addEventListener('submit', handleMaterialSubmit);
    
    // Badge form
    document.getElementById('addBadgeBtn')?.addEventListener('click', () => {
        openBadgeModal();
    });
    
    document.getElementById('badgeForm')?.addEventListener('submit', handleBadgeSubmit);
}

async function loadSection(section) {
    currentSection = section;
    
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current section
    document.getElementById(`${section}Section`)?.classList.add('active');
    
    // Load section data
    switch(section) {
        case 'stats':
            await loadStats();
            break;
        case 'materials':
            await loadMaterials();
            break;
        case 'users':
            await loadUsers();
            break;
        case 'badges':
            await loadBadges();
            break;
    }
}

async function loadStats() {
    try {
        const response = await fetchWithAuth(config.endpoints.admin.stats);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('totalUsersAdmin').textContent = data.total_users || data.totalUsers || 0;
            document.getElementById('totalMaterialsAdmin').textContent = data.total_materials || data.totalMaterials || 0;
            document.getElementById('totalCompletionsAdmin').textContent = data.total_completions || data.totalCompletions || 0;
            document.getElementById('totalBadgesAdmin').textContent = data.total_badges || data.totalBadges || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadMaterials() {
    try {
        const response = await fetchWithAuth(config.endpoints.admin.materials);
        const data = await response.json();
        
        if (response.ok) {
            displayMaterials(data.materials || []);
        }
    } catch (error) {
        console.error('Error loading materials:', error);
        document.getElementById('materialsTableBody').innerHTML = 
            '<tr><td colspan="7">Error loading materials</td></tr>';
    }
}

function displayMaterials(materials) {
    const tbody = document.getElementById('materialsTableBody');
    
    if (!materials || materials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Belum ada materi</td></tr>';
        return;
    }
    
    tbody.innerHTML = materials.map(material => `
        <tr>
            <td>${material.id}</td>
            <td>${material.title}</td>
            <td><span class="badge ${material.category.toLowerCase()}">${material.category}</span></td>
            <td>${material.level}</td>
            <td>${material.points}</td>
            <td><span class="status-badge ${material.status}">${material.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editMaterial(${material.id})" title="Edit">✏️</button>
                <button class="btn-icon" onclick="deleteMaterial(${material.id})" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function loadUsers() {
    try {
        const response = await fetchWithAuth(config.endpoints.admin.users);
        const data = await response.json();
        
        if (response.ok) {
            displayUsers(data.users || []);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = 
            '<tr><td colspan="8">Error loading users</td></tr>';
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">Belum ada users</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td>Level ${user.level || 1}</td>
            <td>${user.totalPoints || 0}</td>
            <td>${user.currentStreak || 0}</td>
            <td>${formatDate(user.createdAt)}</td>
        </tr>
    `).join('');
}

async function loadBadges() {
    try {
        const response = await fetchWithAuth(config.endpoints.admin.badges);
        const data = await response.json();
        
        if (response.ok) {
            displayBadges(data.badges || []);
        }
    } catch (error) {
        console.error('Error loading badges:', error);
        document.getElementById('badgesAdminGrid').innerHTML = 
            '<div class="error">Error loading badges</div>';
    }
}

function displayBadges(badges) {
    const grid = document.getElementById('badgesAdminGrid');
    
    if (!badges || badges.length === 0) {
        grid.innerHTML = '<div class="empty-state">Belum ada badges</div>';
        return;
    }
    
    grid.innerHTML = badges.map(badge => `
        <div class="badge-admin-card">
            <div class="badge-icon-large">${badge.icon}</div>
            <h3>${badge.name}</h3>
            <p>${badge.description}</p>
            <div class="badge-condition">
                <strong>Condition:</strong> ${badge.conditionType} = ${badge.conditionValue}
                ${badge.conditionCategory ? ` (${badge.conditionCategory})` : ''}
            </div>
        </div>
    `).join('');
}

function openMaterialModal(material = null) {
    const modal = document.getElementById('materialModal');
    const form = document.getElementById('materialForm');
    const title = document.getElementById('materialModalTitle');
    
    if (material) {
        title.textContent = 'Edit Materi';
        document.getElementById('materialId').value = material.id;
        document.getElementById('materialTitle').value = material.title;
        document.getElementById('materialCategory').value = material.category;
        document.getElementById('materialLevel').value = material.level;
        document.getElementById('materialOrder').value = material.orderIndex;
        document.getElementById('materialPoints').value = material.points;
        document.getElementById('materialContent').value = material.content;
        document.getElementById('materialCodeExample').value = material.codeExample || '';
        document.getElementById('materialChallengeQuestion').value = material.challengeQuestion || '';
        document.getElementById('materialChallengeExpected').value = material.challengeExpected || '';
        document.getElementById('materialChallengeHint').value = material.challengeHint || '';
        document.getElementById('materialStatus').value = material.status || 'published';
    } else {
        title.textContent = 'Tambah Materi';
        form.reset();
        document.getElementById('materialId').value = '';
    }
    
    modal.style.display = 'flex';
}

function closeMaterialModal() {
    document.getElementById('materialModal').style.display = 'none';
}

async function handleMaterialSubmit(e) {
    e.preventDefault();
    
    const materialId = document.getElementById('materialId').value;
    const formData = {
        title: document.getElementById('materialTitle').value,
        category: document.getElementById('materialCategory').value,
        level: document.getElementById('materialLevel').value,
        orderIndex: parseInt(document.getElementById('materialOrder').value),
        points: parseInt(document.getElementById('materialPoints').value),
        content: document.getElementById('materialContent').value,
        codeExample: document.getElementById('materialCodeExample').value,
        challengeQuestion: document.getElementById('materialChallengeQuestion').value,
        challengeExpected: document.getElementById('materialChallengeExpected').value,
        challengeHint: document.getElementById('materialChallengeHint').value,
        status: document.getElementById('materialStatus').value
    };
    
    try {
        const url = materialId ? 
            config.endpoints.admin.updateMaterial(materialId) : 
            config.endpoints.admin.createMaterial;
        const method = materialId ? 'PUT' : 'POST';
        
        const response = await fetchWithAuth(url, {
            method,
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(materialId ? 'Materi berhasil diupdate!' : 'Materi berhasil ditambahkan!');
            closeMaterialModal();
            await loadMaterials();
        } else {
            alert(data.error || 'Gagal menyimpan materi');
        }
    } catch (error) {
        console.error('Error saving material:', error);
        alert('Terjadi kesalahan');
    }
}

async function editMaterial(id) {
    try {
        const response = await fetchWithAuth(config.endpoints.materials.byId(id));
        const data = await response.json();
        
        if (response.ok) {
            openMaterialModal(data.material);
        }
    } catch (error) {
        console.error('Error loading material:', error);
        alert('Gagal memuat data materi');
    }
}

async function deleteMaterial(id) {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;
    
    try {
        const response = await fetchWithAuth(config.endpoints.admin.deleteMaterial(id), {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Materi berhasil dihapus!');
            await loadMaterials();
        } else {
            const data = await response.json();
            alert(data.error || 'Gagal menghapus materi');
        }
    } catch (error) {
        console.error('Error deleting material:', error);
        alert('Terjadi kesalahan');
    }
}

function openBadgeModal() {
    document.getElementById('badgeForm').reset();
    document.getElementById('badgeModal').style.display = 'flex';
}

function closeBadgeModal() {
    document.getElementById('badgeModal').style.display = 'none';
}

async function handleBadgeSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('badgeName').value,
        description: document.getElementById('badgeDescription').value,
        icon: document.getElementById('badgeIcon').value,
        conditionType: document.getElementById('badgeConditionType').value,
        conditionValue: parseInt(document.getElementById('badgeConditionValue').value),
        conditionCategory: document.getElementById('badgeConditionCategory').value || null
    };
    
    try {
        const response = await fetchWithAuth(config.endpoints.admin.createBadge, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Badge berhasil ditambahkan!');
            closeBadgeModal();
            await loadBadges();
        } else {
            alert(data.error || 'Gagal menambahkan badge');
        }
    } catch (error) {
        console.error('Error creating badge:', error);
        alert('Terjadi kesalahan');
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
