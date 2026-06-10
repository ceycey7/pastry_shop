function getTodaysSeed() {
    const today= new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

function getDailyCandidates() {
    const seed= getTodaysSeed();
    const indices= [];
    let hash=0;

    for (let i=0;i<seed.length;i++) {
        hash= (hash*31+seed.charCodeAt(i))%products.length;
    }

    indices.push(hash%products.length);
    indices.push((hash*7+3)%products.length);

    if (indices[0]===indices[1]) {
        indices[1]= (indices[1]+1)% products.length;
    }

    return [products[indices[0]], products[indices[1]]];
}

function getVoteData() {
    const seed= getTodaysSeed();
    const stored = localStorage.getItem("voteData");

    if (stored) {
        const parsed= JSON.parse(stored);
        if (parsed.date===seed) return parsed;
    }

    const candidates= getDailyCandidates();
    const fresh= {
        date: seed,
        candidates: [candidates[0].id, candidates[1].id],
        votes:{ [candidates[0].id]: 0, [candidates[1].id]:0},
        userVoted: null
    };

    localStorage.setItem("voteData",JSON.stringify(fresh));
    return fresh;
}

function saveVoteData(data) {
    localStorage.setItem("voteData", JSON.stringify(data));
}

function renderVoting() {
    const container= document.getElementById("vote-container");
    const voteData= getVoteData();
    const candidates = voteData.candidates.map(id=>products.find(p=>p.id===id));
    const totalVotes= Object.values(voteData.votes).reduce((a,b)=>a+b,0);

    container.innerHTML= `
        <div id="vote-cards">
            ${candidates.map(product=> {
                const voteCount= voteData.votes[product.id];
                const percentage= totalVotes>0 ? Math.round((voteCount/totalVotes)*100):0;
                const isVoted= voteData.userVoted===product.id;

                return `
                    <div class="vote-card ${isVoted ? 'vote-card--selected': ''}">
                        <div class="vote-card__category">${product.category}</div>
                        <h3 class="vote-card__name">${product.name}</h3>
                        <p class="vote-card__description">${product.description}</p>
                        <p class="vote-card__price">$${product.price.toFixed(2)}</p>
                        ${voteData.userVoted
                            ? `<div class="vote-card__result">
                                <div class="vote-bar">
                                    <div class="vote-bar__fill" style="width: ${percentage}%"></div>
                                </div>
                                <span class="vote-bar__label">${percentage}% (${voteCount} votes)</span>
                                </div>`
                            : `<button class="btn-vote" data-id="${product.id}">
                                <i class="fa-solid fa-thumbs-up"></i> Vote
                                </button>`
                        }
                    </div>
                `;
            }).join('')}
        </div>
        ${voteData.userVoted
            ? `<p class="vote-thankyou"><i class="fa-solid fa-check"></i> Thanks for voting! Come back tomorrow for a new vote.</p>`
            : `<p class="vote-hint">Vote for your favorite product of the day!</p>`
        }
    `;

    if (!voteData.userVoted) {
        container.querySelectorAll(".btn-vote").forEach(btn=>  {
            btn.addEventListener("click",() => {
                const voteId= parseInt(btn.dataset.id);
                voteData.votes[voteId]++;
                voteData.userVoted=voteId;
                saveVoteData(voteData);
                renderVoting();
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", renderVoting);