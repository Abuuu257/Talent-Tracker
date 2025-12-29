import {
    auth,
    onAuthChange,
    getAthleteProfile,
    getCoachProfile,
    addFavorite,
    removeFavorite,
    BACKEND_URL
} from "./register.js";
import { updateNavbar } from "./ui-utils.js";

// DOM Elements
const athleteName = document.getElementById("athleteName");
const athleteCategory = document.getElementById("athleteCategory");
const athletePic = document.getElementById("athletePic");
const athleteHeight = document.getElementById("athleteHeight");
const athleteWeight = document.getElementById("athleteWeight");
const athleteBMI = document.getElementById("athleteBMI");
const athleteEmail = document.getElementById("athleteEmail");
const athleteClub = document.getElementById("athleteClub");
const eventsList = document.getElementById("eventsList");
const btnIdDoc = document.getElementById("btnIdDoc");
const btnConsentDoc = document.getElementById("btnConsentDoc");
const contactBtn = document.getElementById("contactAthleteBtn");

let currentCoachId = null;
let isFavorited = false;
let athleteId = null;

// URL Param
const urlParams = new URLSearchParams(window.location.search);
athleteId = urlParams.get('id');

if (!athleteId) {
    window.location.href = "coach-home.html";
}

// Auth
onAuthChange(async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    const role = localStorage.getItem("tt_role");

    // Allow both 'coach' and 'federation' (admin) to view this page
    if (role !== "coach" && role !== "federation") {
        alert("Access Denied");
        window.location.href = "index.html";
        return;
    }

    // Adjust UI based on role
    const returnLink = document.getElementById("returnLink");
    const returnText = document.getElementById("returnText");
    if (role === 'federation') {
        if (returnLink) returnLink.href = "federation-home.html";
        if (returnText) returnText.textContent = "Back to Admin";
    } else {
        if (returnLink) returnLink.href = "coach-athletes.html";
        if (returnText) returnText.textContent = "Return to Scouts";
    }

    currentCoachId = user.uid;

    // Update Navbar immediately
    updateNavbar(user, null);

    // Fetch Coach Profile for Navbar and Favorites (Only if Coach)
    if (role === 'coach') {
        try {
            const coach = await getCoachProfile(currentCoachId);
            updateNavbar(user, coach);

            if (coach && coach.favorites) {
                isFavorited = coach.favorites.includes(athleteId);
                updateFavoriteUI();
            }
        } catch (e) {
            console.error("Error fetching coach profile", e);
        }
    } else {
        // Admin View - Simple Navbar
        updateNavbar(user, { username: "Admin" });
        // Hide Favorite/Contact buttons for Admin?
        // Maybe hide them to keep it clean, or allow admin to see them but disabled?
        const interestBtn = document.getElementById("interestBtnQuick");
        if (interestBtn) interestBtn.classList.add("hidden");
    }

    loadAthleteData();
});

// ... (keep helper functions)

async function loadAthleteData() {
    try {
        const data = await getAthleteProfile(athleteId);

        if (data && data.exists) {
            // ... (keep existing mappings)
            const p = data.personal || {};
            athleteName.textContent = p.fullName || data.username || "Candidate Profile";
            athleteEmail.textContent = p.email || "Confidential";

            // WhatsApp logic ...
            const phone = p.phone;
            if (phone) {
                const cleanPhone = phone.replace(/\D/g, '');
                const coachName = localStorage.getItem("tt_username") || "Coach";
                const msg = encodeURIComponent(`Hello ${p.fullName}, I am Coach ${coachName}. I saw your profile on Talent Tracker.`);
                contactBtn.href = `https://wa.me/${cleanPhone}?text=${msg}`;
                contactBtn.target = "_blank";
            } else {
                contactBtn.href = `mailto:${p.email || ''}`;
            }

            // Phys ...
            const m = data.medicalPhysical || {};
            athleteHeight.textContent = m.height ? `${m.height} cm` : "-- cm";
            athleteWeight.textContent = m.weight ? `${m.weight} kg` : "-- kg";
            if (m.height && m.weight) {
                const h = m.height / 100;
                const bmi = (m.weight / (h * h)).toFixed(1);
                athleteBMI.textContent = bmi;
            } else {
                athleteBMI.textContent = "--";
            }

            // Category ...
            const a = data.athletic || {};
            athleteCategory.textContent = `${a.category || 'TBD'} CATEGORY`;
            const l = data.playingLevel || {};
            athleteClub.textContent = l.club || l.school || "Freelance";

            // Docs
            const d = data.documents || {};
            let picUrl = d.profilePic || "https://via.placeholder.com/300?text=No+Photo";
            if (picUrl.startsWith('/')) picUrl = BACKEND_URL + picUrl; // FIX RELATIVE PATH
            athletePic.src = picUrl;

            if (d.idDoc) {
                btnIdDoc.href = d.idDoc;
                btnIdDoc.classList.remove("hidden");
            } else {
                btnIdDoc.classList.add("hidden");
            }
            if (d.consentDoc) {
                btnConsentDoc.href = d.consentDoc;
                btnConsentDoc.classList.remove("hidden");
            } else {
                btnConsentDoc.classList.add("hidden");
            }

            // Events
            renderEvents(a.events || []);

        } else {
            alert("Athlete not found");
            window.location.href = "coach-home.html";
        }
    } catch (err) {
        console.error("Error loading athlete", err);
    }
}

function renderEvents(events) {
    if (!eventsList) return;
    eventsList.innerHTML = "";
    if (events.length === 0) {
        eventsList.innerHTML = `
            <div class="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                <p class="text-slate-400 font-bold text-sm">No verified track records found.</p>
            </div>
        `;
        return;
    }

    events.forEach(evt => {
        const card = document.createElement("div");
        card.className = "flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group";
        card.innerHTML = `
            <div class="flex items-center gap-6 mb-4 sm:mb-0">
                <div class="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[var(--primary)] font-black shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-colors uppercase">
                    ${evt.event.replace('m', '')}
                </div>
                <div>
                    <h4 class="text-lg font-black text-slate-800 uppercase">${evt.event} Sprint</h4>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Best</p>
                </div>
            </div>
            <div class="text-center sm:text-right">
                <p class="text-3xl font-black text-[var(--secondary)]">${evt.pb}<span class="text-sm ml-1 text-slate-400">s</span></p>
                <div class="flex items-center gap-2 justify-center sm:justify-end mt-1">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Result</span>
                </div>
            </div>
        `;
        eventsList.appendChild(card);
    });
}
