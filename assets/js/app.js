/* =========================================================
   WORTH IT: MANGALORE — CORE APPLICATION LOGIC
   ========================================================= */

const TAG_META = {
  underrated: { label: "Underrated Gem", class: "cat-underrated" },
  cheap:      { label: "Cheap Eats",      class: "cat-cheap" },
  splurge:    { label: "Worth the Splurge", class: "cat-splurge" }
};

let ENTRIES = [];
let currentAudience = "all";
let currentCategory = "all";
let searchQuery = "";

// LocalStorage states
const userVotes = JSON.parse(localStorage.getItem("worthit_votes") || "{}");
const eatenSpots = JSON.parse(localStorage.getItem("worthit_eaten") || "{}");

/* Fallback database if fetched over file:// protocol without a server */
const FALLBACK_ENTRIES = [
  {
    "id": "giri-manjas",
    "name": "Giri Manja's",
    "area": "Car Street",
    "tags": ["splurge", "underrated"],
    "audience": ["local", "tourist"],
    "price": "₹380 - ₹550 per person",
    "order": "Anjal Tawa Fry + Squid Masala Fry with Fish Meal",
    "take": "Old heritage tile house dining. The Anjal (King Fish) tawa fry is unmatched anywhere on the Konkan coast. Arrive by 12:30 PM or prepare to wait 45 mins in the sun.",
    "timing": "Best time: 12:15 PM or 2:30 PM (Peak rush: 1:00 PM - 2:00 PM). Closed for dinner on Sundays.",
    "highlightedReview": {
      "quote": "The garlic-red chilli tawa masala seared on the Anjal slice is what every Mangalorean dreams of when away from home.",
      "author": "Kudla Native & Regular"
    },
    "votes": 184,
    "visited": "2026-09-18",
    "mapsUrl": "https://maps.google.com/?q=Giri+Manja's+Mangalore",
    "photo": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "🐟",
    "mealType": "lunch"
  },
  {
    "id": "hotel-narayana",
    "name": "Hotel Narayana",
    "area": "Bunder (Old Port)",
    "tags": ["cheap", "underrated"],
    "audience": ["local", "tourist"],
    "price": "₹180 - ₹280 per person",
    "order": "Standard Fish Meals with Fresh Fried Kane (Ladyfish) or Bangude",
    "take": "No menus, no frills, right next to the historic fishing docks. Hot boiled rice served on banana leaves while servers walk around with sizzling fish platters straight out of the hot oil pans.",
    "timing": "Best time: 1:00 PM - 2:00 PM when the morning dock catches hit the kitchen. Avoid post 3:00 PM.",
    "highlightedReview": {
      "quote": "Pure old-school port vibe. The fish curry gravy poured over parboiled rice is simple perfection.",
      "author": "Frequent Dockside Diner"
    },
    "votes": 215,
    "visited": "2026-09-22",
    "mapsUrl": "https://maps.google.com/?q=Hotel+Narayana+Bunder+Mangalore",
    "photo": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "🍲",
    "mealType": "lunch"
  },
  {
    "id": "pabbas-ideal",
    "name": "Pabbas (Ideal Ice Cream)",
    "area": "Lalbagh / Hampankatta",
    "tags": ["cheap"],
    "audience": ["local", "tourist"],
    "price": "₹90 - ₹160 per ice cream",
    "order": "Gadbad (or 'Dilkush' / 'Tiramisu Coupe')",
    "take": "Mangalore's crown jewel dessert spot since 1975. The multi-layered Gadbad with jelly, fruits, and vanilla/strawberry scoops is legendary. Fast service despite relentless weekend crowds.",
    "timing": "Open until 10:30 PM. Expect 15-20 min queues on Friday and Saturday evenings, but the table turnover is lightning fast.",
    "highlightedReview": {
      "quote": "You simply haven't visited Mangalore if you haven't sat inside Pabbas at 10 PM eating a tall glass of Gadbad.",
      "author": "Traveler from Bengaluru"
    },
    "votes": 342,
    "visited": "2026-09-24",
    "mapsUrl": "https://maps.google.com/?q=Pabbas+Ideal+Cafe+Lalbagh+Mangalore",
    "photo": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "🍨",
    "mealType": "dessert"
  },
  {
    "id": "machali",
    "name": "Machali",
    "area": "Sharavu Temple Road",
    "tags": ["splurge"],
    "audience": ["tourist", "local"],
    "price": "₹450 - ₹650 per person",
    "order": "Crab Ghee Roast + Marwai Sukka (Clams) + Neer Dosa",
    "take": "Super popular, air-conditioned, and remarkably consistent. The Crab Ghee Roast here has deep byadagi chilli aroma without burning your palate. Order Neer Dosa to mop up the ghee sauce.",
    "timing": "Peak rush: 1:30 PM - 2:30 PM. Token system operates on busy weekends. Valet parking can get crammed.",
    "highlightedReview": {
      "quote": "Cleanest seafood presentation in city center with zero compromise on authentic spice levels.",
      "author": "Food Critic Review"
    },
    "votes": 198,
    "visited": "2026-09-15",
    "mapsUrl": "https://maps.google.com/?q=Machali+Restaurant+Mangalore",
    "photo": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "🦀",
    "mealType": "lunch"
  },
  {
    "id": "shetty-lunch-home",
    "name": "Shetty Lunch Home",
    "area": "Hampankatta",
    "tags": ["splurge", "underrated"],
    "audience": ["local", "tourist"],
    "price": "₹400 - ₹550 per person",
    "order": "Original Chicken Ghee Roast + Fluffy Neer Dosa",
    "take": "The lineage that originally pioneered Kundapura-style Ghee Roast. Thick, glistening crimson ghee coating, tender meat, and earthy spices. Best experienced with friends for sharing.",
    "timing": "Best for dinner around 8:00 PM. Order 4-5 Neer Dosas per ghee roast dish.",
    "highlightedReview": {
      "quote": "The standard against which all ghee roasts in India are compared. The aroma hits your nose before the plate reaches the table.",
      "author": "Mangalore Food Enthusiast"
    },
    "votes": 167,
    "visited": "2026-09-10",
    "mapsUrl": "https://maps.google.com/?q=Shetty+Lunch+Home+Hampankatta+Mangalore",
    "photo": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "🍗",
    "mealType": "dinner"
  },
  {
    "id": "taj-mahal-cafe",
    "name": "Taj Mahal Cafe",
    "area": "Car Street / Kodialbail",
    "tags": ["cheap", "underrated"],
    "audience": ["local", "tourist"],
    "price": "₹50 - ₹90 per person",
    "order": "Tuppa Dosa (Ghee Roast Dosa) + Mangalore Buns + Filter Coffee",
    "take": "Centuries of heritage. The Mangalore Buns (banana-fermented sweet puris) served with coconut chutney and sambar are fluffy pillows of comfort. Pure vegetarian Kudla tradition.",
    "timing": "Morning glory: 7:00 AM - 9:30 AM for the freshest batch of Buns and sizzling hot Tuppa Dosas.",
    "highlightedReview": {
      "quote": "The brass tumbler filter coffee alone is worth waking up early for. True old-world charm.",
      "author": "Local Architect"
    },
    "votes": 220,
    "visited": "2026-09-20",
    "mapsUrl": "https://maps.google.com/?q=Taj+Mahal+Cafe+Car+Street+Mangalore",
    "photo": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "☕",
    "mealType": "breakfast"
  },
  {
    "id": "hotel-janatha-deluxe",
    "name": "Hotel Janatha Deluxe",
    "area": "K S Rao Road",
    "tags": ["cheap"],
    "audience": ["local"],
    "price": "₹80 - ₹140 per person",
    "order": "Goli Baje (available evening 4 PM) + Filter Coffee",
    "take": "The quintessential 4 PM tea-time destination. Hot, crispy-outside, spongy-inside Goli Baje dipped in spicy green coconut chutney. If you arrive past 6 PM, they will usually be sold out.",
    "timing": "Arrive at 4:15 PM sharp. Goli Baje is made in hot fresh batches and disappears fast.",
    "highlightedReview": {
      "quote": "The ginger and green chilli kick inside their Goli Baje is unbeatable on a rainy Mangalore evening.",
      "author": "Daily Commuter"
    },
    "votes": 135,
    "visited": "2026-09-08",
    "mapsUrl": "https://maps.google.com/?q=Hotel+Janatha+Deluxe+KS+Rao+Road+Mangalore",
    "photo": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    "fallbackIcon": "🥟",
    "mealType": "snacks"
  }
];

/* Initialize Data */
async function loadData() {
  try {
    const res = await fetch("data/spots.json");
    if (res.ok) {
      ENTRIES = await res.json();
    } else {
      ENTRIES = FALLBACK_ENTRIES;
    }
  } catch (err) {
    ENTRIES = FALLBACK_ENTRIES;
  }

  renderList();
  initLastUpdated();
  updateFoodieScore();
  if (window.generateSchemaJsonLd) {
    window.generateSchemaJsonLd(ENTRIES);
  }
}

/* Format Date */
function formatMonthYear(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

/* =========================================================
   GAMIFICATION: KUDLA FOODIE SCORE LOGIC
   ========================================================= */
function toggleEaten(id) {
  if (eatenSpots[id]) {
    delete eatenSpots[id];
  } else {
    eatenSpots[id] = true;
  }
  localStorage.setItem("worthit_eaten", JSON.stringify(eatenSpots));
  updateFoodieScore();
  renderList();
}

function updateFoodieScore() {
  const count = Object.keys(eatenSpots).length;
  const total = ENTRIES.length || 7;
  const percent = Math.min(100, Math.round((count / total) * 100));

  const bar = document.getElementById("score-progress-bar");
  const countEl = document.getElementById("score-count-text");
  const badgeEl = document.getElementById("score-badge");
  const shareBtn = document.getElementById("whatsapp-share-btn");

  if (bar) bar.style.width = `${percent}%`;
  if (countEl) countEl.textContent = `${count} of ${total} spots conquered (${percent}%)`;

  let rank = "Kudla Explorer 🗺️";
  if (count >= 1 && count <= 2) rank = "Fresh off the train 🚆";
  else if (count >= 3 && count <= 4) rank = "Adopted Kudla Resident 🥥";
  else if (count >= 5 && count <= 6) rank = "Seafood Veteran 🐟";
  else if (count >= total) rank = "Certified Kudla Connoisseur 👑";

  if (badgeEl) badgeEl.textContent = rank;

  const dockScore = document.getElementById("dock-score-pill");
  if (dockScore) dockScore.textContent = `Score (${count}/${total})`;

  if (shareBtn) {
    const text = encodeURIComponent(
      `I've conquered ${count}/${total} iconic spots on Worth It: Mangalore and earned the title "${rank}"! Can you beat my Kudla food score? Check it out: https://worthitmangalore.com/`
    );
    shareBtn.href = `https://api.whatsapp.com/send?text=${text}`;
  }
}

/* =========================================================
   MATCHMAKER: "WHAT SHOULD I EAT RIGHT NOW?"
   ========================================================= */
function pickRandomSpot() {
  if (!ENTRIES.length) return;
  const randomIndex = Math.floor(Math.random() * ENTRIES.length);
  const picked = ENTRIES[randomIndex];

  // Reset filters to ensure the picked item is visible
  resetFilters();

  setTimeout(() => {
    const el = document.getElementById(`spot-${picked.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlighted-spot");
      setTimeout(() => el.classList.remove("highlighted-spot"), 2500);
    }
  }, 100);
}

function scrollToSearch() {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => searchInput.focus(), 300);
  }
}

function scrollToScore() {
  const banner = document.querySelector(".foodie-score-banner");
  if (banner) {
    banner.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* =========================================================
   VOTING & SHARING
   ========================================================= */
function toggleVote(id) {
  const hasVoted = !!userVotes[id];
  const entry = ENTRIES.find(e => e.id === id);
  if (!entry) return;

  if (hasVoted) {
    delete userVotes[id];
    entry.votes = Math.max(0, (entry.votes || 0) - 1);
  } else {
    userVotes[id] = true;
    entry.votes = (entry.votes || 0) + 1;
  }

  localStorage.setItem("worthit_votes", JSON.stringify(userVotes));
  renderList();
}

function shareSpot(id, name) {
  const url = `${window.location.origin}${window.location.pathname}#spot-${id}`;
  if (navigator.share) {
    navigator.share({
      title: `${name} — Worth It: Mangalore`,
      text: `Check out ${name} on Worth It Mangalore: honest review and directions:`,
      url: url
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert(`Direct link to ${name} copied to clipboard! Share it with friends.`);
    });
  }
}

/* Quick Search Chips */
function quickSearch(term) {
  const input = document.getElementById("search");
  input.value = term;
  searchQuery = term.toLowerCase();
  renderList();
  input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Reset Filters */
function resetFilters() {
  document.getElementById("search").value = "";
  searchQuery = "";
  currentAudience = "all";
  currentCategory = "all";
  document.querySelectorAll("#audience-filters .pill").forEach(b =>
    b.setAttribute("aria-pressed", b.dataset.audience === "all" ? "true" : "false"));
  document.querySelectorAll("#category-filters .pill").forEach(b =>
    b.setAttribute("aria-pressed", b.dataset.category === "all" ? "true" : "false"));
  renderList();
}

/* =========================================================
   RENDER LIST
   ========================================================= */
function renderList() {
  const listEl = document.getElementById("entry-list");
  const emptyEl = document.getElementById("empty-state");
  const countEl = document.getElementById("results-count-text");

  const filtered = ENTRIES.filter(e => {
    const matchAudience = currentAudience === "all" || e.audience.includes(currentAudience);
    const matchCategory = currentCategory === "all" || e.tags.includes(currentCategory);
    
    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const tagStrings = e.tags.map(t => TAG_META[t]?.label || "").join(" ");
      const textCorpus = [e.name, e.area, e.order, e.take, tagStrings, e.price, e.timing || ""].join(" ").toLowerCase();
      matchSearch = textCorpus.includes(q);
    }

    return matchAudience && matchCategory && matchSearch;
  });

  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${ENTRIES.length} curated spots`;
  if (emptyEl) emptyEl.style.display = filtered.length ? "none" : "block";
  if (!listEl) return;
  listEl.innerHTML = "";

  filtered.forEach(e => {
    const li = document.createElement("li");
    li.className = "entry-card";
    li.id = `spot-${e.id}`;

    const tagBadges = e.tags
      .map(t => TAG_META[t] ? `<span class="badge ${TAG_META[t].class}">${TAG_META[t].label}</span>` : "")
      .join("");

    const isVoted = !!userVotes[e.id];
    const isEaten = !!eatenSpots[e.id];
    const voteCount = e.votes || 0;

    const photoHtml = e.photo
      ? `<img class="card-photo" src="${e.photo}" alt="${e.name} ${e.order}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="photo-fallback" style="display:none;">${e.fallbackIcon || '🍽️'}<span>${e.name}</span></div>`
      : `<div class="photo-fallback">${e.fallbackIcon || '🍽️'}<span>${e.name}</span></div>`;

    const timingHtml = e.timing
      ? `<div class="timing-tip"><span>⏰</span><span><strong>Insider Timing:</strong> ${e.timing}</span></div>`
      : "";

    const quoteHtml = e.highlightedReview
      ? `<div class="highlighted-quote-box">
           <div class="quote-badge">⭐ Highlighted Community Take</div>
           <div class="quote-content">"${e.highlightedReview.quote}"</div>
           <div class="quote-author">— ${e.highlightedReview.author}</div>
         </div>`
      : "";

    li.innerHTML = `
      <div class="card-grid">
        <div class="card-photo-wrap">
          ${photoHtml}
          <div class="photo-overlay-badges">
            <span class="badge area photo-badge-area">📍 ${e.area}</span>
            <span class="photo-badge-price">${e.price}</span>
          </div>
        </div>
        <div class="card-body">
          <div>
            <div class="card-header-row">
              <h2 class="entry-title">${e.name}</h2>
              <span class="entry-price-tag">${e.price}</span>
            </div>
            <div class="tag-row">
              <span class="badge area">📍 ${e.area}</span>
              ${tagBadges}
            </div>
            <div class="order-box">
              <strong>Must-Order:</strong> ${e.order}
            </div>
            <p class="take-text">${e.take}</p>
            ${timingHtml}
            ${quoteHtml}
          </div>
          <div class="card-footer">
            <div class="footer-left">
              <button class="eaten-check-btn ${isEaten ? 'checked' : ''}" onclick="toggleEaten('${e.id}')" title="Check off if you have eaten here">
                <span>${isEaten ? '✓' : '○'}</span>
                <span>${isEaten ? 'Eaten Here!' : 'I ate here'}</span>
              </button>
              <button class="rate-btn ${isVoted ? 'voted' : ''}" onclick="toggleVote('${e.id}')" title="Vote if you agree this spot is worth it">
                <span>👍</span>
                <span>Worth It</span>
                <span>(${voteCount})</span>
              </button>
            </div>
            <div class="footer-right-actions">
              <button class="share-spot-btn" onclick="shareSpot('${e.id}', '${e.name}')" title="Share direct link to this spot">
                <span>🔗</span>
                <span>Share</span>
              </button>
              <a class="maps-btn" href="${e.mapsUrl}" target="_blank" rel="noopener nofollow">
                <span>Directions</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    listEl.appendChild(li);
  });
}

/* Auto-calculate Guide Last Updated */
function initLastUpdated() {
  const dates = ENTRIES.map(e => e.visited).filter(Boolean).sort();
  if (!dates.length) return;
  const latest = dates[dates.length - 1];
  const el = document.getElementById("last-updated-text");
  if (el) el.textContent = `Guide updated ${formatMonthYear(latest)}`;
}

/* Event Listeners Setup */
function setupEventListeners() {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderList();
    });
  }

  const audGroup = document.getElementById("audience-filters");
  if (audGroup) {
    audGroup.addEventListener("click", (e) => {
      const btn = e.target.closest("button.pill");
      if (!btn) return;
      currentAudience = btn.dataset.audience;
      document.querySelectorAll("#audience-filters .pill").forEach(b =>
        b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      renderList();
    });
  }

  const catGroup = document.getElementById("category-filters");
  if (catGroup) {
    catGroup.addEventListener("click", (e) => {
      const btn = e.target.closest("button.pill");
      if (!btn) return;
      currentCategory = btn.dataset.category;
      document.querySelectorAll("#category-filters .pill").forEach(b =>
        b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      renderList();
    });
  }
}

/* Modals */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("active");
  document.body.style.overflow = "";
}
function closeModalOnOverlay(event, id) {
  if (event.target.id === id) closeModal(id);
}
function handleSuggestionSubmit() {
  const input = document.getElementById("suggest-input");
  if (!input || !input.value.trim()) return;
  const feedback = document.getElementById("suggest-feedback");
  if (feedback) feedback.style.display = "block";
  input.value = "";
  setTimeout(() => {
    closeModal('submit-modal');
    if (feedback) feedback.style.display = "none";
  }, 2200);
}

// Start
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadData();
});
