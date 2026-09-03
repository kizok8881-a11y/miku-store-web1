// ============================================================
// DATA PRODUK (hanya 4 untuk grid)
// ============================================================
const products = [
    { id: 1, name: 'Alight Motion Pivat', price: 20000, desc: 'Alight motion premium privat 1 tahun, google.', img: 'am.jpg' },
    { id: 3, name: 'Capcut Pro', price: 15000, desc: 'capcut pro 7 hari 15k, 1 bulan 40k.', img: 'cc.jpg' },
    { id: 4, name: 'Netflix premiun', price: 32000, desc: 'netflix premium 1 bulan.', img: 'netflix.jpg' },
    { id: 5, name: 'Wink premium', price: 10000, desc: 'wink premium 7 hari 10k, 30k 1 bulan, tutorial wink 20k.', img: 'wink.jpg' }
];

// ============================================================
// DATA SLIDER (semua gambar, termasuk poster)
// ============================================================
const sliderItems = [
    { img: 'poster wink.JPG', name: 'Wink Premium', price: 'nikmati membuat hd photo dan video' },
    { img: 'posterAM_prazs.png', name: 'Alight Motion', price: 'Best seller kami' },
    { img: 'poster netflix.PNG', name: 'Netflix Premium', price: 'ayo nonton sepuasnya' },
    { img: 'capcut pro.PNG', name: 'Capcut Pro', price: 'ayo ngedit dengan bebas' } // opsional
];

// WA number
const WA_NUMBER = '6285834665028';

// ============================================================
// RENDER SLIDER (pakai sliderItems)
// ============================================================
const track = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('sliderDots');

sliderItems.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
        <div class="slide-imgbox">
            <img src="${item.img}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="slide-caption">
            <h3>${item.name}</h3>
            <p>${item.price}</p>
        </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
});

let currentSlide = 0;
const dots = () => dotsWrap.querySelectorAll('.dot');

function goToSlide(i) {
    currentSlide = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots().forEach((d, idx) => d.classList.toggle('active', idx === i));
}

function nextSlide() {
    goToSlide((currentSlide + 1) % sliderItems.length);
}
setInterval(nextSlide, 3800);

// ============================================================
// RENDER PRODUCT GRID (pakai products)
// ============================================================
const grid = document.getElementById('productGrid');

products.forEach(p => {
    const waMsg = `order+miku+${p.name.toLowerCase().replace(/ /g, '+')}`;
    const waLink = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-card-inner">
            <div class="thumb">
                <img src="${p.img}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <h3>${p.name}</h3>
            <p class="desc">${p.desc}</p>
            <div class="price">Rp${p.price.toLocaleString()}</div>
            <div class="btn-group">
                <button class="add-btn" data-id="${p.id}"><i class="fas fa-plus-circle"></i> Tambah</button>
                <a href="${waLink}" target="_blank" rel="noopener" class="wa-btn"><i class="fab fa-whatsapp"></i> Pesan Langsung</a>
            </div>
        </div>
    `;
    grid.appendChild(card);
});

// ============================================================
// KERANJANG & PROMO (tidak diubah)
// ============================================================
let cart = {};
let promoCode = null;
const DISCOUNTS = {
    'PROMO10': 0.10,
    'HEMATAU': 0.20,
    'BLUE50': 0.50
};

function getTotalItems() {
    let total = 0;
    for (let id in cart) total += cart[id].qty;
    return total;
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cartItems');
    const totalSpan = document.getElementById('totalPrice');
    const countBadge = document.getElementById('cartCount');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    const promoStatus = document.getElementById('promoStatus');

    const entries = Object.values(cart);
    let totalItems = 0;
    let subtotal = 0;

    if (entries.length === 0) {
        itemsContainer.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Keranjang masih kosong</p></div>`;
        totalSpan.textContent = 'Rp0';
        countBadge.textContent = '0';
        discountRow.classList.add('hidden');
        promoStatus.innerHTML = `<small>⚠️ Promo hanya berlaku jika minimal 2 produk</small>`;
        return;
    }

    let html = '';
    entries.forEach(item => {
        const p = item.product;
        const qty = item.qty;
        totalItems += qty;
        subtotal += p.price * qty;
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${p.name}</h4>
                    <div class="item-price">Rp${(p.price * qty).toLocaleString()}</div>
                </div>
                <div class="item-actions">
                    <button class="qty-dec" data-id="${p.id}">−</button>
                    <span class="qty">${qty}</span>
                    <button class="qty-inc" data-id="${p.id}">+</button>
                    <button class="qty-remove" data-id="${p.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    });
    itemsContainer.innerHTML = html;

    const minItems = 2;
    const itemCount = getTotalItems();
    if (itemCount >= minItems) {
        promoStatus.innerHTML = `<small style="color:var(--cyan);">✅ Minimal ${minItems} produk terpenuhi (${itemCount} produk)</small>`;
    } else {
        promoStatus.innerHTML = `<small>⚠️ Promo hanya berlaku jika minimal ${minItems} produk (sekarang ${itemCount})</small>`;
    }

    let discount = 0;
    let promoActive = false;
    if (promoCode && DISCOUNTS[promoCode] && itemCount >= minItems) {
        discount = subtotal * DISCOUNTS[promoCode];
        promoActive = true;
    } else if (promoCode && itemCount < minItems) {
        promoCode = null;
    }

    const total = subtotal - discount;

    if (discount > 0 && promoActive) {
        discountRow.classList.remove('hidden');
        discountAmount.textContent = `-Rp${discount.toLocaleString()}`;
    } else {
        discountRow.classList.add('hidden');
    }

    totalSpan.textContent = `Rp${total.toLocaleString()}`;
    countBadge.textContent = totalItems;

    document.querySelectorAll('.qty-inc').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id, 1);
        });
    });
    document.querySelectorAll('.qty-dec').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id, -1);
        });
    });
    document.querySelectorAll('.qty-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            delete cart[id];
            updateCartUI();
        });
    });
}

function addToCart(productId, delta = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (!cart[productId]) {
        cart[productId] = { qty: 0, product };
    }
    const newQty = cart[productId].qty + delta;
    if (newQty <= 0) {
        delete cart[productId];
    } else {
        cart[productId].qty = newQty;
    }
    updateCartUI();

    const btn = document.querySelector(`.add-btn[data-id="${productId}"]`);
    if (btn) {
        btn.style.transform = 'scale(0.85)';
        setTimeout(() => btn.style.transform = '', 250);
    }
}

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        addToCart(id, 1);
        if (!document.getElementById('cartSidebar').classList.contains('open')) {
            toggleCart(true);
        }
    });
});

function toggleCart(open) {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (open) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}

document.getElementById('cartToggle').addEventListener('click', () => {
    const isOpen = document.getElementById('cartSidebar').classList.contains('open');
    toggleCart(!isOpen);
});
document.getElementById('closeCart').addEventListener('click', () => toggleCart(false));
document.getElementById('cartOverlay').addEventListener('click', () => toggleCart(false));

document.getElementById('applyPromo').addEventListener('click', () => {
    const input = document.getElementById('promoInput');
    const code = input.value.trim().toUpperCase();
    const itemCount = getTotalItems();
    const minItems = 2;

    if (!code) {
        alert('Masukkan kode promo!');
        return;
    }
    if (itemCount < minItems) {
        alert(`❌ Promo hanya berlaku jika minimal ${minItems} produk di keranjang! (sekarang ${itemCount})`);
        input.value = '';
        return;
    }
    if (DISCOUNTS[code]) {
        promoCode = code;
        alert(`✅ Kode promo ${code} berhasil! Diskon ${DISCOUNTS[code] * 100}%`);
        updateCartUI();
    } else {
        promoCode = null;
        alert('❌ Kode promo tidak valid');
    }
    input.value = '';
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
    const total = document.getElementById('totalPrice').textContent;
    const itemCount = getTotalItems();
    if (itemCount === 0) {
        alert('Keranjang kosong!');
        return;
    }
    alert(`🛒 Checkout berhasil!\nTotal: ${total}\nJumlah produk: ${itemCount}\nTerima kasih sudah berbelanja!`);
    cart = {};
    promoCode = null;
    updateCartUI();
    toggleCart(false);
});

// ============================================================
// AI CHATBOT
// ============================================================
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendChat');

function getBotReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('produk') || m.includes('list') || m.includes('apa saja')) {
        const names = products.map(p => `• ${p.name} (Rp${p.price.toLocaleString()})`).join('\n');
        return `Berikut produk kami:\n${names}\n\nKetik nama produk untuk detail.`;
    }
    for (let p of products) {
        if (m.includes(p.name.toLowerCase())) {
            return `${p.name} — Rp${p.price.toLocaleString()}\n${p.desc}\n\nKlik tombol "Pesan Langsung" di produk untuk order via WA.`;
        }
    }
    if (m.includes('promo') || m.includes('diskon')) {
        const codes = Object.keys(DISCOUNTS).map(k => `${k} (${DISCOUNTS[k]*100}%)`).join(', ');
        return `Kode promo aktif: ${codes || 'belum ada'}. Syarat: minimal 2 produk di keranjang.`;
    }
    if (m.includes('order') || m.includes('beli') || m.includes('cara')) {
        return 'Caranya: tambahkan produk ke keranjang, lalu Checkout. Atau langsung klik "Pesan Langsung" di setiap produk untuk chat WA.';
    }
    if (m.includes('halo') || m.includes('hai') || m.includes('hey')) {
        return 'Halo! 👋 Ada yang bisa saya bantu? Tanya produk, harga, atau promo.';
    }
    if (m.includes('terima kasih') || m.includes('thanks')) {
        return 'Sama-sama! 😊 Senang bisa membantu.';
    }
    const fallbacks = [
        'Hmm, saya belum paham. Coba tanya tentang produk, harga, atau promo ya!',
        'Maaf, saya AI sederhana. Tanyakan soal produk yang tersedia.',
        'Ketik "produk" untuk lihat daftar, atau "promo" untuk kode diskon.',
        'Saya bisa bantu info produk dan promo. Ada yang mau ditanyakan?'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatMessages.innerHTML += `<div class="msg user">${text}</div>`;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
        const reply = getBotReply(text);
        chatMessages.innerHTML += `<div class="msg bot">${reply}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 400);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function toggleChat(open) {
    const modal = document.getElementById('chatModal');
    if (open) {
        modal.classList.add('open');
    } else {
        modal.classList.remove('open');
    }
}

document.getElementById('chatToggle').addEventListener('click', () => {
    const isOpen = document.getElementById('chatModal').classList.contains('open');
    toggleChat(!isOpen);
});
document.getElementById('chatToggle2').addEventListener('click', () => toggleChat(true));
document.getElementById('closeChat').addEventListener('click', () => toggleChat(false));

document.getElementById('mainWaBtn').href =
    `https://wa.me/${WA_NUMBER}?text=Halo%2C%20mau%20tanya-tanya%20soal%20aplikasi%2Fpremium+MikuStore`;

// ============================================================
// PARTIKEL CANVAS
// ============================================================
const canvas = document.getElementById('partikelCanvas');
const ctx = canvas.getContext('2d');
let w, h;
const particles = [];
const COUNT = 100;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        const hue = 200 + Math.random() * 60;
        this.color = `hsl(${hue}, 80%, 70%)`;
        this.opacity = Math.random() * 0.5 + 0.15;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(74, 154, 212, ${0.06 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================================
// INIT
// ============================================================
updateCartUI();
console.log('⚡ MikuStore siap!');