// Handle profile button click
function handleProfileClick() {
    console.log('Profile clicked - Ready to redirect to profile panel');
    // TODO: Redirect to profile panel once it's ready
    // window.location.href = 'profile.html';
    alert('Profile panel coming soon!');
}

// Handle back button click
function handleBackClick() {
    console.log('Back button clicked');
    // You can modify this based on your app's navigation structure
    window.history.back();
}

// Handle service card clicks
function handleServiceClick(service) {
    console.log(`${service} service clicked`);
    
    const serviceMap = {
        'counseling': 'counseling.html',
        'events': 'event.html',
        'clubs': 'clubs.html',
        'ojt': 'ojt.html'
    };

    // Redirect to the service page
    window.location.href = serviceMap[service];
}

// Navigation function for sidebar
function navigateTo(page) {
    console.log(`Navigating to ${page}`);
    
    // Map pages to their actual file paths
    const pageMap = {
        'counseling.html': 'counseling.html',
        // Some places may reference events.html or event.html; normalize both to the single file name
        'events.html': 'event.html',
        'event.html': 'event.html',
        'clubs.html': 'clubs.html',
        'ojt.html': 'ojt.html',
        'index.html': 'index.html'
    };

    // Prevent default link behavior and navigate
    if (pageMap[page]) {
        window.location.href = pageMap[page];
    }
}

/* ============================================
   COUNSELING MODAL HELPERS
   Adds open/close functions for the Learn More modal on counseling.html
   Handles: opening, closing, overlay click (markup already uses inline onclick),
   Escape key to close, and restoring focus to the previously focused element.
   ============================================ */

function handleModalKeydown(e) {
    // Close on Escape
    if (e.key === 'Escape' || e.key === 'Esc') {
        // Close any open modal (learnMoreModal, requestFormModal, etc.)
        const openModals = document.querySelectorAll('.modal[aria-hidden="false"]');
        openModals.forEach(modal => {
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('open');
        });

        // restore focus if possible
        try {
            if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
                window._previousActiveElement.focus();
            }
        } catch (err) {
            // ignore
        }
    }
}

/* Request Form modal helpers */
function openRequestFormModal() {
    const modal = document.getElementById('requestFormModal');
    if (!modal) return;

    window._previousActiveElement = document.activeElement;

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
}

function closeRequestFormModal() {
    const modal = document.getElementById('requestFormModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore focus restore errors
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function handleRequestFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Basic HTML5 validation will already run; ensure required fields are filled.
    if (!form.checkValidity()) {
        // show native validation UI
        form.reportValidity();
        return;
    }

    // Collect form data (could be sent via fetch to backend)
    const data = new FormData(form);
    const payload = {};
    data.forEach((v, k) => payload[k] = v);
    console.log('Request form submitted', payload);

    // Create a session record and persist to localStorage
    const session = createSessionRecord(payload);
    const sessions = getSessionsFromStorage();
    sessions.unshift(session); // newest first
    saveSessionsToStorage(sessions);

    // Show success UI and close modal
    alert('Request submitted. The Counseling Unit will contact you shortly.');
    form.reset();
    closeRequestFormModal();
    // update counts if sessions modal is open
    renderSessions();
}

/* Session storage and rendering helpers */
function getSessionsFromStorage() {
    try {
        const raw = localStorage.getItem('counseling_sessions');
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error('Failed to read sessions from storage', err);
        return [];
    }
}

function saveSessionsToStorage(sessions) {
    try {
        localStorage.setItem('counseling_sessions', JSON.stringify(sessions));
    } catch (err) {
        console.error('Failed to save sessions to storage', err);
    }
}

function generateCaseId() {
    const now = new Date();
    const year = now.getFullYear();
    const sessions = getSessionsFromStorage();
    // Count existing this-year sessions to make a sequence
    const seq = sessions.filter(s => (new Date(s.submittedAt)).getFullYear() === year).length + 1;
    return `C${year}-${String(seq).padStart(3, '0')}`;
}

function createSessionRecord(payload) {
    const now = new Date();
    return {
        id: generateCaseId(),
        submittedAt: now.toISOString(),
        status: 'Pending', // Pending | Scheduled | Completed | Cancelled
        studentId: payload.studentId || '',
        fullName: payload.fullName || '',
        phone: payload.phone || '',
        email: payload.email || '',
        refName: payload.refName || '',
        relationship: payload.relationship || '',
        refPhone: payload.refPhone || '',
        refEmail: payload.refEmail || ''
    };
}

function openSessionsModal() {
    const modal = document.getElementById('sessionsModal');
    if (!modal) return;

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    renderSessions();

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
    document.addEventListener('keydown', handleModalKeydown);
}

function closeSessionsModal() {
    const modal = document.getElementById('sessionsModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {}
    document.removeEventListener('keydown', handleModalKeydown);
}

function switchSessionTab(tab) {
    document.querySelectorAll('#sessionsModal .tab-btn').forEach(b => b.classList.remove('active'));
    if (tab === 'pending') document.getElementById('tabPending').classList.add('active');
    if (tab === 'scheduled') document.getElementById('tabScheduled').classList.add('active');
    if (tab === 'completed') document.getElementById('tabCompleted').classList.add('active');
    renderSessions(tab);
}

function renderSessions(filterTab) {
    const listEl = document.getElementById('sessionsList');
    if (!listEl) return;
    const sessions = getSessionsFromStorage();

    // counts
    const counts = { Pending: 0, Scheduled: 0, Completed: 0 };
    sessions.forEach(s => {
        if (s.status === 'Pending') counts.Pending++;
        if (s.status === 'Scheduled') counts.Scheduled++;
        if (s.status === 'Completed') counts.Completed++;
    });
    document.getElementById('countPending').textContent = counts.Pending ? counts.Pending : '';
    document.getElementById('countScheduled').textContent = counts.Scheduled ? counts.Scheduled : '';
    document.getElementById('countCompleted').textContent = counts.Completed ? counts.Completed : '';

    // determine active tab if not provided
    let active = filterTab || 'pending';
    const activeBtn = document.querySelector('#sessionsModal .tab-btn.active');
    if (activeBtn && activeBtn.id === 'tabScheduled') active = 'scheduled';
    if (activeBtn && activeBtn.id === 'tabCompleted') active = 'completed';

    // filter sessions by tab
    let filtered = sessions.filter(s => {
        if (active === 'pending') return s.status === 'Pending';
        if (active === 'scheduled') return s.status === 'Scheduled';
        if (active === 'completed') return s.status === 'Completed';
        return true;
    });

    // simple search filter
    const search = document.getElementById('sessionsSearch');
    const q = search ? search.value.trim().toLowerCase() : '';
    if (q) {
        filtered = filtered.filter(s => (s.id + ' ' + s.fullName + ' ' + s.email + ' ' + s.studentId).toLowerCase().includes(q));
    }

    // render
    listEl.innerHTML = '';
    if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.textContent = 'No sessions found.';
        empty.style.color = '#666';
        listEl.appendChild(empty);
        return;
    }

    filtered.forEach(s => {
        const card = document.createElement('div');
        card.style.border = '1px solid #e8e8e8';
        card.style.borderRadius = '8px';
        card.style.padding = '14px';
        card.style.background = '#fff';
        card.style.cursor = 'pointer';
        card.onclick = function() { openSessionDetails(s.id); };

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const left = document.createElement('div');
        const idEl = document.createElement('div');
        idEl.style.fontWeight = '700';
        idEl.textContent = s.id;
        const dateEl = document.createElement('div');
        const d = new Date(s.submittedAt);
        dateEl.style.fontSize = '12px';
        dateEl.style.color = '#999';
        dateEl.textContent = `Submitted on ${d.toLocaleDateString()}`;
        left.appendChild(idEl);
        left.appendChild(dateEl);

        const right = document.createElement('div');
        const status = document.createElement('span');
        status.textContent = s.status;
        status.style.background = s.status === 'Pending' ? '#fff3cd' : (s.status === 'Scheduled' ? '#d1ecf1' : '#d4edda');
        status.style.color = '#333';
        status.style.padding = '6px 10px';
        status.style.borderRadius = '14px';
        status.style.fontSize = '13px';
        right.appendChild(status);

        header.appendChild(left);
        header.appendChild(right);

        const body = document.createElement('div');
        body.style.display = 'grid';
        body.style.gridTemplateColumns = '1fr 220px';
        body.style.gap = '12px';
        body.style.marginTop = '12px';

        const infoLeft = document.createElement('div');
        infoLeft.innerHTML = `<div style="font-size:13px;color:#666">Name:</div><div style="font-weight:600;color:#222">${s.fullName}</div>
            <div style="font-size:13px;color:#666;margin-top:8px">Email Address:</div><div style="color:#222">${s.email}</div>
            <div style="font-size:13px;color:#666;margin-top:8px">Assigned Counselor:</div><div style="color:#222">N/A</div>`;

        const infoRight = document.createElement('div');
        infoRight.style.display = 'flex';
        infoRight.style.flexDirection = 'column';
        infoRight.style.justifyContent = 'space-between';
        infoRight.innerHTML = `<div style="font-size:13px;color:#666">${s.status === 'Pending' ? 'Not Scheduled' : 'Scheduled'}</div>`;

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'flex-end';
        actions.style.marginTop = '12px';

        if (s.status === 'Pending') {
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.background = '#2c3e7f';
            cancelBtn.style.color = '#fff';
            cancelBtn.style.border = '0';
            cancelBtn.style.padding = '8px 12px';
            cancelBtn.style.borderRadius = '6px';
            // prevent card click when pressing cancel
            cancelBtn.onclick = function(e) { e.stopPropagation(); cancelSession(s.id); };
            actions.appendChild(cancelBtn);
        }

        body.appendChild(infoLeft);
        body.appendChild(infoRight);

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(actions);

        listEl.appendChild(card);
    });
}

function cancelSession(sessionId) {
    const sessions = getSessionsFromStorage();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;
    sessions[idx].status = 'Cancelled';
    saveSessionsToStorage(sessions);
    // Auto-route to show remaining pending sessions
    renderSessions('pending');
}

/* Helper function to change session status (for demo/admin use) */
function updateSessionStatus(sessionId, newStatus) {
    const sessions = getSessionsFromStorage();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;
    sessions[idx].status = newStatus;
    saveSessionsToStorage(sessions);
    // Auto-route session to appropriate tab
    autoRouteSessionTab(newStatus);
}

function openSessionDetails(sessionId) {
    const sessions = getSessionsFromStorage();
    const s = sessions.find(x => x.id === sessionId);
    if (!s) return;

    // hide list, show details container
    const listContainer = document.getElementById('sessionsListContainer');
    const detailsContainer = document.getElementById('sessionDetailsContainer');
    if (listContainer && detailsContainer) {
        listContainer.style.display = 'none';
        detailsContainer.style.display = 'block';
    }

    const detailsEl = document.getElementById('sessionDetails');
    if (!detailsEl) return;

    // assigned counselor and next session are placeholders (could be extended later)
    const nextSessionHtml = s.nextSession ? `<div style="background:#f2f6ff;border-radius:8px;padding:12px;margin-top:10px;border:1px solid #e6eefb;"><div style="font-weight:700;color:#2c3e7f;">Next Scheduled Session</div><div style="font-size:13px;color:#666;margin-top:6px">${new Date(s.nextSession).toLocaleString()}</div></div>` : '';

    detailsEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
                <div style="font-weight:700;font-size:18px">${s.id}</div>
                <div style="color:#666;font-size:13px;margin-top:4px">Student ID: ${s.studentId || '-'}</div>
            </div>
            <div style="text-align:right;">
                <div style="display:inline-block;background:#fff3cd;padding:6px 10px;border-radius:14px;font-size:13px;color:#333">${s.status}</div>
            </div>
        </div>
        <hr style="margin:12px 0;border:none;border-top:1px solid #eee;" />
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
                <div style="font-size:13px;color:#666">Student Name</div>
                <div style="font-weight:700;color:#222;margin-top:6px">${s.fullName}</div>
                <div style="font-size:13px;color:#666;margin-top:12px">Contact Information</div>
                <div style="margin-top:6px;color:#222">${s.email}</div>
                <div style="color:#222">${s.phone}</div>
            </div>
            <div>
                <div style="font-size:13px;color:#666">Assigned Counselor</div>
                <div style="font-weight:700;color:#222;margin-top:6px">${s.assignedCounselor || 'Dr. John Cruz'}</div>
                ${nextSessionHtml}
            </div>
        </div>

        <div style="margin-top:18px;border-top:1px solid #f0f0f0;padding-top:12px;">
            <div style="font-size:13px;color:#666">Reference Contact</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">
                <div>
                    <div style="font-size:13px;color:#666">Full Name</div>
                    <div style="color:#222;font-weight:600;margin-top:6px">${s.refName}</div>
                    <div style="font-size:13px;color:#666;margin-top:8px">Phone Number</div>
                    <div style="color:#222">${s.refPhone}</div>
                </div>
                <div>
                    <div style="font-size:13px;color:#666">Relationship</div>
                    <div style="color:#222;font-weight:600;margin-top:6px">${s.relationship}</div>
                    <div style="font-size:13px;color:#666;margin-top:8px">Email Address</div>
                    <div style="color:#222">${s.refEmail}</div>
                </div>
            </div>
        </div>
    `;

    // wire cancel button in details (replace any prior handler)
    const detailsCancelBtn = document.getElementById('detailsCancelBtn');
    if (detailsCancelBtn) {
        detailsCancelBtn.onclick = function() { cancelSession(sessionId); backToSessionsList(); };
    }
}

function backToSessionsList() {
    const listContainer = document.getElementById('sessionsListContainer');
    const detailsContainer = document.getElementById('sessionDetailsContainer');
    if (listContainer && detailsContainer) {
        detailsContainer.style.display = 'none';
        listContainer.style.display = 'block';
    }
    renderSessions();
}

/* Helper to auto-route session to correct tab based on status */
function autoRouteSessionTab(status) {
    let targetTab = 'pending';
    if (status === 'Scheduled') targetTab = 'scheduled';
    if (status === 'Completed') targetTab = 'completed';
    
    // Switch to the correct tab
    switchSessionTab(targetTab);
}


function openLearnMoreModal() {
    const modal = document.getElementById('learnMoreModal');
    if (!modal) return;

    // remember previously focused element to restore focus when closing
    window._previousActiveElement = document.activeElement;

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    // focus the first focusable element inside the modal (close button if present)
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
}

function closeLearnMoreModal() {
    const modal = document.getElementById('learnMoreModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    // restore focus to the element that triggered the modal (if we saved one)
    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore focus restore errors
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

// Set active nav item based on current page
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href') || item.onclick.toString();
        item.classList.remove('active');
        
        if (href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation
    setActiveNav();
    
    // Initialize announcements
    initializeAnnouncements();
    
    // Add click handlers to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.card-title').textContent;
            console.log(`${title} card clicked`);
            // TODO: Add functionality for each card
        });
    });

    // Hook up request form submission if present
    const reqForm = document.getElementById('requestForm');
    if (reqForm) {
        reqForm.addEventListener('submit', handleRequestFormSubmit);
        
        // Add input validation listeners
        document.getElementById('studentId').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9\-]/g, '');
        });
        
        document.getElementById('fullName').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
        
        document.getElementById('phone').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9\s\-\+]/g, '');
        });
        
        document.getElementById('refName').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
        
        document.getElementById('relationship').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
        
        document.getElementById('refPhone').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9\s\-\+]/g, '');
        });
        
        // Email is already type="email", so browser handles validation
    }

    // Hook up sessions search (if modal present)
    const sessionsSearch = document.getElementById('sessionsSearch');
    if (sessionsSearch) {
        sessionsSearch.addEventListener('input', function() {
            // simple immediate filtering
            renderSessions();
        });
    }

    console.log('Page loaded successfully');
});
/* ============================================
   EVENT PAGE FUNCTIONS (DYNAMIC VERSION)
   ============================================ */

// This will hold our data from the database
let allEventsData = [];
let currentEventId = null; // Used for the modal

// --- Helper function to get data ---
function getEventById_DYNAMIC(id) {
    // We search our global array, using the MongoDB _id
    return allEventsData.find(e => e._id === id);
}

// --- Main function to fetch and render everything ---
async function fetchAndInitializeEvents() {
    try {
        const response = await fetch('http://localhost:3001/api/events');
        if (!response.ok) { throw new Error('Network error'); }

        allEventsData = await response.json(); 

        if (allEventsData.length > 0) {
            renderUpcomingEvents(allEventsData);
            renderFeaturedEvent(allEventsData[0]);

            // --- THIS IS THE INTEGRATION ---
            renderCalendar(allEventsData); 
            // -------------------------------

        } else {
            renderUpcomingEvents([]);
            renderCalendar([]); // Also integrates an "empty" list
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// --- Renderer for the "Upcoming Events" list ---
function renderUpcomingEvents(events) {
    const upcomingList = document.getElementById('upcoming');
    if (!upcomingList) return; 

    upcomingList.innerHTML = ''; // Clear the list

    events.forEach(event => {
        const eventDate = new Date(event.date);
        const dateString = eventDate.toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' 
        });
        const category = event.category || 'academic';

        const eventCard = document.createElement('div');
        eventCard.className = `event-list-item ${category}`;
        eventCard.setAttribute('role', 'button');
        eventCard.setAttribute('tabindex', '0');

        eventCard.innerHTML = `
            <div class="event-color-indicator ${category}"></div>
            <div class="event-item-content">
                <h4 class="event-item-title">${event.title}</h4>
                <p class="event-item-date">${dateString}</p>
                <p class="event-item-time">${event.time} · ${event.location}</p>
            </div>
            <button class="save-event-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 2v16l8-5 8 5V2H4z"/>
                </svg>
            </button>
        `;

        eventCard.addEventListener('click', () => openEventDetail_DYNAMIC(event._id));
        eventCard.querySelector('.save-event-btn').addEventListener('click', (e) => {
            e.stopPropagation(); 
            console.log("Save event clicked:", event._id);
        });

        upcomingList.appendChild(eventCard);
    });
}

// --- Renderer for the "Featured Event" banner ---
function renderFeaturedEvent(event) {
    const featuredTitle = document.querySelector('.featured-title');
    const featuredDetails = document.querySelector('.featured-details');
    if (!featuredTitle || !featuredDetails) return;

    const eventDate = new Date(event.date);
    const dateString = eventDate.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });

    featuredTitle.textContent = event.title;
    featuredDetails.textContent = `${dateString} · ${event.location}`;

    const viewDetailsBtn = document.querySelector('.view-details-btn');
    if (viewDetailsBtn) {
        viewDetailsBtn.onclick = () => openEventDetail_DYNAMIC(event._id);
    }
}

// --- This is the new "Calendar Brain" function ---
function renderCalendar(events) {
    const calendarDays = document.querySelector('.calendar-days');
    const calendarTitle = document.querySelector('.calendar-title');

    if (!calendarDays || !calendarTitle) return; 

    // For this demo, we'll force it to show SEPTEMBER 2025 to match your data
    const month = 8; // 0=Jan, 8=Sep
    const year = 2025;
    const today = new Date(); // We still need today's date

    calendarTitle.textContent = "September 2025"; // Hard-code title for now

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create a "lookup" for our event days
    const eventDays = new Map();
    for (const event of events) {
        const eventDate = new Date(event.date);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
            const day = eventDate.getDate();
            eventDays.set(day, event._id); 
        }
    }

    calendarDays.innerHTML = ''; // Clear the div

    // Create the "empty" filler days
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < startOffset; i++) {
        calendarDays.innerHTML += `<div class="calendar-day empty"></div>`;
    }

    // Create the "real" days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;

        // Make "4" active just like your static design
        if (day === 4) { 
            dayCell.classList.add('active');
        }

        // --- THIS IS THE "SHADING" LOGIC ---
        if (eventDays.has(day)) {
            dayCell.classList.add('has-event'); // Your blue shaded style
            dayCell.setAttribute('role', 'button');
            dayCell.style.cursor = 'pointer';
            const eventId = eventDays.get(day);
            dayCell.addEventListener('click', () => openEventDetail(eventId));
        }

        calendarDays.appendChild(dayCell);
    }
}

// --- This replaces your OLD openEventDetail function ---
function openEventDetail_DYNAMIC(eventId) {
    const event = getEventById_DYNAMIC(eventId); 
    if (!event) return;

    currentEventId = eventId; 
    const container = document.getElementById('eventDetailContent');
    if (!container) return;

    const eventDate = new Date(event.date);
    const dateString = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // This HTML is pulled from your photos and script.js
    container.innerHTML = `
        <div style="margin-bottom:30px;">
            <div style="background: url('${event.imageUrl}') no-repeat center center; background-size: cover; height:300px;border-radius:8px;margin-bottom:20px;"></div>
            <h2 style="color:#2c3e7f;margin-bottom:8px;" id="eventDetailTitle">${event.title}</h2>
            <p style="color:#666;margin-bottom:16px;">Organized by ${event.organizer}</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;padding:20px;background:#f9f9f9;border-radius:8px;">
            <div><div style="font-weight:600;color:#2c3e7f;">Date</div><div style="color:#666;font-size:14px;">${dateString}</div></div>
            <div><div style="font-weight:600;color:#2c3e7f;">Time</div><div style="color:#666;font-size:14px;">${event.time}</div></div>
            <div><div style="font-weight:600;color:#2c3e7f;">Location</div><div style="color:#666;font-size:14px;">${event.location}</div></div>
            <div><div style="font-weight:600;color:#2c3e7f;">Availability</div><div style="color:#666;font-size:14px;">${event.availability || 'N/A'}</div></div>
        </div>

        <h3 style="color:#2c3e7f;margin-bottom:12px;margin-top:24px;">About this Event</h3>
        <p style="color:#666;line-height:1.6;margin-bottom:24px;">${event.description}</p>

        <h3 style="color:#2c3e7f;margin-bottom:12px;margin-top:24px;">Event Agenda</h3>
        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
            ${event.agenda.map((item, idx) => `
                <div style="display:flex;gap:12px;margin-bottom:12px;">
                    <div style="background:#2c3e7f;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align:center;justify-content:center;flex-shrink:0;font-weight:600;">${idx + 1}</div>
                    <div><div style="font-weight:600;color:#2c3e7f;">${item.time}</div><div style="color:#666;font-size:14px;">${item.title}</div></div>
                </div>
            `).join('')}
        </div>

        <h3 style="color:#2c3e7f;margin-bottom:12px;margin-top:24px;">What to Expect?</h3>
        <ul style="list-style:none;padding:0;margin:0;margin-bottom:24px;">
            ${event.expectations.map(exp => `
                <li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2c3e7f" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><path d="M3 10l4 4 10-10"/></svg>
                    <span style="color:#666;">${exp}</span>
                </li>
            `).join('')}
        </ul>

        <h3 style="color:#2c3e7f;margin-bottom:12px;margin-top:24px;">Requirements</h3>
        <p style="color:#666;line-height:1.6;background:#e8f0ff;padding:12px;border-radius:6px;border-left:4px solid #2c3e7f;">
            <strong>⚠️</strong> ${event.requirements}
        </p>

        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:30px;">
            <button type="button" class.="learn-more-btn" style="background:#fff;color:#333;border:1px solid #e8e8e8;padding:12px 20px;border-radius:6px;" onclick="closeEventDetailModal()">Back to Calendar</button>
            <button type="button" class="learn-more-btn" style="background:#2c3e7f;color:#fff;padding:12px 20px;border-radius:6px;border:0;cursor:pointer;" onclick="openRegistrationModal('${event._id}', '${event.title}')">Register Now</button>
        </div>
    `;

    const modal = document.getElementById('eventDetailModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
}

// --- This replaces your OLD confirmRegistration function ---
async function confirmRegistration() {
    const modal = document.getElementById('registrationModal');
    const eventId = modal.dataset.eventId;
    const event = getEventById_DYNAMIC(eventId);

    if (!event) return;

    try {
        const response = await fetch('http://localhost:3001/api/registrations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: event._id,
                eventTitle: event.title,
                studentId: "student-123" // Placeholder
            })
        });

        if (!response.ok) { throw new Error('Server error'); }

        alert('Registration successful! Your registration has been confirmed.');
        closeRegistrationModal();
        closeEventDetailModal();

    } catch (error) {
        console.error('Error submitting registration:', error);
        alert('There was a problem registering for this event.');
    }
}

// --- We still need your other functions ---
// (We just rename the ones we replaced to avoid conflicts)
function openEventDetail_OLD(eventId) { console.log("Old function called"); }
function confirmRegistration_OLD() { console.log("Old function called"); }
// (Your `switchTab`, `previousMonth`, `nextMonth`, etc. are all fine!)

// end of EVENTS PAGE FUNCTIONS


/* ============================================
   CLUBS PAGE FUNCTIONS (DYNAMIC VERSION)
   Handles club filtering, searching, sorting, and applications
   ============================================ */

// --- MODIFIED ---
// This was a hard-coded array. Now, it's our "global state"
// that will be filled by the backend.
let allClubsData = [];
let filteredClubs = [];

// Your other global variables are perfect
let currentClubId = null;
let currentSortBy = 'newest';
let currentCategory = 'All';

// --- (This function is unchanged, it's perfect) ---
function getClubById(id) {
    // Note: We use allClubsData to find the club, even if it's filtered out
    return allClubsData.find(c => c._id === id); // Use _id from MongoDB
}

// --- NEW HELPER FUNCTION ---
// This function builds the HTML for all the club cards.
// It's the "renderer".
function renderClubs() {
    const clubsGrid = document.getElementById('clubsGrid');
    clubsGrid.innerHTML = ''; // Clear the grid

    if (filteredClubs.length === 0) {
        clubsGrid.innerHTML = '<p>No clubs found matching your criteria.</p>';
        document.getElementById('clubsCount').textContent = '0 clubs found';
        return;
    }

    filteredClubs.forEach(club => {
        const card = document.createElement('div');
        card.className = 'club-card';
        card.setAttribute('data-club-id', club._id); // Use MongoDB _id
        card.setAttribute('data-club-category', club.category);

        // We are just building the *exact* same HTML you had before
        card.innerHTML = `
            <div class="club-header">
                <h2 class="club-name">${club.name}</h2>
                <span class="club-category-badge">${club.category}</span>
            </div>
            <p class="club-description">${club.description}</p>
            
            <div class="club-info">
                <div class="club-info-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2c3e7f" stroke-width="1.5"><rect x="2" y="2" width="16" height="16" rx="2"/><path d="M2 7h16"/><path d="M5 2v3"/><path d="M15 2v3"/></svg>
                    <span>${club.location || 'N/A'}</span>
                </div>
                <div class="club-info-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2c3e7f" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 2"/></svg>
                    <span>${club.meetingTime || 'TBD'}</span>
                </div>
            </div>

            <div class="club-stats">
                <div class="club-stat">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#ff6b9d" stroke="#ff6b9d" stroke-width="1.5"><circle cx="7" cy="5" r="2.5"/><path d="M2 10c0-1.5 1.5-2.5 3.5-2.5s3.5 1 3.5 2.5v4c0 1 .5 1.5 1.5 1.5"/><circle cx="13" cy="5" r="2.5"/><path d="M8 10c0-1.5 1.5-2.5 3.5-2.5s3.5 1 3.5 2.5v4c0 1 .5 1.5 1.5 1.5"/></svg>
                    <span>${club.members} members</span>
                </div>
                <div class="club-stat">
                    <span>${club.applicants} applicants</span>
                </div>
            </div>

            <button class="view-club-btn">View Club Info</button>
        `;
        
        // Add the click event listener to the button
        card.querySelector('.view-club-btn').addEventListener('click', () => openClubInfoModal(club._id));

        clubsGrid.appendChild(card);
    });

    // Update the count
    document.getElementById('clubsCount').textContent = filteredClubs.length + ' clubs found';
}

// --- MODIFIED ---
// This function is now perfect. It uses the `getClubById` which
// pulls from our new dynamic `allClubsData`. No changes needed
// except to handle the MongoDB `_id` and new fields.
function openClubInfoModal(clubId) {
    currentClubId = clubId;
    const club = getClubById(clubId);
    if (!club) return;

    const container = document.getElementById('clubInfoContent');
    container.innerHTML = `
        <h2 style="color:#2c3e7f;margin-bottom:8px;">${club.name}</h2>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;color:#666;font-size:14px;">
            <span>${club.category}</span>
            <span>•</span>
            <span>${club.members} members</span>
        </div>
        <h3 style="color:#2c3e7f;margin-top:20px;margin-bottom:12px;font-size:16px;">About the Club</h3>
        <p style="color:#666;line-height:1.6;margin-bottom:20px;">${club.aboutClub}</p>
        <h3 style="color:#2c3e7f;margin-top:20px;margin-bottom:12px;font-size:16px;">Club Information</h3>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-bottom:20px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-weight:600;color:#2c3e7f;margin-bottom:4px;">Location</div>
                    <div style="color:#666;">${club.location}</div>
                </div>
                <div>
                    <div style="font-weight:600;color:#2c3e7f;margin-bottom:4px;">Meeting Time</div>
                    <div style="color:#666;">${club.meetingTime}</div>
                </div>
            </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
            <button type="button" class="learn-more-btn" style="background:#fff;color:#333;border:1px solid #e8e8e8;padding:10px 18px;border-radius:6px;" onclick="closeClubInfoModal()">Cancel</button>
            <button type="button" class="learn-more-btn" style="background:#2c3e7f;color:#fff;padding:10px 18px;border-radius:6px;border:0;cursor:pointer;" onclick="openClubApplicationModal('${clubId}')">Application</button>
        </div>
    `;

    const modal = document.getElementById('clubInfoModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    // ... (rest of your modal focus/keydown code is fine) ...
}

function closeClubInfoModal() {
    const modal = document.getElementById('clubInfoModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
}

// --- MODIFIED --- (Just changed clubId to be a string `_id`)
function openClubApplicationModal(clubId) {
    currentClubId = clubId;
    const club = getClubById(clubId);
    if (!club) return;
    document.getElementById('applicationClubName').textContent = club.name;
    const modal = document.getElementById('clubApplicationModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    // ... (rest of your modal code is fine) ...
}

function closeClubApplicationModal() {
    const modal = document.getElementById('clubApplicationModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.getElementById('clubApplicationForm').reset();
}

// --- ADD THESE MISSING HELPER FUNCTIONS ---

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function toggleSortMenu() {
    const sortMenu = document.getElementById('sortContainer');
    // We'll also position it relative to the button
    const sortBtn = document.getElementById('sortDisplay');
    sortMenu.style.left = sortBtn.offsetLeft + 'px';
    sortMenu.style.top = (sortBtn.offsetTop + sortBtn.offsetHeight + 5) + 'px';
    
    sortMenu.style.display = sortMenu.style.display === 'none' ? 'block' : 'none';
}
// --- THIS IS THE MOST IMPORTANT CHANGE ---
// We modify your form submit listener to send data to the
// backend instead of localStorage.
async function handleApplicationSubmit(e) {
    e.preventDefault();

    // Get form data (your code was perfect)
    const formData = {
        clubId: currentClubId,
        fullName: document.getElementById('appFullName').value,
        year: document.getElementById('appYear').value,
        motive: document.getElementById('appMotive').value,
        program: document.getElementById('appProgram').value,
        email: document.getElementById('appEmail').value,
        experience: document.getElementById('appExperience').value,
    };

    try {
        // --- NEW FETCH CALL ---
        // Send this data to our NEW backend endpoint
        const response = await fetch('http://localhost:3001/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const newApplication = await response.json();
        console.log('Application submitted:', newApplication);

        alert('Application submitted successfully!');
        closeClubApplicationModal();

    } catch (error) {
        console.error('Error submitting application:', error);
        alert('There was a problem submitting your application. Please try again.');
    }
}

// --- MODIFIED --- (Filter/Sort)
// Your search/filter/sort logic was good, but it was tied to the
// DOM. This new version is "data-first".
// --- REPLACE your main searchAndFilterClubs function with this ---
function searchAndFilterClubs() {
    const searchQuery = document.getElementById('clubsSearchInput').value.toLowerCase();

    // 1. Filter by Category
    let clubsToFilter = allClubsData;
    if (currentCategory !== 'All') {
        clubsToFilter = allClubsData.filter(club => club.category === currentCategory);
    }

    // 2. Filter by Search Query
    if (searchQuery) {
        clubsToFilter = clubsToFilter.filter(club =>
            club.name.toLowerCase().includes(searchQuery) ||
            club.description.toLowerCase().includes(searchQuery)
        );
    }
    
    // 3. Sort the results (with "oldest" added!)
    if (currentSortBy === 'newest') {
        // Sort by the date they were created, newest first
        clubsToFilter.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    } else if (currentSortBy === 'oldest') {
        // Sort by the date, oldest first
        clubsToFilter.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
    } else if (currentSortBy === 'alphabetical') {
        // Sort by the name
        clubsToFilter.sort((a, b) => a.name.localeCompare(b.name));
    }
    // (You can add more `else if` blocks for 'most-members', etc.)

    // 4. Save to global state and render
    filteredClubs = clubsToFilter;
    renderClubs(); // This is our helper function that builds the HTML
}

// --- MODIFIED ---
// We keep your functions, but just make them call our new `searchAndFilterClubs`
function filterByCategory(category) {
    currentCategory = category;
    
    // Update the button text
    const filterBtn = document.getElementById('categoryFilterBtn');
    filterBtn.innerHTML = `${category} <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 6l-5 5-5-5"/></svg>`;
    
    // Hide the menu
    document.getElementById('categoryDropdown').style.display = 'none';
    
    // Re-run the search!
    searchAndFilterClubs();
}

function sortClubs(sortBy) {
    currentSortBy = sortBy;
    const sortDisplay = document.getElementById('sortDisplay');
    
    // This object maps the key to the display text
    const sortLabels = {
        'newest': 'Newest',
        'oldest': 'Oldest', // We'll add this logic next
        'alphabetical': 'Alphabetical'
        // You can add 'most-members' and 'fewest-members' here too
    };
    
    // Update the button text
    sortDisplay.textContent = sortLabels[sortBy];
    
    // Hide the menu
    document.getElementById('sortContainer').style.display = 'none';
    
    // Re-run the search!
    searchAndFilterClubs();
}

// --- NEW FUNCTION ---
// This is the main "waiter" function that starts everything.
async function fetchAndInitializeClubs() {
    try {
        const response = await fetch('http://localhost:3001/api/clubs');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allClubsData = await response.json();
        
        // Initialize the page state
        searchAndFilterClubs();

    } catch (error) {
        console.error('Failed to fetch clubs:', error);
        document.getElementById('clubsGrid').innerHTML = '<p>Error loading clubs. Please try refreshing.</p>';
    }
}

// --- MODIFIED ---
// This is the "on switch" for the entire page.
document.addEventListener('DOMContentLoaded', function() {
    // 1. Fetch data and render the clubs
    fetchAndInitializeClubs();

    // 2. Attach our new form submit handler
    const form = document.getElementById('clubApplicationForm');
    if (form) {
        form.addEventListener('submit', handleApplicationSubmit);
    }

    // 3. Attach your original search/filter/sort listeners
    const searchInput = document.getElementById('clubsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchAndFilterClubs);
    }
    

    if (document.getElementById('upcoming')) {
        fetchAndInitializeEvents();
    }

    if (document.getElementById('faqsList')) {
        renderFAQs();
    }
    if (document.getElementById('announcementsList')) { // Assuming you have this
        initializeAnnouncements();
    }
    // (You can attach your toggleDropdown, toggleSortMenu listeners here too)
    // For simplicity, your onclick="..." attributes in the HTML will still work.
});

/* ============================================
   MODAL HELPER FUNCTIONS
   ============================================ */

// This is the function your "x" and "Back" buttons call
function closeEventDetailModal() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('open');
    }
}

// This is the function your "Register Now" button calls
function openRegistrationModal(eventId, eventTitle) {
    const modal = document.getElementById('registrationModal');
    if (!modal) return;
    
    const eventNameEl = document.getElementById('registrationEventName');
    
    eventNameEl.textContent = `Are you sure you want to register for "${eventTitle}"? Once confirmed, your registration cannot be cancelled.`;
    
    // Store event ID for confirmation
    modal.dataset.eventId = eventId;
    
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    // This handles focus and keyboard for accessibility
    window._previousActiveElement = document.activeElement;
    document.addEventListener('keydown', handleModalKeydown);
}

// This is the function your "Cancel" button (in the 2nd modal) calls
function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('open');
    }
}

// This is a helper for modal accessibility (you had this before)
function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeEventDetailModal();
        closeRegistrationModal();
        // You can add your other modal-closing functions here
    }
}

// (Keep all your other functions like toggleCategoryDropdown, toggleSortMenu, etc.)


/* ============================================
   OJT PAGE FUNCTIONS
   Handles OJT listings filtering, searching, sorting, and company details
   ============================================ */

// OJT data structure
const ojtData = [
    {
        id: 1,
        position: 'Social Media Assistant',
        company: 'ABC Company',
        location: 'Sauyo, Quezon City',
        category: 'Marketing',
        payPerHour: 50,
        workArrangement: 'Remote/Hybrid',
        duration: 8,
        hoursPerWeek: 10,
        postedDays: 2,
        description: 'Join our marketing team to learn social media strategy, content creation, and digital marketing analytics while working on real client campaigns.',
        overview: 'This is an excellent opportunity to gain hands-on experience in social media marketing. You\'ll be working with our marketing team on real client campaigns, learning industry best practices and tools.',
        trainingProgram: 'Digital Marketing Fundamentals - 3-month program with useful skills training',
        skills: ['Social Media Management', 'Content Creation', 'Analytics', 'Digital Marketing']
    },
    {
        id: 2,
        position: 'Marketing Assistant',
        company: 'XYZ Company',
        location: 'Makati, Metro Manila',
        category: 'Marketing',
        payPerHour: 30,
        workArrangement: 'On Site',
        duration: 7,
        hoursPerWeek: 10,
        postedDays: 4,
        description: 'Create engaging content across multiple channels while learning SEO, email marketing, and content strategy from marketing experts.',
        overview: 'Work with our marketing team to create compelling content and learn SEO strategies. This role focuses on practical experience with email marketing and content optimization.',
        trainingProgram: 'Content Marketing & SEO - 2.5 month intensive program',
        skills: ['Content Writing', 'SEO', 'Email Marketing', 'Social Media']
    }
];

let currentOJTCategory = 'All';
let currentOJTSortBy = 'newest';

function getOJTById(id) {
    return ojtData.find(o => o.id === id);
}

function openOJTCompanyModal(ojtId) {
    const ojt = getOJTById(ojtId);
    if (!ojt) return;

    const container = document.getElementById('ojtCompanyContent');
    
    container.innerHTML = `
        <h2 id="ojtCompanyTitle" style="color:#2c3e7f;margin-bottom:8px;">${ojt.position}</h2>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;color:#666;font-size:14px;">
            <span>${ojt.company}</span>
            <span>•</span>
            <span>${ojt.location}</span>
        </div>

        <h3 style="color:#2c3e7f;margin-top:20px;margin-bottom:12px;font-size:16px;">Job Overview</h3>
        <p style="color:#666;line-height:1.6;margin-bottom:20px;">${ojt.overview}</p>

        <h3 style="color:#2c3e7f;margin-top:20px;margin-bottom:12px;font-size:16px;">Training Program</h3>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-bottom:20px;">
            <div style="color:#2c3e7f;font-weight:600;margin-bottom:4px;">${ojt.trainingProgram}</div>
        </div>

        <h3 style="color:#2c3e7f;margin-top:20px;margin-bottom:12px;font-size:16px;">Position Details</h3>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-bottom:20px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-weight:600;color:#2c3e7f;margin-bottom:4px;">💰 Pay</div>
                    <div style="color:#666;">₱${ojt.payPerHour}/hour</div>
                </div>
                <div>
                    <div style="font-weight:600;color:#2c3e7f;margin-bottom:4px;">📍 Work Arrangement</div>
                    <div style="color:#666;">${ojt.workArrangement}</div>
                </div>
                <div>
                    <div style="font-weight:600;color:#2c3e7f;margin-bottom:4px;">⏱️ Duration</div>
                    <div style="color:#666;">${ojt.duration} weeks</div>
                </div>
                <div>
                    <div style="font-weight:600;color:#2c3e7f;margin-bottom:4px;">🕐 Hours per Week</div>
                    <div style="color:#666;">${ojt.hoursPerWeek} hours/week</div>
                </div>
            </div>
        </div>

        <h3 style="color:#2c3e7f;margin-top:20px;margin-bottom:12px;font-size:16px;">Skills You'll Gain</h3>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
            ${ojt.skills.map(skill => `
                <span style="background:#e8f0ff;color:#2c3e7f;padding:6px 12px;border-radius:20px;font-size:14px;">${skill}</span>
            `).join('')}
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
            <button type="button" class="learn-more-btn" style="background:#fff;color:#333;border:1px solid #e8e8e8;padding:10px 18px;border-radius:6px;" onclick="closeOJTCompanyModal()">Close</button>
            <button type="button" class="learn-more-btn" style="background:#2c3e7f;color:#fff;padding:10px 18px;border-radius:6px;border:0;cursor:pointer;" onclick="alert('Application submitted! Check your email for confirmation.')">Apply Now</button>
        </div>
    `;

    const modal = document.getElementById('ojtCompanyModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    window._previousActiveElement = document.activeElement;
    document.addEventListener('keydown', handleModalKeydown);
}

function closeOJTCompanyModal() {
    const modal = document.getElementById('ojtCompanyModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
}

function toggleOJTCategoryDropdown() {
    const dropdown = document.getElementById('ojtCategoryDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function toggleOJTSortMenu() {
    const sortMenu = document.getElementById('ojtSortContainer');
    sortMenu.style.display = sortMenu.style.display === 'none' ? 'block' : 'none';
}

function filterOJTByCategory(category) {
    currentOJTCategory = category;
    document.getElementById('ojtCategoryFilterBtn').textContent = category + ' ';
    document.getElementById('ojtCategoryDropdown').style.display = 'none';
    searchAndFilterOJT();
}

function sortOJT(sortBy) {
    currentOJTSortBy = sortBy;
    const sortDisplay = document.getElementById('ojtSortDisplay');
    
    const sortLabels = {
        'newest': 'Newest',
        'pay-high': 'Pay: High to Low',
        'pay-low': 'Pay: Low to High',
        'hours': 'Hours per Week'
    };
    
    sortDisplay.textContent = sortLabels[sortBy];
    document.getElementById('ojtSortContainer').style.display = 'none';
    searchAndFilterOJT();
}

function searchAndFilterOJT() {
    const searchQuery = document.getElementById('ojtSearchInput').value.toLowerCase();
    const ojtGrid = document.getElementById('ojtGrid');
    const cards = ojtGrid.querySelectorAll('.club-card');

    let visibleOJT = [];
    
    cards.forEach(card => {
        const ojtId = card.getAttribute('data-ojt-id');
        const category = card.getAttribute('data-ojt-category');
        const ojt = getOJTById(parseInt(ojtId));

        if (!ojt) return;

        // Check category filter
        if (currentOJTCategory !== 'All' && category !== currentOJTCategory) {
            card.style.display = 'none';
            return;
        }

        // Check search query
        const position = ojt.position.toLowerCase();
        const company = ojt.company.toLowerCase();
        const description = ojt.description.toLowerCase();
        
        if (searchQuery && !position.includes(searchQuery) && !company.includes(searchQuery) && !description.includes(searchQuery)) {
            card.style.display = 'none';
            return;
        }

        card.style.display = 'block';
        visibleOJT.push(ojt);
    });

    // Sort OJT
    if (currentOJTSortBy === 'newest') {
        visibleOJT.sort((a, b) => a.postedDays - b.postedDays);
    } else if (currentOJTSortBy === 'pay-high') {
        visibleOJT.sort((a, b) => b.payPerHour - a.payPerHour);
    } else if (currentOJTSortBy === 'pay-low') {
        visibleOJT.sort((a, b) => a.payPerHour - b.payPerHour);
    } else if (currentOJTSortBy === 'hours') {
        visibleOJT.sort((a, b) => b.hoursPerWeek - a.hoursPerWeek);
    }

    // Reorder DOM elements
    visibleOJT.forEach(ojt => {
        const card = ojtGrid.querySelector(`[data-ojt-id="${ojt.id}"]`);
        if (card) ojtGrid.appendChild(card);
    });

    // Update OJT count
    document.getElementById('ojtCount').textContent = visibleOJT.length + ' training opportunities found';
}
