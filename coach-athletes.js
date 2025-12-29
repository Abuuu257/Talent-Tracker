import {
    auth,
    onAuthChange,
    signOut,
    getCoachProfile,
    getAllAthletes,
    addFavorite,
    removeFavorite,
    BACKEND_URL
} from "./register.js";
import { updateNavbar } from "./ui-utils.js";

// State
let allAthletes = [];
let filteredAthletes = [];
let coachFavorites = [];
let currentCoachId = null;

// DOM
const grid = document.getElementById("athletesGrid");
const searchInput = document.getElementById("athleteSearch");
const sportFilter = document.getElementById("filterSport");
const categoryFilter = document.getElementById("filterCategory");
const favoritesToggle = document.getElementById("filterFavorites");
const noResults = document.getElementById("noResults");
const navUserBtn = document.getElementById("navUserBtn");
const navUserDropdown = document.getElementById("navUserDropdown");
const logoutBtn = document.getElementById("logoutBtn");

onAuthChange(async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    currentCoachId = user.uid;
    let name = user.displayName || localStorage.getItem("tt_username");
    let profilePic = null;

    // Update Navbar immediately
    updateNavbar(user, null);

    try {
        const data = await getCoachProfile(currentCoachId);
        if (data && data.exists) {
            coachFavorites = data.favorites || [];
            name = data.username || data.fullName.split(" ")[0] || name;
            profilePic = data.profilePic || null;
            if (name) localStorage.setItem("tt_username", name);

            updateNavbar(user, data);
        } else {
            updateNavbar(user, null);
        }
    } catch (e) {
        console.error("Error fetching coach data", e);
    }

    if (!name) name = user.email.split("@")[0];

    // Manual navbar update removed, handled by updateNavbar above

    await fetchAthletes();
});

async function fetchAthletes() {
    try {
        const athletes = await getAllAthletes();
        // Filter those with names
        allAthletes = athletes.filter(a => a.username || (a.personal && a.personal.fullName));
        filteredAthletes = [...allAthletes];
        renderAthletes();
    } catch (err) {
        console.error("Error fetching athletes", err);
        if (grid) grid.innerHTML = `<p class="col-span-full text-center text-red-600 font-bold">Failed to load athletes.</p>`;
    }
}

function renderAthletes() {
    if (!grid) return;
    grid.innerHTML = "";
    if (filteredAthletes.length === 0) {
        if (noResults) noResults.classList.remove("hidden");
        return;
    }
    if (noResults) noResults.classList.add("hidden");

    filteredAthletes.forEach(athlete => {
        const isFavorited = coachFavorites.includes(athlete.id);
        const displayName = athlete.personal?.fullName || athlete.username || "Athlete " + athlete.id;
        const city = athlete.personal?.city || "Not Specified";
        const category = athlete.athletic?.category || "TBD";
        let profilePic = athlete.documents?.profilePic || "https://via.placeholder.com/150?text=No+Photo";

        // Fix relative paths
        if (profilePic && profilePic.startsWith('/')) {
            profilePic = BACKEND_URL + profilePic;
        }

        const events = athlete.athletic?.events || [];
        const mainSport = events.length > 0 ? events[0].event : "No Events";
        const isComplete = true; // Assuming SQL user is complete if listed

        const statusHTML = isComplete
            ? `<div class="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">Verified Profile</div>`
            : `<div class="absolute top-4 left-4 bg-amber-500/90 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">Pending</div>`;

        const card = document.createElement("div");
        card.className = "athlete-card bg-white rounded-[2rem] overflow-hidden shadow-sm border border-blue-50 flex flex-col hover:border-[var(--secondary)] relative";

        card.innerHTML = `
            <div class="relative h-48 overflow-hidden">
                <img src="${profilePic}" class="w-full h-full object-cover" alt="${displayName}">
                ${statusHTML}
                
                <button onclick="toggleFavorite('${athlete.id}')" class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:scale-110 transition-all">
                    <svg class="w-5 h-5 ${isFavorited ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-slate-400'}" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-[var(--primary)] shadow-sm">
                    ${category}
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-[var(--primary)] mb-1 truncate">${displayName}</h3>
                    <p class="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        ${city}
                    </p>
                </div>
                
                <div class="grid grid-cols-2 gap-2 mb-6">
                    <div class="bg-blue-50 p-3 rounded-2xl">
                        <p class="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1">Main Event</p>
                        <p class="text-sm font-bold text-blue-900">${mainSport}</p>
                    </div>
                </div>
 
                <a href="view-athlete.html?id=${athlete.id}" class="mt-auto w-full py-3 rounded-xl bg-slate-900 text-white text-center text-sm font-bold hover:bg-[var(--primary)] transition-all">
                    View Dashboard
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.toggleFavorite = async function (athleteId) {
    if (!currentCoachId) return;
    try {
        if (coachFavorites.includes(athleteId)) {
            await removeFavorite(currentCoachId, athleteId);
            coachFavorites = coachFavorites.filter(id => id !== athleteId);
        } else {
            await addFavorite(currentCoachId, athleteId);
            coachFavorites.push(athleteId);
        }
        renderAthletes(); // Re-render to update heart icon immediately
    } catch (err) {
        console.error("Fav error", err);
    }
}

function applyFilters() {
    const term = searchInput.value.toLowerCase();
    const sport = sportFilter.value;
    const cat = categoryFilter.value;
    const favs = favoritesToggle.checked;

    filteredAthletes = allAthletes.filter(a => {
        const name = (a.personal?.fullName || "").toLowerCase();
        const city = (a.personal?.city || "").toLowerCase();
        const matchesTerm = name.includes(term) || city.includes(term);

        const events = a.athletic?.events || [];
        const matchesSport = sport === "all" || events.some(e => e.event === sport);

        const matchesCat = cat === "all" || (a.athletic?.category === cat);
        const matchesFav = !favs || coachFavorites.includes(a.id);

        return matchesTerm && matchesSport && matchesCat && matchesFav;
    });
    renderAthletes();
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (sportFilter) sportFilter.addEventListener("change", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
if (favoritesToggle) favoritesToggle.addEventListener("change", applyFilters);

if (navUserBtn) {
    navUserBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navUserDropdown.classList.toggle('hidden');
    });
}
window.addEventListener('click', () => { if (navUserDropdown) navUserDropdown.classList.add('hidden'); });

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut();
            localStorage.removeItem("tt_username");
            localStorage.removeItem("tt_role");
            window.location.href = "index.html";
        } catch (error) { console.error("Logout Error", error); }
    });
}
