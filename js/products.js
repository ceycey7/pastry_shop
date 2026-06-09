const products= [
    {
        id: 1,
        name: "Chocolate Layer Cake",
        category: "Cakes",
        price: 24.99,
        discount: 20,
        offerEnds: "2026-06-15",
        description: "Rich chocolate layers with velvety ganache frosting.",
        inStock: true
    },
    {
        id:2,
        name: "Strawberry Chiffon Cake",
        category: "Cakes",
        price: 22.99,
        discount: null,
        offerEnds: null,
        description: "Light chiffon cake with fresh strawberry cream.",
        inStock: true
    },
    {
        id:3,
        name:"Butter Croissant",
        category: "Pastries",
        price: 3.99,
        discount: 10,
        offerEnds: "2026-06-17",
        description: "Flaky, golden croissant made with pure butter.",
        inStock: true
    },
    {
        id: 4,
        name: "Almond Danish",
        category: "Pastries",
        price: 4.49,
        discount: null,
        offerEnds: null,
        description: "Crispy pastry filled with sweet almond cream.",
        inStock: true
    },
    {
        id:5,
        name: "Cinnamon Roll",
        category: "Pastries",
        price: 4.99,
        discount: 15,
        offerEnds: "2026-06-20",
        description: "Soft roll swirled with cinnamon and topped with glaze.",
        inStock: true
    },
    {
        id: 6,
        name: "Chocolate Chip Cookies",
        category: "Cookies",
        price: 2.49,
        discount: null,
        offerEnds: null,
        description: "Classic cookies loaded with dark chocolate chips.",
        inStock: true
    },
    {
        id: 7,
        name: "Lavender Shortbread",
        category: "Cookies",
        price: 2.99,
        discount: 25,
        offerEnds: "2026-06-16",
        description: "Buttery shortbread with a hint of lavender.",
        inStock: true
    },
    {
        id: 8,
        name: "Sourdough Loaf",
        category: "Breads",
        price: 8.99,
        discount: null,
        offerEnds: null,
        description: "Slow-fermented sourdough with a crispy crust.",
        inStock: true
    },
    {
        id:9,
        name: "Rosemary Focaccia",
        category: "Breads",
        price: 7.49,
        discount: 10,
        offerEnds: "2026-06-18",
        description: "Fluffy Italian flatbread with rosemary and olive oil.",
        inStock: true
    },
    {
        id: 10,
        name: "Vanilla Latte",
        category: "Drinks",
        price: 4.99,
        discount: null,
        offerEnds: null,
        description: "Smooth espresso with steamed milk and vanilla syrup.",
        inStock: true
    },
    {
        id:11,
        name: "Rose Lemonade",
        category: "Drinks",
        price: 3.99,
        discount: 15,
        offerEnds: "2026-06-19",
        description: "Resfreshing lemonade with a touch of rose water.",
        inStock: true
    },
    {
        id: 12,
        name: "Matcha Latte",
        category: "Drinks",
        price: 5.49,
        discount: null,
        offerEnds: null,
        description: "Ceremonial matcha with creamy oat milk.",
        inStock: true
    },
];

const categories= ["All", ...new Set(products.map(p=> p.category))];

let activeCategory= "All";

function getFilteredProducts() {
    if (activeCategory==="All") return products;
    return products.filter(p=> p.category=== activeCategory);
}

function renderFilters() {
    const container= document.getElementById("products-container");
    const filterHTML= `
        <div id="filter-bar">
            ${categories.map(cat=> `
                <button
                    class="filter-btn ${cat===activeCategory?'active':''}"
                    data-category="${cat}">
                    ${cat}
                </button>
            `).join('')}
        </div>
        <div id="product-grid"></div>
    `;

    container.innerHTML = filterHTML;

    document.querySelectorAll(".filter-btn").forEach(btn=> {
        btn.addEventListener("click",() => {
            activeCategory= btn.dataset.category;
            document.querySelectorAll(".filter-btn").forEach(b=> b.classList.remove("active"));
            btn.classList.add("active");
            renderProductGrid();
        });
    });
}

function renderProductGrid() {
    const grid= document.getElementById("product-grid");
    const filtered = getFilteredProducts();

    grid.innerHTML=filtered.map(product=> {
        const discountedPrice= product.discount
            ? (product.price * (1- product.discount/100)).toFixed(2)
            : null;

        const priceHTML= discountedPrice
            ? `<span class="product-card__original-price">$${product.price.toFixed(2)}</span>
                <span class="product-card__price discounted">$${discountedPrice}</span>`
            : `<span class="product-card__price">$${product.price.toFixed(2)}</span>`;

        const badgeHTML= product.discount
            ? `<span class="product-card__badge">${product.discount}% OFF</span>`
            : '';

        return `
            <div class="product-card" data-id="${product.id}">
                ${badgeHTML}
                <div class="product-card__category">${product.category}</div>
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <div class="product-card__footer">
                    <div class="product-card__price">${priceHTML}</div>
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fa-solid fa-plus"></i> Add to cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function initProducts(){
    renderFilters();
    renderProductGrid();
}

document.addEventListener("DOMContentLoaded",initProducts);