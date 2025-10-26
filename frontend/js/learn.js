// Learn Page JavaScript
let currentMaterial = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;
    
    // Get material ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const materialId = urlParams.get('id');
    
    if (!materialId) {
        alert('Material tidak ditemukan');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Setup event listeners
    document.getElementById('runCodeBtn')?.addEventListener('click', runCode);
    document.getElementById('showHintBtn')?.addEventListener('click', showHint);
    document.getElementById('submitChallengeBtn')?.addEventListener('click', submitChallenge);
    document.getElementById('prevLessonBtn')?.addEventListener('click', () => navigateLesson('prev'));
    document.getElementById('nextLessonBtn')?.addEventListener('click', () => navigateLesson('next'));
    
    // Load data
    await Promise.all([
        loadMaterial(materialId),
        loadUserProfile()
    ]);
});

async function loadUserProfile() {
    try {
        const response = await fetchWithAuth(config.endpoints.auth.profile);
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            document.getElementById('userPoints').textContent = data.user.totalPoints || 0;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadMaterial(materialId) {
    try {
        const response = await fetchWithAuth(config.endpoints.materials.byId(materialId));
        const data = await response.json();
        
        if (response.ok) {
            currentMaterial = data.material;
            displayMaterial(data.material);
            await loadRelatedLessons(data.material.category);
        } else {
            alert('Material tidak ditemukan');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error loading material:', error);
        alert('Gagal memuat material');
        window.location.href = 'dashboard.html';
    }
}

function displayMaterial(material) {
    document.getElementById('lessonTitle').textContent = material.title;
    document.getElementById('lessonMainTitle').textContent = material.title;
    document.getElementById('lessonCategory').textContent = material.category;
    document.getElementById('lessonLevel').textContent = material.level;
    
    // Display content (simple markdown to HTML)
    document.getElementById('lessonContent').innerHTML = parseMarkdown(material.content);
    
    // Display code example if exists
    if (material.code_example) {
        document.getElementById('codeEditor').value = material.code_example;
        document.getElementById('exampleSection').style.display = 'block';
    } else {
        document.getElementById('exampleSection').style.display = 'none';
    }
    
    // Display challenge if exists
    if (material.challenge_question) {
        document.getElementById('challengeQuestion').textContent = material.challenge_question;
        
        if (material.challenge_hint) {
            document.getElementById('challengeHint').textContent = material.challenge_hint;
            document.getElementById('showHintBtn').style.display = 'block';
        } else {
            document.getElementById('showHintBtn').style.display = 'none';
        }
        
        document.getElementById('challengeSection').style.display = 'block';
    } else {
        document.getElementById('challengeSection').style.display = 'none';
    }
}

function parseMarkdown(text) {
    return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/gim, '<br>');
}

async function loadRelatedLessons(category) {
    try {
        const response = await fetchWithAuth(config.endpoints.materials.all);
        const data = await response.json();
        
        if (response.ok) {
            const related = data.materials.filter(m => 
                m.category === category && m.id !== currentMaterial.id
            ).slice(0, 5);
            
            displayRelatedLessons(related);
        }
    } catch (error) {
        console.error('Error loading related lessons:', error);
    }
}

function displayRelatedLessons(lessons) {
    const container = document.getElementById('relatedLessons');
    
    if (!lessons || lessons.length === 0) {
        container.innerHTML = '<p class="empty-state">Tidak ada materi terkait</p>';
        return;
    }
    
    container.innerHTML = lessons.map(lesson => `
        <div class="related-lesson-item" onclick="window.location.href='learn.html?id=${lesson.id}'">
            <div class="related-lesson-title">${lesson.title}</div>
            <div class="related-lesson-meta">
                <span class="related-lesson-category">${lesson.category}</span>
                <span class="related-lesson-points">⭐ ${lesson.points}</span>
            </div>
        </div>
    `).join('');
}

function runCode() {
    const code = document.getElementById('codeEditor').value;
    const preview = document.getElementById('previewFrame');
    
    const previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { margin: 10px; font-family: Arial, sans-serif; }
            </style>
        </head>
        <body>
            ${code}
        </body>
        </html>
    `;
    
    preview.srcdoc = previewContent;
}

function showHint() {
    const hintBox = document.getElementById('hintBox');
    hintBox.style.display = 'block';
    document.getElementById('showHintBtn').style.display = 'none';
}

async function submitChallenge() {
    const answer = document.getElementById('challengeEditor').value.trim();
    
    if (!answer) {
        showFeedback(false, 'Silakan tulis jawaban kamu terlebih dahulu!');
        return;
    }
    
    const submitBtn = document.getElementById('submitChallengeBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memeriksa...';
    
    try {
        const response = await fetchWithAuth(config.endpoints.progress.submit, {
            method: 'POST',
            body: JSON.stringify({
                material_id: currentMaterial.id,
                code_submitted: answer
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showSuccessModal(data);
            
            // Update points display
            if (currentUser) {
                currentUser.totalPoints = data.new_points || currentUser.totalPoints;
                document.getElementById('userPoints').textContent = currentUser.totalPoints;
            }
        } else {
            showFeedback(false, data.message || 'Jawaban belum tepat. Coba lagi!');
        }
    } catch (error) {
        console.error('Error submitting challenge:', error);
        showFeedback(false, 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Jawaban';
    }
}

function showFeedback(isCorrect, message) {
    const feedbackBox = document.getElementById('feedbackBox');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    
    feedbackBox.className = `feedback-box ${isCorrect ? 'success' : 'error'}`;
    feedbackIcon.textContent = isCorrect ? '✓' : '✗';
    feedbackText.textContent = message;
    feedbackBox.style.display = 'flex';
}

function showSuccessModal(data) {
    document.getElementById('pointsEarned').textContent = data.points_earned || 0;
    document.getElementById('successMessage').textContent = data.message || 'Great job!';
    
    if (data.streak && data.is_new_day) {
        document.getElementById('streakValue').textContent = data.streak;
        document.getElementById('streakReward').style.display = 'flex';
    } else {
        document.getElementById('streakReward').style.display = 'none';
    }
    
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    
    // Optionally redirect to dashboard or next lesson
    const nextBtn = document.getElementById('nextLessonBtn');
    if (nextBtn && nextBtn.style.display !== 'none') {
        // Has next lesson
    } else {
        // Go back to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    }
}

function navigateLesson(direction) {
    // This would need to be implemented based on material ordering
    console.log(`Navigate ${direction}`);
}
