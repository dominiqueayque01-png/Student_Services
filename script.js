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
    // Close on Escape - prefer closing whichever modal is open (check in reverse order)
    if (e.key === 'Escape' || e.key === 'Esc') {
        const faqsModal = document.getElementById('faqsModal');
        const sessionDetailsModal = document.getElementById('sessionDetailsModal');
        const withdrawnModal = document.getElementById('withdrawnSuccessModal');
        const cancelConfirmModal = document.getElementById('cancelConfirmModal');
        const mySessionsModal = document.getElementById('mySessionsModal');
        const requestModal = document.getElementById('requestFormModal');
        const learnModal = document.getElementById('learnMoreModal');

        if (faqsModal && faqsModal.getAttribute('aria-hidden') === 'false') {
            closeFaqsModal();
            return;
        }

        if (sessionDetailsModal && sessionDetailsModal.getAttribute('aria-hidden') === 'false') {
            closeSessionDetailsModal();
            return;
        }

        if (withdrawnModal && withdrawnModal.getAttribute('aria-hidden') === 'false') {
            closeWithdrawnSuccessModal();
            return;
        }

        if (cancelConfirmModal && cancelConfirmModal.getAttribute('aria-hidden') === 'false') {
            closeCancelConfirmModal();
            return;
        }

        if (mySessionsModal && mySessionsModal.getAttribute('aria-hidden') === 'false') {
            closeMySessionsModal();
            return;
        }

        if (requestModal && requestModal.getAttribute('aria-hidden') === 'false') {
            closeRequestFormModal();
            return;
        }

        if (learnModal && learnModal.getAttribute('aria-hidden') === 'false') {
            closeLearnMoreModal();
            return;
        }
    }
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
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

/* Request Success Modal Helpers */
function openRequestSuccessModal(caseId) {
    const modal = document.getElementById('requestSuccessModal');
    if (!modal) return;

    // Display the case ID
    const caseIdDisplay = modal.querySelector('#caseIdDisplay');
    if (caseIdDisplay) caseIdDisplay.textContent = caseId;

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
}

function closeRequestSuccessModal() {
    const modal = document.getElementById('requestSuccessModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

/* My Sessions Modal Helpers */
function openMySessionsModal() {
    const modal = document.getElementById('mySessionsModal');
    if (!modal) return;

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
}

function closeMySessionsModal() {
    const modal = document.getElementById('mySessionsModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function switchSessionsTab(tabName) {
    // Update active tab button
    const tabBtns = document.querySelectorAll('.sessions-tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    // Filter sessions by tab name (status)
    filterSessionsByStatus(tabName);
    console.log(`Switched to ${tabName} tab`);
}

function filterSessionsByStatus(status) {
    const sessionsList = document.getElementById('sessionsList');
    if (!sessionsList) return;
    
    // Get all session cards
    const sessionCards = sessionsList.querySelectorAll('.session-card');
    
    sessionCards.forEach(card => {
        const statusEl = card.querySelector('.session-status-badge');
        const cardStatus = statusEl ? statusEl.textContent.toLowerCase() : '';
        
        // Show card only if status matches the selected tab
        if (cardStatus === status.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function openCancelConfirmModal(event) {
    // Prevent opening the session details when clicking cancel button
    if (event) event.stopPropagation();
    
    const modal = document.getElementById('cancelConfirmModal');
    if (!modal) return;

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
}

function closeCancelConfirmModal() {
    const modal = document.getElementById('cancelConfirmModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function submitCancelRequest() {
    // Get the currently clicked session card
    const sessionCard = event.target.closest('.session-card');
    if (!sessionCard) return;
    
    // Get the case ID from the card
    const caseIdEl = sessionCard.querySelector('.session-case-id');
    const caseId = caseIdEl ? caseIdEl.textContent : null;
    
    // Remove the session from the global sessions array
    if (caseId) {
        window.allSessions = window.allSessions.filter(s => s.caseId !== caseId);
    }
    
    // Remove the session card from DOM
    sessionCard.remove();
    
    // Update tab counts
    updateTabCounts();
    
    // Close the confirmation modal and open the withdrawn success modal
    closeCancelConfirmModal();
    closeSessionDetailsModal();
    setTimeout(() => {
        openWithdrawnSuccessModal();
    }, 100);
}

/* Withdrawn Success Modal Helpers */
function openWithdrawnSuccessModal() {
    const modal = document.getElementById('withdrawnSuccessModal');
    if (!modal) return;

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);

    // Auto-close after 2.5 seconds
    setTimeout(() => {
        closeWithdrawnSuccessModal();
    }, 2500);
}

function closeWithdrawnSuccessModal() {
    const modal = document.getElementById('withdrawnSuccessModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

/* Session Details Modal Helpers */
function openSessionDetailsModal(session) {
    const modal = document.getElementById('sessionDetailsModal');
    if (!modal) return;

    // Update modal content with session data if provided
    if (session) {
        // Update header
        modal.querySelector('.details-case-id').textContent = session.caseId;
        modal.querySelector('.details-student-id').textContent = `Student ID: ${session.studentId}`;
        
        // Update student information
        const studentNameEl = modal.querySelector('.details-section .details-row .details-col:nth-child(1) .details-value');
        const counselorEl = modal.querySelector('.details-section .details-row .details-col:nth-child(2) .details-value');
        if (studentNameEl) studentNameEl.textContent = session.fullName;
        if (counselorEl) counselorEl.textContent = 'N/A';
        
        // Update contact information
        const emailContactEl = modal.querySelector('.details-section:nth-of-type(2) .details-contact:nth-child(2) .contact-item-text');
        const phoneContactEl = modal.querySelector('.details-section:nth-of-type(2) .details-contact:nth-child(3) .contact-item-text');
        if (emailContactEl) emailContactEl.textContent = session.email;
        if (phoneContactEl) phoneContactEl.textContent = session.phone;
        
        // Update reference contact
        const refNameEl = modal.querySelector('.details-section:nth-of-type(3) .details-row:nth-child(2) .details-col:nth-child(1) .details-value');
        const refRelEl = modal.querySelector('.details-section:nth-of-type(3) .details-row:nth-child(2) .details-col:nth-child(2) .details-value');
        const refPhoneEl = modal.querySelector('.details-section:nth-of-type(3) .details-row:nth-child(3) .details-col:nth-child(1) .details-value');
        const refEmailEl = modal.querySelector('.details-section:nth-of-type(3) .details-row:nth-child(3) .details-col:nth-child(2) .details-value');
        
        if (refNameEl) refNameEl.textContent = session.refName;
        if (refRelEl) refRelEl.textContent = session.refRelationship;
        if (refPhoneEl) refPhoneEl.textContent = session.refPhone;
        if (refEmailEl) refEmailEl.textContent = session.refEmail;
    }

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
}

function closeSessionDetailsModal() {
    const modal = document.getElementById('sessionDetailsModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
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
    
    // Add click handlers to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.card-title').textContent;
            console.log(`${title} card clicked`);
            // TODO: Add functionality for each card
        });
    });

    // Wire up the request form submit handler if present
    const reqForm = document.getElementById('counselRequestForm');
    if (reqForm) {
        reqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(reqForm);
            const studentId = formData.get('studentId');
            const fullName = formData.get('fullName');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const refName = formData.get('refName');
            const refRelationship = formData.get('refRelationship');
            const refPhone = formData.get('refPhone');
            const refEmail = formData.get('refEmail');
            
            // Generate a demo case ID (format: CYYYYMM-NNN)
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
            const caseId = `C${year}${month}-${randomNum}`;
            
            // Create session object
            const session = {
                caseId: caseId,
                studentId: studentId,
                fullName: fullName,
                email: email,
                phone: phone,
                refName: refName,
                refRelationship: refRelationship,
                refPhone: refPhone,
                refEmail: refEmail,
                status: 'Pending',
                submittedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
            };
            
            // Add session to sessions list
            addSessionToList(session);
            
            // Close the form modal and open success modal
            closeRequestFormModal();
            setTimeout(() => {
                openRequestSuccessModal(caseId);
                reqForm.reset();
            }, 100);
        });
    }

    console.log('Page loaded successfully');
});

// Store sessions globally
window.allSessions = [];

// Function to add a session card to the sessions list
function addSessionToList(session) {
    // Add to global sessions array
    window.allSessions.push(session);
    
    const sessionsList = document.getElementById('sessionsList');
    if (!sessionsList) return;
    
    const sessionCard = document.createElement('div');
    sessionCard.className = 'session-card pending-card';
    sessionCard.setAttribute('role', 'button');
    sessionCard.setAttribute('tabindex', '0');
    sessionCard.onclick = function() { openSessionDetailsModal(session); };
    
    const submittedDate = session.submittedDate.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
    
    sessionCard.innerHTML = `
        <div class="session-card-header">
            <div class="session-id-section">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#2c3e7f">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                </svg>
                <div>
                    <div class="session-case-id">${session.caseId}</div>
                    <div class="session-date">Submitted on ${session.submittedDate}</div>
                </div>
            </div>
            <span class="session-status-badge pending-badge">${session.status}</span>
        </div>

        <div class="session-card-body">
            <div class="session-info-grid">
                <div class="session-info-item">
                    <div class="session-info-label">Name:</div>
                    <div class="session-info-value">${session.fullName}</div>
                </div>
                <div class="session-info-item">
                    <div class="session-info-label">Email Address:</div>
                    <div class="session-info-value">${session.email}</div>
                </div>
                <div class="session-info-item">
                    <div class="session-info-label">Assigned Counselor:</div>
                    <div class="session-info-value">N/A</div>
                </div>
            </div>

            <div class="session-schedule-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span>Not Scheduled</span>
            </div>
        </div>

        <div class="session-card-footer">
            <button class="session-btn cancel-btn" onclick="openCancelConfirmModal(event)">Cancel</button>
        </div>
    `;
    
    sessionsList.insertBefore(sessionCard, sessionsList.firstChild);
    
    // Update tab counts
    updateTabCounts();
}

// Function to update tab counts based on sessions
function updateTabCounts() {
    const pendingCount = window.allSessions.filter(s => s.status === 'Pending').length;
    const scheduledCount = window.allSessions.filter(s => s.status === 'Scheduled').length;
    const completedCount = window.allSessions.filter(s => s.status === 'Completed').length;
    
    // Update Pending tab
    const pendingTab = document.querySelector('[data-tab="pending"]');
    if (pendingTab) {
        const tabCountEl = pendingTab.querySelector('.tab-count');
        if (pendingCount > 0) {
            if (tabCountEl) {
                tabCountEl.textContent = `(${pendingCount})`;
            }
        } else {
            if (tabCountEl) {
                tabCountEl.textContent = '';
            }
        }
    }
    
    // Update Scheduled tab
    const scheduledTab = document.querySelector('[data-tab="scheduled"]');
    if (scheduledTab) {
        const tabCountEl = scheduledTab.querySelector('.tab-count');
        if (scheduledCount > 0) {
            if (tabCountEl) {
                tabCountEl.textContent = `(${scheduledCount})`;
            } else {
                scheduledTab.insertAdjacentHTML('beforeend', `<span class="tab-count">(${scheduledCount})</span>`);
            }
        } else {
            if (tabCountEl) {
                tabCountEl.textContent = '';
            }
        }
    }
    
    // Update Completed tab
    const completedTab = document.querySelector('[data-tab="completed"]');
    if (completedTab) {
        const tabCountEl = completedTab.querySelector('.tab-count');
        if (completedCount > 0) {
            if (tabCountEl) {
                tabCountEl.textContent = `(${completedCount})`;
            } else {
                completedTab.insertAdjacentHTML('beforeend', `<span class="tab-count">(${completedCount})</span>`);
            }
        } else {
            if (tabCountEl) {
                tabCountEl.textContent = '';
            }
        }
    }
}

/* ============================================
   EVENT PAGE FUNCTIONS
   ============================================ */

// Switch between event tabs
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.events-list-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activate button
    event.target.classList.add('active');
}

// Calendar navigation
function previousMonth() {
    console.log('Previous month clicked');
    // TODO: Implement month navigation
}

function nextMonth() {
    console.log('Next month clicked');
    // TODO: Implement month navigation
}

/* ============================================
   FAQs MODAL FUNCTIONS
   ============================================ */

function openFaqsModal() {
    const modal = document.getElementById('faqsModal');
    if (!modal) return;

    window._previousActiveElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    // Focus on first focusable element or title
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }

    document.addEventListener('keydown', handleModalKeydown);
}

function closeFaqsModal() {
    const modal = document.getElementById('faqsModal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function toggleFaqAnswer(questionNumber) {
    const answerElement = document.getElementById('faqAnswer' + questionNumber);
    const faqItem = answerElement.closest('.faq-item');
    
    if (faqItem.classList.contains('active')) {
        faqItem.classList.remove('active');
    } else {
        // Close all other open FAQs
        const allItems = document.querySelectorAll('.faq-item.active');
        allItems.forEach(item => item.classList.remove('active'));
        
        // Open the clicked one
        faqItem.classList.add('active');
    }
}

// Announcements Functions
function filterAnnouncements(filterType) {
    const announcementsList = document.querySelector('.announcements-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.filter-btn').classList.add('active');
    
    // Filter announcements
    const announcements = announcementsList.querySelectorAll('.announcement-item');
    
    announcements.forEach(announcement => {
        const isRead = announcement.getAttribute('data-read') === 'true';
        
        if (filterType === 'unread') {
            announcement.style.display = isRead ? 'none' : 'block';
        } else if (filterType === 'all') {
            announcement.style.display = 'block';
        }
    });
}

function markAllAsRead(e) {
    e.preventDefault();
    
    // Mark all announcements as read
    const announcements = document.querySelectorAll('.announcement-item');
    announcements.forEach(announcement => {
        announcement.setAttribute('data-read', 'true');
    });
    
    // Update unread count
    updateUnreadCount();
    
    // Switch to "All" view
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    filterBtns[1].classList.add('active'); // "All" button
    
    // Show all announcements
    const announcementsList = document.querySelector('.announcements-list');
    const allAnnouncements = announcementsList.querySelectorAll('.announcement-item');
    allAnnouncements.forEach(announcement => {
        announcement.style.display = 'block';
    });
}

function updateUnreadCount() {
    const announcements = document.querySelectorAll('.announcement-item');
    let unreadCount = 0;
    
    announcements.forEach(announcement => {
        if (announcement.getAttribute('data-read') === 'false') {
            unreadCount++;
        }
    });
    
    const unreadBadge = document.getElementById('unreadCount');
    if (unreadBadge) {
        unreadBadge.textContent = unreadCount;
    }
}

// Club Functions
const clubsData = [
    {
        id: 1,
        name: 'Tech Innovation Club',
        category: 'Technology',
        description: 'A community of tech enthusiasts building the future through coding, hackathons, and innovative projects.',
        location: 'IK503',
        time: 'Tue, 9:00 pm',
        members: 134,
        applicants: 10
    },
    {
        id: 2,
        name: 'Data Science Collective',
        category: 'Technology',
        description: 'Learn data science, machine learning, and analytics through hands-on projects and collaborative learning.',
        location: 'IL 305',
        time: 'Wed, 5:00 pm',
        members: 125,
        applicants: 18
    }
];

let currentCategory = 'all';
let currentSort = 'newest';

function openClubInfoModal(event) {
    event.preventDefault();
    const clubCard = event.target.closest('.club-card');
    const clubId = parseInt(clubCard.getAttribute('data-club-id'));
    const club = clubsData.find(c => c.id === clubId);

    if (club) {
        document.getElementById('clubInfoTitle').textContent = club.name;
        document.querySelector('.club-info-category').textContent = `${club.category} · ${club.members} members`;
        document.querySelector('.club-info-description').textContent = club.description;
        
        const infoItems = document.querySelectorAll('.club-info-details .info-item');
        infoItems[0].querySelector('span').textContent = club.location;
        infoItems[1].querySelector('span').textContent = club.time;
        infoItems[2].querySelector('span').textContent = `${club.members} members`;

        const modal = document.getElementById('clubInfoModal');
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('open');
        window._previousActiveElement = document.activeElement;

        document.addEventListener('keydown', handleModalKeydown);
    }
}

function closeClubInfoModal() {
    const modal = document.getElementById('clubInfoModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function openClubApplicationModal() {
    closeClubInfoModal();
    
    const clubTitle = document.getElementById('clubInfoTitle').textContent;
    document.getElementById('clubNameInForm').textContent = clubTitle;
    
    const modal = document.getElementById('clubApplicationModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    window._previousActiveElement = document.activeElement;

    document.addEventListener('keydown', handleModalKeydown);

    // Wire form submission
    const form = document.getElementById('clubApplicationForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        submitClubApplication();
    };
}

function closeClubApplicationModal() {
    const modal = document.getElementById('clubApplicationModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function submitClubApplication() {
    const form = document.getElementById('clubApplicationForm');
    const clubName = document.getElementById('clubNameInForm').textContent;
    
    // Clear form
    form.reset();
    
    // Close application modal
    closeClubApplicationModal();
    
    // Update success modal
    document.getElementById('clubNameInSuccess').textContent = clubName;
    
    // Open success modal
    const successModal = document.getElementById('clubApplicationSuccessModal');
    successModal.setAttribute('aria-hidden', 'false');
    successModal.classList.add('open');
    window._previousActiveElement = document.activeElement;

    document.addEventListener('keydown', handleModalKeydown);
    
    // Auto-close after 2.5 seconds
    setTimeout(() => {
        closeClubApplicationSuccessModal();
    }, 2500);
}

function closeClubApplicationSuccessModal() {
    const modal = document.getElementById('clubApplicationSuccessModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function searchClubs() {
    const searchInput = document.getElementById('clubSearchInput').value.toLowerCase();
    const clubCards = document.querySelectorAll('.club-card');

    clubCards.forEach(card => {
        const clubName = card.getAttribute('data-club-name').toLowerCase();
        const description = card.querySelector('.club-description').textContent.toLowerCase();
        
        if (clubName.includes(searchInput) || description.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateClubCount();
}

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function filterByCategory(category) {
    currentCategory = category;
    const clubCards = document.querySelectorAll('.club-card');
    const dropdownBtn = document.querySelector('.filter-dropdown');

    // Update button text
    if (category === 'all') {
        dropdownBtn.textContent = 'All';
    } else {
        dropdownBtn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    dropdownBtn.innerHTML += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 6l-5 5-5-5"/></svg>';

    clubCards.forEach(card => {
        const clubCategory = card.getAttribute('data-category').toLowerCase();
        if (category === 'all' || clubCategory === category.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('categoryDropdown').style.display = 'none';
    updateClubCount();
}

function toggleSortDropdown() {
    const menu = document.getElementById('sortMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function toggleSortMenu() {
    const menu = document.getElementById('sortMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function sortClubs(sortType) {
    currentSort = sortType;
    const clubsGrid = document.getElementById('clubsGrid');
    const clubCards = Array.from(clubsGrid.querySelectorAll('.club-card'));
    
    clubCards.sort((a, b) => {
        switch(sortType) {
            case 'members-most':
                return parseInt(b.getAttribute('data-members')) - parseInt(a.getAttribute('data-members'));
            case 'members-fewest':
                return parseInt(a.getAttribute('data-members')) - parseInt(b.getAttribute('data-members'));
            case 'alphabetical':
                return a.getAttribute('data-club-name').localeCompare(b.getAttribute('data-club-name'));
            case 'newest':
            default:
                return 0; // Keep original order
        }
    });

    clubCards.forEach(card => {
        clubsGrid.appendChild(card);
    });

    // Update active button
    document.getElementById('newestBtn').classList.remove('active');
    if (sortType === 'newest') {
        document.getElementById('newestBtn').classList.add('active');
    }

    document.getElementById('sortMenu').style.display = 'none';
}

function updateClubCount() {
    const clubCards = document.querySelectorAll('.club-card');
    let visibleCount = 0;

    clubCards.forEach(card => {
        if (card.style.display !== 'none') {
            visibleCount++;
        }
    });

    document.getElementById('clubCount').textContent = visibleCount;
}

// OJT Functions
const ojtData = [
    {
        id: 1,
        position: 'Social Media Assistant',
        company: 'ABC Company',
        location: 'Sauyo, Quezon City',
        category: 'Marketing',
        description: 'Join our marketing team to learn social media strategy, content creation, and digital marketing analytics while working on real client campaigns.',
        program: 'Digital Marketing Fundamentals',
        programDesc: '3-month program · Useful skills program',
        salary: 50,
        worktype: 'Remote/Hybrid',
        duration: 8,
        hours: 10
    },
    {
        id: 2,
        position: 'Marketing Assistant',
        company: 'XYZ Company',
        location: 'BGC, Taguig City',
        category: 'Marketing',
        description: 'Create engaging content across multiple channels while learning SEO, email marketing, and content strategy from marketing experts.',
        program: 'Content Strategy & Marketing',
        programDesc: '3-month program · Hands-on training',
        salary: 30,
        worktype: 'On Site',
        duration: 7,
        hours: 10
    }
];

function openOjtCompanyInfoModal(event) {
    event.preventDefault();
    const jobCard = event.target.closest('.club-card');
    const jobId = parseInt(jobCard.getAttribute('data-ojt-id'));
    const job = ojtData.find(j => j.id === jobId);

    if (job) {
        document.getElementById('companyInfoTitle').textContent = job.position;
        document.getElementById('companyLocation').textContent = `${job.company} · ${job.location}`;
        document.getElementById('jobOverviewText').textContent = job.description;
        
        const trainingProgramEl = document.getElementById('trainingProgramText');
        trainingProgramEl.innerHTML = `<strong style="color: #2c3e7f;">${job.program}</strong><br><span style="font-size: 13px; color: #999;">${job.programDesc}</span>`;
        
        document.getElementById('salaryText').textContent = `₱${job.salary}/hour`;
        document.getElementById('workTypeText').textContent = job.worktype;
        document.getElementById('durationText').textContent = `${job.duration} weeks`;
        document.getElementById('hoursText').textContent = `${job.hours} hours/week`;

        const modal = document.getElementById('ojtCompanyInfoModal');
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('open');
        window._previousActiveElement = document.activeElement;

        document.addEventListener('keydown', handleModalKeydown);
    }
}

function closeOjtCompanyInfoModal() {
    const modal = document.getElementById('ojtCompanyInfoModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function openOjtApplicationModal() {
    closeOjtCompanyInfoModal();
    
    const positionTitle = document.getElementById('companyInfoTitle').textContent;
    document.getElementById('positionNameInForm').textContent = positionTitle;
    
    const modal = document.getElementById('ojtApplicationModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    window._previousActiveElement = document.activeElement;

    document.addEventListener('keydown', handleModalKeydown);

    // Wire form submission
    const form = document.getElementById('ojtApplicationForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        submitOjtApplication();
    };
}

function closeOjtApplicationModal() {
    const modal = document.getElementById('ojtApplicationModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function submitOjtApplication() {
    const form = document.getElementById('ojtApplicationForm');
    const positionName = document.getElementById('positionNameInForm').textContent;
    
    // Clear form
    form.reset();
    
    // Close application modal
    closeOjtApplicationModal();
    
    // Update success modal
    document.getElementById('positionNameInSuccess').textContent = positionName;
    
    // Open success modal
    const successModal = document.getElementById('ojtApplicationSuccessModal');
    successModal.setAttribute('aria-hidden', 'false');
    successModal.classList.add('open');
    window._previousActiveElement = document.activeElement;

    document.addEventListener('keydown', handleModalKeydown);
    
    // Auto-close after 2.5 seconds
    setTimeout(() => {
        closeOjtApplicationSuccessModal();
    }, 2500);
}

function closeOjtApplicationSuccessModal() {
    const modal = document.getElementById('ojtApplicationSuccessModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');

    try {
        if (window._previousActiveElement && typeof window._previousActiveElement.focus === 'function') {
            window._previousActiveElement.focus();
        }
    } catch (err) {
        // ignore
    }

    document.removeEventListener('keydown', handleModalKeydown);
}

function searchOjt() {
    const searchInput = document.getElementById('ojtSearchInput').value.toLowerCase();
    const jobCards = document.querySelectorAll('#ojtGrid .club-card');

    jobCards.forEach(card => {
        const position = card.getAttribute('data-position').toLowerCase();
        const company = card.getAttribute('data-company').toLowerCase();
        const description = card.querySelector('.club-description').textContent.toLowerCase();
        
        if (position.includes(searchInput) || company.includes(searchInput) || description.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateOjtCount();
}

function toggleOjtCategoryDropdown() {
    const dropdown = document.getElementById('ojtCategoryDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function filterOjtByCategory(category) {
    const jobCards = document.querySelectorAll('#ojtGrid .club-card');
    const dropdownBtn = document.querySelector('.filter-dropdown');

    // Update button text
    if (category === 'all') {
        dropdownBtn.textContent = 'All';
    } else {
        const categoryNames = {
            'marketing': 'Marketing',
            'it': 'IT/Programming',
            'design': 'Design',
            'finance': 'Finance',
            'hr': 'Human Resources'
        };
        dropdownBtn.textContent = categoryNames[category] || category;
    }
    dropdownBtn.innerHTML += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 6l-5 5-5-5"/></svg>';

    jobCards.forEach(card => {
        const jobCategory = card.getAttribute('data-category').toLowerCase();
        if (category === 'all' || jobCategory === category.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('ojtCategoryDropdown').style.display = 'none';
    updateOjtCount();
}

function toggleOjtSortDropdown() {
    const menu = document.getElementById('ojtSortMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function toggleOjtSortMenu() {
    const menu = document.getElementById('ojtSortMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function sortOjt(sortType) {
    const ojtGrid = document.getElementById('ojtGrid');
    const jobCards = Array.from(ojtGrid.querySelectorAll('.club-card'));
    
    jobCards.sort((a, b) => {
        switch(sortType) {
            case 'salary-high':
                return parseInt(b.getAttribute('data-salary')) - parseInt(a.getAttribute('data-salary'));
            case 'salary-low':
                return parseInt(a.getAttribute('data-salary')) - parseInt(b.getAttribute('data-salary'));
            case 'duration-short':
                return parseInt(a.getAttribute('data-duration')) - parseInt(b.getAttribute('data-duration'));
            case 'duration-long':
                return parseInt(b.getAttribute('data-duration')) - parseInt(a.getAttribute('data-duration'));
            case 'newest':
            default:
                return 0; // Keep original order
        }
    });

    jobCards.forEach(card => {
        ojtGrid.appendChild(card);
    });

    // Update active button
    document.getElementById('ojtNewestBtn').classList.remove('active');
    if (sortType === 'newest') {
        document.getElementById('ojtNewestBtn').classList.add('active');
    }

    document.getElementById('ojtSortMenu').style.display = 'none';
}

function updateOjtCount() {
    const jobCards = document.querySelectorAll('#ojtGrid .club-card');
    let visibleCount = 0;

    jobCards.forEach(card => {
        if (card.style.display !== 'none') {
            visibleCount++;
        }
    });

    document.getElementById('ojtCount').textContent = visibleCount;
}
