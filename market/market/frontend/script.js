// API Endpoint
const API_URL = 'http://localhost:8080/products';

// State Variables
let products = [];
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCartFromStorage();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart open/close
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    overlay.addEventListener('click', toggleCart);
}

// Fetch products from Spring Boot Backend
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #e74c3c; padding: 2rem;">
                <h3>Error loading products!</h3>
                <p>Ensure your Spring Boot backend is running on port 8080.</p>
            </div>
        `;
    }
}

// Render products to the grid
function renderProducts() {
    productGrid.innerHTML = '';
    
    if (products.length === 0) {
        productGrid.innerHTML = '<p>No products available.</p>';
        return;
    }

    products.forEach(product => {
        // Fallback icon based on name since we don't have local images yet
        let emoji = '🛒';
        if(product.name.toLowerCase().includes('tomato')) emoji = '🍅';
        if(product.name.toLowerCase().includes('carrot')) emoji = '🥕';
        if(product.name.toLowerCase().includes('onion')) emoji = '🧅';

        // Check stock compared to cart
        const cartItem = cart.find(item => item.id === product.id);
        const qtyInCart = cartItem ? cartItem.cartQuantity : 0;
        const availableStock = product.quantity - qtyInCart;
        const isOutOfStock = availableStock <= 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                <span style="font-size: 5rem;" role="img" aria-label="${product.name}">${emoji}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">Rs. ${product.price.toFixed(2)}</div>
            <div class="product-stock">${availableStock} in stock</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        `;
        productGrid.appendChild(card);
    });
}

/*=================*
 *  Cart Functions *
 *=================*/

function toggleCart() {
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        overlay.classList.add('visible');
    } else {
        overlay.classList.remove('visible');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Prevent exceeding stock
        if (existingItem.cartQuantity >= product.quantity) {
            showNotification('Not enough stock available!');
            return;
        }
        existingItem.cartQuantity += 1;
    } else {
        cart.push({ ...product, cartQuantity: 1 });
    }

    saveCart();
    updateCartUI();
    renderProducts(); // Re-render to update stock numbers on cards
    showNotification(`${product.name} added to cart!`);
    
    // Auto open cart on first item
    if(cart.length === 1 && existingItem === undefined) {
       cartSidebar.classList.add('open');
       overlay.classList.add('visible');
    }
}

function removeFromCart(productId) {
    cart = cart.find(item => item.id === productId).cartQuantity === 1 
        ? cart.filter(item => item.id !== productId) // completely remove
        : cart; // if higher quantity than 1, we use updateQuantity
    
    // Usually remove completely means deleting it regardless of quantity in standard e-commerce UI
    cart = cart.filter(item => item.id !== productId);

    saveCart();
    updateCartUI();
    renderProducts();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const product = products.find(p => p.id === productId);
    const newQty = item.cartQuantity + change;

    // Boundary checks
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQty > product.quantity) {
        showNotification('Not enough stock available!');
        return;
    }

    item.cartQuantity = newQty;
    saveCart();
    updateCartUI();
    renderProducts();
}

// Render the cart sidebar inner HTML
function updateCartUI() {
    cartCount.textContent = cart.reduce((total, item) => total + item.cartQuantity, 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        totalPriceEl.textContent = 'Rs. 0.00';
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.cartQuantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">Rs. ${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="item-quantity">${item.cartQuantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    totalPriceEl.textContent = `Rs. ${total.toFixed(2)}`;
}

// Local Storage functionality
function saveCart() {
    localStorage.setItem('farmerMarketCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('farmerMarketCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Toast Notification
function showNotification(message) {
    // Remove existing if any
    const existing = document.querySelector('.notification');
    if(existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);

    // Trigger reflow
    void notif.offsetWidth;
    
    notif.classList.add('show');

    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}
