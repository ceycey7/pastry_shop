const defaultReviews = [
    {
        id: 1,
        userName: "Bellamy Blake",
        rating: 5,
        date: "2026-05-28",
        comment: "The Chocolate Layer Cake is absolute perfection! The ganage is rich but not overwhelming."
    },
    {
        id: 2,
        userName: "Leroy Sane",
        rating: 4,
        date: "2026-06-02",
        comment: "The Sourdough Loaf has an amazing crust and soft interior. Perfect for breakfast."
    },
    {
        id: 3,
        userName: "Sophia Martinez",
        rating: 5,
        date: "2026-06-09",
        comment: "Absolutely love this place! The chocolate eclairs are out of this world, and the staff is incredibly friendly. It has easily become my favorite spot in town."
    },
    {
        id: 4,
        userName: "Liam Johnson",
        rating: 4,
        date: "2026-06-10",
        comment: "The lemon tarts have the perfect balance of sweet and tangy. Pair it with their cold brew coffee for the best afternoon treat. Will definitely be back for more!"
    }
];

let reviews= JSON.parse(localStorage.getItem("pastryReviews")) || defaultReviews;
let selectedRating = 5;

function renderStars(rating, isInteractive= false) {
    let starsHTML= '';
    for (let i=1; i<=5; i++) {
        const starClass = i<= rating ? 'fa-solid fa-star filled': 'fa-regular fa-star';
        const dataAttr= isInteractive ? `data-value="${i}"` : '';
        starsHTML += `<i class="${starClass} review-star" ${dataAttr}></i>`;
    }
    return starsHTML;
}

function formatDate(dateString) {
    const options= {year: 'numeric', month:'long', day:'numeric'};
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function renderReviews() {
    const container= document.getElementById("reviews-container");
    if (!container) return;

    container.innerHTML = `
        <div class="reviews-wrapper">
            <div class="review-form-container">
                <h3>Leave a Review</h3>
                <form id="reviewForm" class="review-form">
                    <div class="form-group">
                        <label for="reviewUser">Your Name</label>
                        <input type="text" id="reviewUser" required placeholder="Enter your name">
                    </div>
                    
                    <div class="form-group">
                        <label>Your Rating</label>
                        <div class="interactive-stars" id="formStars">
                            ${renderStars(selectedRating, true)}
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="reviewComment">Your Comment</label>
                        <textarea id="reviewComment" required rows="4" placeholder="Share your experience..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
            </div>

            <div class="reviews-list-container">
                <h3>Customer Reviews</h3>
                <div class="reviews-grid">
                    ${reviews.map(review=> `
                        <div class="review-card">
                            <div class="review-card__header">
                                <div class="review-card__meta">
                                    <h4 class="review-card__username">${review.userName}</h4>
                                    <span class="review-card__date">${formatDate(review.date)}</span>
                                </div>
                                <div class="review-card__rating">
                                    ${renderStars(review.rating)}
                                </div>
                            </div>
                            <p class="review-card__comment">"${review.comment}"</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    initFormEvents();
}

function initFormEvents() {
    const formStars= document.getElementById("formStars");
    const reviewForm= document.getElementById("reviewForm");

    if (formStars) {
        const stars= formStars.querySelectorAll(".review-star");

        stars.forEach(star=> {
            star.addEventListener("click",(e) => {
                selectedRating= parseInt(e.target.dataset.value);
                updateFormStars(selectedRating);
            });

            star.addEventListener("mouseenter",(e) => {
                const currentHover = parseInt(e.target.dataset.value);
                updateFormStars(currentHover);
            });
        });

        formStars.addEventListener("mouseleave", () => {
            updateFormStars(selectedRating);
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener("submit",(e) => {
            e.preventDefault();

            const userName= document.getElementById("reviewUser").value.trim();
            const comment= document.getElementById("reviewComment").value.trim();
            const today= new Date().toISOString().split('T')[0];

            const newReview= {
                id: Date.now(),
                userName: userName,
                rating: selectedRating,
                date: today,
                comment: comment
            };

            reviews.unshift(newReview);

            localStorage.setItem("pastryReviews", JSON.stringify(reviews));

            selectedRating= 5;
            renderReviews();
        });
    }
}

function updateFormStars(rating) {
    const stars= document.querySelectorAll("#formStars .review-star");
    stars.forEach((star, index) => {
        if (index<rating) {
            star.className= "fa-solid fa-star review-star filled";
        } else {
            star.className= "fa-regular fa-star review-star";
        }
    });
}

document.addEventListener("DOMContentLoaded", renderReviews);