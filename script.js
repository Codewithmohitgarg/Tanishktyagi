document.addEventListener('DOMContentLoaded', () => {
    displayTrades();
    updateCounter();
});

function addTrade() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const have = document.getElementById('skillOffer').value;
    const want = document.getElementById('skillNeed').value;

    if (!name || !phone || !have || !want) {
        alert("Bhai, WhatsApp number ke saath saari details bharna zaroori hai!");
        return;
    }

    const trade = { name, phone, have, want, id: Date.now() };
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.unshift(trade);
    localStorage.setItem('trades', JSON.stringify(trades));

    // Clear Inputs
    document.querySelectorAll('input').forEach(i => i.value = '');
    displayTrades();
    updateCounter();
}

function displayTrades() {
    const feed = document.getElementById('tradeFeed');
    const trades = JSON.parse(localStorage.getItem('trades')) || [];

    feed.innerHTML = trades.map(t => `
        <div class="trade-card card">
            <div class="trade-info">
                <strong>${t.name}</strong><br>
                <span>Offers: <b>${t.have}</b></span><br>
                <small>Needs: ${t.want}</small>
            </div>
            <div class="action-buttons">
                <button class="connect-btn" onclick="openWhatsApp('${t.phone}', '${t.have}', '${t.name}')">
                    <i class="fab fa-whatsapp"></i> Chat
                </button>
                <button class="cancel-btn" onclick="deleteTrade(${t.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openWhatsApp(phone, skill, name) {
    // Custom message format
    const message = `Hi ${name}, main SkillSwap se bol raha hu. Mujhe aapki "${skill}" waali skill mein interest hai. Kya hum swap kar sakte hain?`;
    
    // WhatsApp URL format: https://wa.me/number?text=urlencodedtext
    const encodedMsg = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMsg}`;
    
    // Open in new tab
    window.open(whatsappURL, '_blank');
}

function deleteTrade(id) {
    if(confirm("Post delete karun?")) {
        let trades = JSON.parse(localStorage.getItem('trades')) || [];
        trades = trades.filter(t => t.id !== id);
        localStorage.setItem('trades', JSON.stringify(trades));
        displayTrades();
        updateCounter();
    }
}

function updateCounter() {
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    document.getElementById('historyCount').innerText = trades.length;
}