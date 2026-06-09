function getDiscountedProducts() {
    return products.filter(p=> p.discount !== null);
}

function renderOffers() {
    const container= document.getElementById("offers-container");
    const offers= getDiscountedProducts();

    if (offers.length===0) {
        container.innerHTML= "<p>No active offers at the moment.</p>";
        return;
    }

    container.innerHTML= offers.map(product=> {
        const discountedPrice= (product.price*(1-product.discount/100)).toFixed(2);
        const savedAmount= (product.price-discountedPrice).toFixed(2);

        return `
            <div class="offer-card" data-id="${product.id}">
                <span class="offer-card__badge">${product.discount}%OFF</span>
                <div class="offer-card__category">${product.category}</div>
                <h3 class="offer-card__name">${product.name}</h3>
                <p class=offer-card__description">${product.description}</p>
                <div class="offer-card__prices">
                    <span class="offer-card__original-price">$${product.price.toFixed(2)}</span>
                    <span class="offer-card__discounted-price">$${discountedPrice}</span>
                    <span class="offer-card__saving">You save $${savedAmount}</span>
                </div>
                <div class="offer-card__footer">
                    <span class="offer-card__expiry">
                        <i class="fa-regular fa-clock"></i> Ends: ${product.offerEnds}
                    </span>
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fa-solid fa-plus"></i> Add to cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener("DOMContentLoaded", renderOffers);