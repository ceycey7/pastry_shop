const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');
const cartToggle  = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose   = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');

function openCart() {
    cartSidebar.classList.add('is-open');
    cartOverlay.classList.add('is-visible');
    cartSidebar.setAttribute('aria-hidden', 'false');
}

function closeCart() {
    cartSidebar.classList.remove('is-open');
    cartOverlay.classList.remove('is-visible');
    cartSidebar.setAttribute('aria-hidden', 'true');
}

document.addEventListener('DOMContentLoaded', () => {

    hamburger.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

});