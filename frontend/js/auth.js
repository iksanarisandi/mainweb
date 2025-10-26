// Authentication JavaScript for Login and Register pages
document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Handle Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Clear previous errors
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memproses...';
    
    try {
        const response = await fetch(config.endpoints.auth.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setToken(data.token);
            window.location.href = 'dashboard.html';
        } else {
            showError(errorMessage, data.error || 'Login gagal. Periksa email dan password Anda.');
        }
    } catch (error) {
        showError(errorMessage, 'Terjadi kesalahan. Silakan coba lagi.');
        console.error('Login error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Masuk';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Clear previous errors
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError(errorMessage, 'Password tidak cocok!');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showError(errorMessage, 'Password minimal 6 karakter!');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mendaftar...';
    
    try {
        const response = await fetch(config.endpoints.auth.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setToken(data.token);
            window.location.href = 'dashboard.html';
        } else {
            showError(errorMessage, data.error || 'Registrasi gagal. Silakan coba lagi.');
        }
    } catch (error) {
        showError(errorMessage, 'Terjadi kesalahan. Silakan coba lagi.');
        console.error('Register error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Daftar Sekarang';
    }
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}
