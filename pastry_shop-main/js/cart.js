let cart = JSON.parse(localStorage.getItem("pastryCart")) || [];

function calculateCartTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemOriginalTotal = product.price * item.quantity;
            subtotal += itemOriginalTotal;

            if (product.discount) {
                const discountedPrice = product.price * (1 - product.discount / 100);
                totalDiscount += (product.price - discountedPrice) * item.quantity;
            }
        }
    });

    const total = subtotal - totalDiscount;

    return {
        subtotal: subtotal.toFixed(2),
        discount: totalDiscount.toFixed(2),
        total: total.toFixed(2)
    };
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

function renderCart() {
    const cartBody = document.getElementById("cartBody");
    const cartFooter = document.getElementById("cartFooter");
    
    if (!cartBody || !cartFooter) return;

    updateCartBadge();
    localStorage.setItem("pastryCart", JSON.stringify(cart));

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-basket-shopping cart-empty__icon"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        cartFooter.innerHTML = '';
        return;
    }

    cartBody.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        const currentPrice = product.discount 
            ? (product.price * (1 - product.discount / 100)) 
            : product.price;

        return `
            <div class="cart-item" data-id="${product.id}">
                <div class="cart-item__details">
                    <h4 class="cart-item__name">${product.name}</h4>
                    <span class="cart-item__price">$${currentPrice.toFixed(2)}</span>
                </div>
                <div class="cart-item__actions">
                    <div class="cart-quantity-controls">
                        <button class="btn-qty btn-qty--minus" data-id="${product.id}">-</button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button class="btn-qty btn-qty--plus" data-id="${product.id}">+</button>
                    </div>
                    <button class="btn-cart-remove" data-id="${product.id}" aria-label="Remove item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const totals = calculateCartTotals();
    cartFooter.innerHTML = `
        <div class="cart-summary">
            <div class="cart-summary__line">
                <span>Subtotal:</span>
                <span>$${totals.subtotal}</span>
            </div>
            ${totals.discount > 0 ? `
                <div class="cart-summary__line cart-summary__line--discount">
                    <span>Discount:</span>
                    <span>-$${totals.discount}</span>
                </div>
            ` : ''}
            <div class="cart-summary__line cart-summary__line--total">
                <span>Total:</span>
                <span>$${totals.total}</span>
            </div>
            <button class="btn btn-primary btn-checkout" id="btnCheckout">
                <i class="fa-solid fa-credit-card"></i> Proceed to Checkout
            </button>
        </div>
    `;

    initCartControls();
}

function initCartControls() {
    document.querySelectorAll(".btn-qty").forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = parseInt(btn.dataset.id);
            const cartItem = cart.find(item => item.id === productId);
            
            if (!cartItem) return;

            if (btn.classList.contains("btn-qty--plus")) {
                cartItem.quantity++;
            } else if (btn.classList.contains("btn-qty--minus")) {
                cartItem.quantity--;
                if (cartItem.quantity === 0) {
                    cart = cart.filter(item => item.id !== productId);
                }
            }
            renderCart();
        });
    });

    document.querySelectorAll(".btn-cart-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = parseInt(btn.dataset.id);
            cart = cart.filter(item => item.id !== productId);
            renderCart();
        });
    });

    const handleClearCart = () => {
        if (confirm("Are you sure you want to clear your entire cart? ")) {
            cart = []; 
            renderCart(); 
        }
    };

    document.querySelectorAll("#cartClearAll").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    document.querySelectorAll("#cartClearAll").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClearCart();
        });
    });

    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar && !cartSidebar.dataset.listenerAdded) {
        cartSidebar.addEventListener("click", (e) => {
            if (e.target.closest("#cartClearAll")) {
                e.preventDefault();
                handleClearCart();
            }
        });
        cartSidebar.dataset.listenerAdded = "true";
    }

    const btnCheckout = document.getElementById("btnCheckout");
    if (btnCheckout) {
        btnCheckout.addEventListener("click", () => {
            alert("Thank you for your order! Processing your pastries...");
            cart = [];
            renderCart();
            document.getElementById("cartClose")?.click();
        });
    }
}

function bindAddToCartEvents() {
    document.querySelectorAll(".btn-add-to-cart").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll(".btn-add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = parseInt(btn.dataset.id);
            const cartItem = cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }

            renderCart();
            
            const cartSidebar = document.getElementById("cartSidebar");
            if (cartSidebar && !cartSidebar.classList.contains("is-open")) {
                document.getElementById("cartToggle")?.click();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    setTimeout(bindAddToCartEvents, 100);
});
