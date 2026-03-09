// Data produk contoh
const products = [
    {
        id: 1,
        name: "Iphone 17 Pro Max",
        price: 24000000,
        description: "Flagship Apple dengan layar 6,9 inci ProMotion OLED, chipset A19 Pro, dan desain unibody aluminium yang lebih tangguh dengan Ceramic Shield 2",
        image: "https://www.hellostore.id/cdn/shop/files/iPhone_17_Pro_Max_1.png?v=1759998375"
    },
    {
        id: 2,
        name: "Laptop UltraBook",
        price: 24000000,
        description: "Laptop gaming 16 inci kelas atas yang didukung prosesor hingga Intel® Core™ Ultra 9 275HX atau AMD Ryzen 9 8940HX, serta GPU NVIDIA® GeForce RTX™ 50-series (hingga RTX 5080)",
        image: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-161758345/asus_asus_rog_strix_g16_g614ji-i947c6g-o_i9-14900hx-32gb_1tb-rtx4070_8gb-16-_full01_d0y88x9n.jpg"
    },
    {
        id: 3,
        name: "Boze Quietcomfort Ultra Spatial Audio Headphones 2nd Gen",
        price: 6949000,
        description: "Bose QuietComfort Ultra (Gen 2) adalah headphone premium yang menggabungkan peredam bising (ANC) terbaik di kelasnya dengan teknologi Immersive Audio yang kini dilengkapi Cinema Mode untuk pengalaman suara layaknya bioskop",
        image: "https://down-id.img.susercontent.com/file/sg-11134201-8260m-ml1k2tsoouf6a5"
    },
    {
        id: 4,
        name: "Herman Miller X Logitech G Embody",
        price: 23000000,
        description: "Herman Miller x Logitech G Embody adalah investasi ergonomi terbaik yang menggunakan sistem distribusi beban Pixelated Support untuk menjaga kesehatan punggung. Kursi ini dilengkapi material pendingin tembaga dan desain yang mengikuti gerak tubuh secara alami, menjadikannya standar tertinggi kursi gaming profesional dengan ketahanan luar biasa hingga 12 tahun.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQU_4F37XdFtC4z9z4cK4zPz_mC7gX3uNcZg&se"
    }
];

// State global
let cart = [];
let currentSlide = 0;
let slideInterval;
let paymentMethod = "Transfer Bank";

// Load cart dari localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart ke localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update jumlah di icon keranjang
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Format rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Tampilkan notifikasi
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = notification.querySelector('span');
    notificationMessage.textContent = message || 'Produk berhasil ditambahkan ke keranjang!';
    notification.classList.remove('hidden', 'hide');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 2000);
}

// Render produk
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = products.map(product => `
        <div class="product-card bg-white rounded-xl shadow-md overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-blue-600">${formatRupiah(product.price)}</span>
                    <button onclick="addToCart(${product.id})" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-cart-plus mr-2"></i>Tambah
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Tambah ke keranjang
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification();
};

// Render keranjang
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 py-8">Keranjang belanja masih kosong</p>';
        cartTotal.textContent = formatRupiah(0);
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        return `
            <div class="flex items-center justify-between border-b py-4">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${item.name}</h4>
                    <p class="text-sm text-gray-600">${formatRupiah(item.price)}</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="w-8 text-center font-semibold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="w-24 text-right font-semibold text-blue-600">
                    ${formatRupiah(subtotal)}
                </div>
                <button onclick="removeFromCart(${item.id})" class="ml-4 text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = formatRupiah(total);
}

// Update quantity
window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        saveCart();
        renderCart();
    }
};

// Hapus dari keranjang
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
};

// Slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('bg-white', 'bg-opacity-100'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('bg-white', 'bg-opacity-100');
        indicators[index].classList.remove('bg-opacity-50');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    document.getElementById('nextSlide').addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    document.getElementById('prevSlide').addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    slideInterval = setInterval(nextSlide, 5000);
    showSlide(0);
}

// Modal handlers
function initModals() {
    const cartModal = document.getElementById('cartModal');
    const paymentModal = document.getElementById('paymentModal');
    const receiptModal = document.getElementById('receiptModal');
    
    // Buka cart modal
    document.getElementById('cartToggle').addEventListener('click', () => {
        renderCart();
        cartModal.classList.remove('hidden');
    });
    
    // Tutup cart modal
    document.getElementById('closeCart').addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });
    
    // Lanjut ke pembayaran
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }
        cartModal.classList.add('hidden');
        paymentModal.classList.remove('hidden');
    });
    
    // Kembali ke cart
    document.getElementById('backToCart').addEventListener('click', () => {
        paymentModal.classList.add('hidden');
        cartModal.classList.remove('hidden');
    });
    
    // Konfirmasi pembayaran
    document.getElementById('confirmPayment').addEventListener('click', () => {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (selectedPayment) {
            paymentMethod = selectedPayment.value;
            
            // Hitung total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Generate nomor transaksi
            const transactionNumber = 'TRX-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            
            // Render struk
            renderReceipt(transactionNumber, total, paymentMethod);
            
            paymentModal.classList.add('hidden');
            receiptModal.classList.remove('hidden');
        }
    });
    
    // Tutup struk
    document.getElementById('closeReceipt').addEventListener('click', () => {
        receiptModal.classList.add('hidden');
        // Kosongkan keranjang setelah pembayaran sukses
        cart = [];
        saveCart();
    });
    
    // Tutup modal saat klik di luar
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.add('hidden');
        if (e.target === paymentModal) paymentModal.classList.add('hidden');
        if (e.target === receiptModal) receiptModal.classList.add('hidden');
    });
}

// Render struk
function renderReceipt(transactionNumber, total, paymentMethod) {
    const receiptContent = document.getElementById('receiptContent');
    const date = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    receiptContent.innerHTML = `
        <div class="text-center mb-4">
            <h4 class="text-xl font-bold text-gray-800">Reizen Store</h4>
            <p class="text-gray-600">Struk Pembelian</p>
        </div>
        <div class="mb-4">
            <p><span class="font-semibold">No. Transaksi:</span> ${transactionNumber}</p>
            <p><span class="font-semibold">Tanggal:</span> ${date}</p>
            <p><span class="font-semibold">Metode Pembayaran:</span> ${paymentMethod}</p>
        </div>
        <table class="w-full mb-4">
            <thead>
                <tr class="border-b">
                    <th class="text-left py-2">Produk</th>
                    <th class="text-center py-2">Qty</th>
                    <th class="text-right py-2">Harga</th>
                    <th class="text-right py-2">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                    <tr class="border-b">
                        <td class="py-2">${item.name}</td>
                        <td class="text-center py-2">${item.quantity}</td>
                        <td class="text-right py-2">${formatRupiah(item.price)}</td>
                        <td class="text-right py-2">${formatRupiah(item.price * item.quantity)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right font-bold py-2">Total:</td>
                    <td class="text-right font-bold text-blue-600 py-2">${formatRupiah(total)}</td>
                </tr>
            </tfoot>
        </table>
        <div class="text-center text-gray-600 text-sm">
            <p>Terima kasih telah berbelanja di Reizen Store!</p>
        </div>
    `;
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    initSlider();
    initModals();
});
