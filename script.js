// UI Elements
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.getElementById('sidebar');
const toastContainer = document.getElementById('toast-container');
const topUsername = document.getElementById('top-username');
const topAvatar = document.getElementById('top-avatar');
const topBalance = document.getElementById('top-balance');
const statBalance = document.getElementById('stat-balance');
const statRole = document.getElementById('stat-role');
const userProfileBtn = document.getElementById('user-profile-btn');

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// State
let currentUser = JSON.parse(localStorage.getItem('zermango_user'));

// Initialize App
function init() {
    // Event Listeners for UI
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar on click outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && e.target !== mobileToggle && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
    
    // Auth logic
    if (currentUser) {
        updateUIData();
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', () => {
                const logout = confirm("Bạn có muốn đăng xuất không?");
                if (logout) {
                    localStorage.removeItem('zermango_user');
                    window.location.reload();
                }
            });
        }
    } else {
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userVal = document.getElementById('username').value;
            const passVal = document.getElementById('password').value;
            
            const users = JSON.parse(localStorage.getItem('zermango_users') || '[]');
            const user = users.find(u => u.username === userVal && u.password === passVal);
            
            if (user) {
                if (user.isBanned) {
                    showToast('Tài khoản của bạn đã bị cấm!', 'error');
                    return;
                }
                localStorage.setItem('zermango_user', JSON.stringify(user));
                showToast('Đăng nhập thành công! Đang chuyển hướng...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showToast('Sai tên đăng nhập hoặc mật khẩu!', 'error');
            }
        });
    }

    // Register Form Submit
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Support both ID conventions
            const userVal    = (document.getElementById('username')         || document.getElementById('reg-username')       || {}).value || '';
            const emailVal   = (document.getElementById('email')            || document.getElementById('reg-email')          || {}).value || '';
            const passVal    = (document.getElementById('password')         || document.getElementById('reg-password')       || {}).value || '';
            const confirmVal = (document.getElementById('confirm-password') || document.getElementById('reg-confirm')        || {}).value || '';

            if (!userVal.trim()) {
                showToast('Vui lòng nhập tên đăng nhập!', 'error'); return;
            }
            if (passVal.length < 6) {
                showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error'); return;
            }
            if (passVal !== confirmVal) {
                showToast('Mật khẩu xác nhận không khớp!', 'error'); return;
            }

            let users = [];
            try { users = JSON.parse(localStorage.getItem('zermango_users') || '[]'); } catch(e) { users = []; }
            if (!Array.isArray(users)) users = [];

            if (users.some(u => u.username === userVal.trim())) {
                showToast('Tên đăng nhập đã tồn tại!', 'error'); return;
            }

            const newUser = {
                username: userVal.trim(),
                email: emailVal.trim(),
                password: passVal,
                balance: 0,
                role: 'Member',
                isBanned: false,
                ipAddress: `103.153.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
            };

            users.push(newUser);
            localStorage.setItem('zermango_users', JSON.stringify(users));

            showToast('🎉 Đăng ký thành công! Đang chuyển sang trang đăng nhập...', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 1800);
        });
    }
}

function updateUIData() {
    if (topUsername) topUsername.textContent = currentUser.username;
    if (topAvatar) topAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
    
    // Format money
    const formattedBalance = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentUser.balance);
    
    if (topBalance) topBalance.textContent = formattedBalance;
    if (statBalance) statBalance.textContent = formattedBalance;
    if (statRole) statRole.textContent = currentUser.role;
}

// Toast System
function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>';
    
    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-in reverse forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Run init
init();
