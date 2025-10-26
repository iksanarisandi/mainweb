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
    if (!text) return '';
    
    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Store code blocks temporarily to prevent them from being processed
    const codeBlocks = [];
    let codeBlockIndex = 0;
    
    // Extract and store code blocks (```language ... ```)
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
        const placeholder = `___CODE_BLOCK_${codeBlockIndex}___`;
        codeBlocks.push({
            language: language || '',
            code: escapeHtml(code.trim())
        });
        codeBlockIndex++;
        return placeholder;
    });
    
    // Store inline code temporarily
    const inlineCodes = [];
    let inlineCodeIndex = 0;
    text = text.replace(/`([^`\n]+)`/g, (match, code) => {
        const placeholder = `___INLINE_CODE_${inlineCodeIndex}___`;
        inlineCodes.push(escapeHtml(code));
        inlineCodeIndex++;
        return placeholder;
    });
    
    // Parse paragraphs and line breaks
    const lines = text.split('\n');
    const parsed = [];
    let inList = false;
    let listType = null;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Skip empty lines
        if (line.trim() === '') {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
                listType = null;
            }
            parsed.push('');
            continue;
        }
        
        // Headers
        if (line.startsWith('# ')) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push(`<h1>${line.substring(2).trim()}</h1>`);
        } else if (line.startsWith('## ')) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push(`<h2>${line.substring(3).trim()}</h2>`);
        } else if (line.startsWith('### ')) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push(`<h3>${line.substring(4).trim()}</h3>`);
        } else if (line.startsWith('#### ')) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push(`<h4>${line.substring(5).trim()}</h4>`);
        }
        // Unordered list
        else if (line.match(/^[\*\-\+]\s/)) {
            if (!inList || listType !== 'ul') {
                if (inList) parsed.push('</ol>');
                parsed.push('<ul>');
                inList = true;
                listType = 'ul';
            }
            parsed.push(`<li>${line.substring(2).trim()}</li>`);
        }
        // Ordered list
        else if (line.match(/^\d+\.\s/)) {
            if (!inList || listType !== 'ol') {
                if (inList) parsed.push('</ul>');
                parsed.push('<ol>');
                inList = true;
                listType = 'ol';
            }
            parsed.push(`<li>${line.replace(/^\d+\.\s/, '').trim()}</li>`);
        }
        // Blockquote
        else if (line.startsWith('> ')) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push(`<blockquote>${line.substring(2).trim()}</blockquote>`);
        }
        // Horizontal rule
        else if (line.match(/^[\-\*_]{3,}$/)) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push('<hr>');
        }
        // Code block placeholder
        else if (line.includes('___CODE_BLOCK_')) {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
            }
            parsed.push(line);
        }
        // Regular paragraph
        else {
            if (inList) {
                parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
                listType = null;
            }
            parsed.push(`<p>${line}</p>`);
        }
    }
    
    // Close any open list
    if (inList) {
        parsed.push(listType === 'ul' ? '</ul>' : '</ol>');
    }
    
    let result = parsed.join('\n');
    
    // Apply text formatting (bold, italic, etc)
    result = result
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/~~(.+?)~~/g, '<del>$1</del>');
    
    // Restore inline code
    inlineCodes.forEach((code, index) => {
        result = result.replace(`___INLINE_CODE_${index}___`, `<code>${code}</code>`);
    });
    
    // Restore code blocks
    codeBlocks.forEach((block, index) => {
        result = result.replace(
            `___CODE_BLOCK_${index}___`,
            `<pre><code>${block.code}</code></pre>`
        );
    });
    
    return result;
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
    
    // Check if this is JavaScript material
    if (currentMaterial && currentMaterial.category === 'JavaScript') {
        // For JavaScript: capture console output
        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { 
                        margin: 0;
                        padding: 10px; 
                        font-family: 'Consolas', 'Courier New', monospace; 
                        background: #1e1e1e;
                        color: #d4d4d4;
                        font-size: 14px;
                        line-height: 1.6;
                    }
                    .console-line {
                        padding: 4px 0;
                        word-wrap: break-word;
                    }
                    .console-error {
                        color: #f48771;
                    }
                    .console-warn {
                        color: #dcdcaa;
                    }
                </style>
            </head>
            <body>
                <div id="output"></div>
                <script>
                    const output = document.getElementById('output');
                    
                    function formatValue(val) {
                        if (val === null) return 'null';
                        if (val === undefined) return 'undefined';
                        if (typeof val === 'string') return val;
                        if (typeof val === 'object') {
                            try {
                                return JSON.stringify(val, null, 2);
                            } catch (e) {
                                return String(val);
                            }
                        }
                        return String(val);
                    }
                    
                    // Override console methods to capture output
                    console.log = function(...args) {
                        const line = document.createElement('div');
                        line.className = 'console-line';
                        line.textContent = args.map(formatValue).join(' ');
                        output.appendChild(line);
                    };
                    
                    console.error = function(...args) {
                        const line = document.createElement('div');
                        line.className = 'console-line console-error';
                        line.textContent = '❌ ' + args.map(formatValue).join(' ');
                        output.appendChild(line);
                    };
                    
                    console.warn = function(...args) {
                        const line = document.createElement('div');
                        line.className = 'console-line console-warn';
                        line.textContent = '⚠️ ' + args.map(formatValue).join(' ');
                        output.appendChild(line);
                    };
                    
                    console.info = function(...args) {
                        const line = document.createElement('div');
                        line.className = 'console-line';
                        line.textContent = 'ℹ️ ' + args.map(formatValue).join(' ');
                        output.appendChild(line);
                    };
                    
                    // Execute user code
                    try {
                        ${code}
                    } catch (error) {
                        console.error(error.message);
                    }
                <\/script>
            </body>
            </html>
        `;
        preview.srcdoc = previewContent;
    } else {
        // For HTML/CSS: inject directly as HTML
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
