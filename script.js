let isLogin = true;

// 1. Switch between Login and Signup
function toggleMode() {
    isLogin = !isLogin;
    document.getElementById('authTitle').innerHTML = isLogin ? "Login to Skill<span>Swap</span>" : "Join Skill<span>Swap</span>";
    document.getElementById('authBtn').innerText = isLogin ? "Login" : "Sign Up";
    document.getElementById('authToggle').innerText = isLogin ? "New here? Create Account" : "Already have an account? Login";
    document.getElementById('authName').style.display = isLogin ? "none" : "block";
}

// 2. Handle Login/Signup Logic using LocalStorage
function handleAuth() {
    const name = document.getElementById('authName').value;
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;

    if (!email || !pass) return alert("Email and Password are required!");

    const users = JSON.parse(localStorage.getItem('ss_users')) || [];

    if (isLogin) {
        // Find existing user
        const user = users.find(u => u.email === email && u.pass === pass);
        if (user) {
            startApp(user.name);
        } else {
            alert("Invalid Credentials! Please try again.");
        }
    } else {
        // Create new user
        if (!name) return alert("Please enter your name!");
        if (users.find(u => u.email === email)) return alert("Email already exists!");

        users.push({ name, email, pass });
        localStorage.setItem('ss_users', JSON.stringify(users));
        alert("Account Created Successfully! Now Login.");
        toggleMode();
    }
}

// 3. Start App after Login
function startApp(userName) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userDisplay').innerText = "Hi, " + userName;
    renderFeed();
}

// 4. Logout
function logout() {
    location.reload(); 
}

// 5. Add New Trade Post
function addPost() {
    const phone = document.getElementById('phone').value;
    const have = document.getElementById('have').value;
    const want = document.getElementById('want').value;
    const name = document.getElementById('userDisplay').innerText.replace("Hi, ", "");

    if (!phone || !have || !want) return alert("Please fill all fields!");

    const post = { id: Date.now(), name, phone, have, want };
    let posts = JSON.parse(localStorage.getItem('ss_posts')) || [];
    posts.unshift(post);
    localStorage.setItem('ss_posts', JSON.stringify(posts));

    // Clear Fields
    document.getElementById('phone').value = '';
    document.getElementById('have').value = '';
    document.getElementById('want').value = '';
    
    renderFeed();
}

// 6. Display Trades from LocalStorage
function renderFeed() {
    const posts = JSON.parse(localStorage.getItem('ss_posts')) || [];
    const feedDiv = document.getElementById('feed');
    
    if(posts.length === 0) {
        feedDiv.innerHTML = "<p style='text-align:center; color:#888;'>No active swaps nearby.</p>";
        return;
    }

    feedDiv.innerHTML = posts.map(p => `
        <div class="trade-card">
            <div class="trade-info">
                <strong>${p.name}</strong> offers <b>${p.have}</b><br>
                <small>Looking for: ${p.want}</small>
            </div>
            <button class="whatsapp-btn" onclick="connect('${p.phone}', '${p.name}', '${p.have}')">
                <i class="fab fa-whatsapp"></i> Chat
            </button>
        </div>
    `).join('');
}

// 7. Open WhatsApp Chat
function connect(num, name, skill) {
    const msg = `Hi ${name}, I saw your post on SkillSwap. I'm interested in your ${skill} skill!`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
}