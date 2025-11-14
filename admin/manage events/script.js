// Login page functionality
let failedAttempts = 0;
const MAX_ATTEMPTS = 3;
let lockoutTime = 0;

// Check if login form exists (only on login page)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Check if account is locked
        if (lockoutTime > 0) {
            showLockedState();
            return;
        }

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorMessage = document.getElementById('error-message');

        // Validation
        if (!username || !password) {
            errorMessage.textContent = 'Please enter both username and password.';
            errorMessage.classList.add('show');
            return;
        }

        // Check credentials
        if (username === 'Admin123' && password === 'password') {
            errorMessage.classList.remove('show');
            failedAttempts = 0;
            alert('Login successful! Welcome Admin.');
            // Redirect to admin dashboard or do something else
            window.location.href = 'counseling.html'; // Change to your admin dashboard URL
        } else {
            failedAttempts++;
            
            if (failedAttempts >= MAX_ATTEMPTS) {
                // Lock the account
                lockoutTime = 30;
                showLockedState();
                startCountdown();
            } else {
                errorMessage.textContent = `Invalid username or password. Please try again. (${failedAttempts}/${MAX_ATTEMPTS})`;
                errorMessage.classList.add('show');
            }
            
            document.getElementById('password').value = '';
        }
    });

    function showLockedState() {
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('locked-box').style.display = 'block';
    }

    function hideLockedState() {
        document.getElementById('locked-box').style.display = 'none';
        document.getElementById('login-box').style.display = 'block';
        document.getElementById('error-message').classList.remove('show');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        failedAttempts = 0;
    }

    function startCountdown() {
        const timerElement = document.getElementById('timer');
        const interval = setInterval(() => {
            lockoutTime--;
            timerElement.textContent = lockoutTime;
            
            if (lockoutTime <= 0) {
                clearInterval(interval);
                hideLockedState();
            }
        }, 1000);
    }

    // Back button functionality
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
        });
    }
}

// Counseling page functionality
const tabButtons = document.querySelectorAll('.tab-button');
const sessionCards = document.querySelectorAll('.session-card');
const searchBox = document.getElementById('search-box');
const emptyState = document.getElementById('empty-state');
const sessionDetails = document.getElementById('session-details');

// Only run counseling code if we're on the counseling page
if (sessionCards.length > 0) {
    // Sample session data
    const sessionsData = {
        'C2025-001': {
            studentName: 'Juan Batumbakal',
            studentId: '23-0000',
            studentEmail: 'juanbatumbakal@gmail.com',
            studentPhone: '0XXX XXX XXXX',
            counselor: 'N/A',
            totalSessions: '0',
            status: 'Pending',
            initialSession: 'N/A',
            lastSession: 'N/A',
            nextScheduled: 'N/A'
        },
        'C2025-002': {
            studentName: 'Aiden Richards',
            studentId: '23-0001',
            studentEmail: 'aidenrichards@gmail.com',
            studentPhone: '0XXX XXX XXXX',
            counselor: 'N/A',
            totalSessions: '0',
            status: 'Pending',
            initialSession: 'N/A',
            lastSession: 'N/A',
            nextScheduled: 'N/A'
        },
        'C2025-003': {
            studentName: 'Jammy Cruz',
            studentId: '23-0002',
            studentEmail: 'jammycruz@gmail.com',
            studentPhone: '0XXX XXX XXXX',
            counselor: 'N/A',
            totalSessions: '0',
            status: 'Pending',
            initialSession: 'N/A',
            lastSession: 'N/A',
            nextScheduled: 'N/A'
        }
    };

    // Handle tab button clicks
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterSessions(filter);
        });
    });

    // Filter sessions based on status
    function filterSessions(filter) {
        sessionCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const status = card.getAttribute('data-status');
                card.style.display = status === filter ? 'block' : 'none';
            }
        });
    }

    // Search functionality
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            sessionCards.forEach(card => {
                const sessionName = card.querySelector('.session-name').textContent.toLowerCase();
                const sessionId = card.querySelector('.session-header h4').textContent.toLowerCase();
                
                if (sessionName.includes(searchTerm) || sessionId.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Click on session card to show details
    sessionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            sessionCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');

            // Get session ID from card
            const sessionId = this.getAttribute('data-id');
            const data = sessionsData[sessionId];

            // Update details panel
            if (data) {
                document.getElementById('detail-session-id').textContent = sessionId;
                document.getElementById('detail-student-name').textContent = data.studentName;
                document.getElementById('detail-student-id').textContent = data.studentId;
                document.getElementById('detail-student-email').textContent = data.studentEmail;
                document.getElementById('detail-student-phone').textContent = data.studentPhone;
                document.getElementById('detail-counselor').textContent = data.counselor;
                document.getElementById('detail-total-sessions').textContent = data.totalSessions;
                document.getElementById('detail-detail-status').textContent = data.status;
                document.getElementById('detail-initial-session').textContent = data.initialSession;
                document.getElementById('detail-last-session').textContent = data.lastSession;
                document.getElementById('detail-next-scheduled').textContent = data.nextScheduled;

                // Update status badge
                const statusBadge = document.getElementById('detail-status');
                statusBadge.className = 'status-badge ' + this.getAttribute('data-status');
                statusBadge.textContent = data.status;

                // Show details, hide empty state
                if (emptyState) emptyState.style.display = 'none';
                if (sessionDetails) sessionDetails.style.display = 'block';
            }
        });
    });

    // Close button functionality
    const closeBtn = document.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            sessionCards.forEach(c => c.classList.remove('selected'));
            if (emptyState) emptyState.style.display = 'flex';
            if (sessionDetails) sessionDetails.style.display = 'none';
        });
    }

    // Schedule Session button - Open Modal
    const scheduleBtn = document.getElementById('btn-schedule-or-edit');
    const scheduleModal = document.getElementById('schedule-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const btnCancel = document.querySelector('.btn-cancel');
    const btnScheduleSave = document.getElementById('btn-modal-action');
    const markCompletedCheckbox = document.getElementById('mark-completed');
    const completionSection = document.getElementById('completion-section');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    let currentSchedulingSessionId = null;
    let isEditMode = false;

    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            // Get the currently selected session ID
            const selectedCard = document.querySelector('.session-card.selected');
            if (selectedCard) {
                currentSchedulingSessionId = selectedCard.getAttribute('data-id');
                const status = selectedCard.getAttribute('data-status');
                
                // Determine if we're scheduling or editing
                isEditMode = (status === 'scheduled');
                
                // Update modal title and button text
                if (isEditMode) {
                    modalTitle.textContent = 'Edit Session';
                    modalSubtitle.textContent = 'Update the date, time, or counselor for this session.';
                    btnScheduleSave.textContent = 'Update Session';
                } else {
                    modalTitle.textContent = 'Schedule Session';
                    modalSubtitle.textContent = 'Assign a date and time for this counselling session.';
                    btnScheduleSave.textContent = 'Schedule Session';
                }
                
                // Pre-fill form if editing
                if (isEditMode) {
                    const data = sessionsData[currentSchedulingSessionId];
                    if (data && data.nextScheduled) {
                        const [dateStr, timeStr] = data.nextScheduled.split(' ');
                        document.getElementById('schedule-date').value = dateStr;
                        document.getElementById('schedule-time').value = timeStr;
                    }
                    document.getElementById('schedule-counselor').value = data.counselor || '';
                } else {
                    // Clear previous inputs
                    document.getElementById('schedule-date').value = '';
                    document.getElementById('schedule-time').value = '';
                    document.getElementById('schedule-counselor').value = '';
                }
                
                scheduleModal.style.display = 'flex';
            }
        });
    }

    // Close modal - X button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            scheduleModal.style.display = 'none';
            currentSchedulingSessionId = null;
            isEditMode = false;
        });
    }

    // Close modal - Cancel button
    if (btnCancel) {
        btnCancel.addEventListener('click', function() {
            scheduleModal.style.display = 'none';
            currentSchedulingSessionId = null;
            isEditMode = false;
        });
    }

    // Save Schedule - Schedule Session button in modal
    if (btnScheduleSave) {
        btnScheduleSave.addEventListener('click', function() {
            const date = document.getElementById('schedule-date').value;
            const time = document.getElementById('schedule-time').value;
            const counselor = document.getElementById('schedule-counselor').value;

            // Validation
            if (!date || !time || !counselor) {
                alert('Please fill in all fields (Date, Time, and Counselor)');
                return;
            }

            // Find the session card
            if (currentSchedulingSessionId) {
                const sessionCard = document.querySelector(`.session-card[data-id="${currentSchedulingSessionId}"]`);
                if (sessionCard) {
                    // Update session data
                    sessionsData[currentSchedulingSessionId].status = 'Scheduled';
                    sessionsData[currentSchedulingSessionId].counselor = counselor;
                    sessionsData[currentSchedulingSessionId].nextScheduled = date + ' ' + time;

                    // Change card status from pending to scheduled
                    sessionCard.setAttribute('data-status', 'scheduled');

                    // Update status badge
                    const statusBadge = sessionCard.querySelector('.status-badge');
                    statusBadge.className = 'status-badge scheduled';
                    statusBadge.textContent = 'Scheduled';

                    // Update details panel if still viewing
                    const detailStatus = document.getElementById('detail-status');
                    if (detailStatus) {
                        detailStatus.className = 'status-badge scheduled';
                        detailStatus.textContent = 'Scheduled';
                        document.getElementById('detail-counselor').textContent = counselor;
                        document.getElementById('detail-next-scheduled').textContent = date + ' ' + time;
                        document.getElementById('detail-detail-status').textContent = 'Scheduled';
                    }

                    // Show completion section for scheduled sessions
                    if (completionSection) {
                        completionSection.style.display = 'block';
                        // Reset checkbox
                        markCompletedCheckbox.checked = false;
                    }

                    // Show success message
                    showSuccessNotification(isEditMode ? 'Session updated successfully' : 'Session scheduled successfully');

                    // Close modal
                    scheduleModal.style.display = 'none';
                    currentSchedulingSessionId = null;
                    isEditMode = false;
                }
            }
        });
    }

    // Mark as Completed checkbox handler
    if (markCompletedCheckbox) {
        markCompletedCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Show confirmation modal
                if (confirm('Completing this session will update its status and remove it from the active list. This action cannot be undone.')) {
                    completeSession();
                } else {
                    this.checked = false;
                }
            }
        });
    }

    function completeSession() {
        const selectedCard = document.querySelector('.session-card.selected');
        if (selectedCard) {
            const sessionId = selectedCard.getAttribute('data-id');
            
            // Update session data
            sessionsData[sessionId].status = 'Completed';
            sessionsData[sessionId].lastSession = sessionsData[sessionId].nextScheduled;
            sessionsData[sessionId].initialSession = sessionsData[sessionId].initialSession !== 'N/A' ? sessionsData[sessionId].initialSession : sessionsData[sessionId].nextScheduled;

            // Change card status to completed
            selectedCard.setAttribute('data-status', 'completed');

            // Update status badge
            const statusBadge = selectedCard.querySelector('.status-badge');
            statusBadge.className = 'status-badge completed';
            statusBadge.textContent = 'Completed';

            // Update details panel
            const detailStatus = document.getElementById('detail-status');
            if (detailStatus) {
                detailStatus.className = 'status-badge completed';
                detailStatus.textContent = 'Completed';
                document.getElementById('detail-detail-status').textContent = 'Completed';
                document.getElementById('detail-last-session').textContent = sessionsData[sessionId].lastSession;
                document.getElementById('detail-initial-session').textContent = sessionsData[sessionId].initialSession;
            }

            // Hide completion section and reset checkbox
            if (completionSection) {
                completionSection.style.display = 'none';
                markCompletedCheckbox.checked = false;
            }

            showSuccessNotification('Session mark as completed');
        }
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === scheduleModal) {
            scheduleModal.style.display = 'none';
            currentSchedulingSessionId = null;
            isEditMode = false;
        }
    });

    // Success notification function
    function showSuccessNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 16px 24px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-in;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(function() {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Trigger first card to show details on page load
    window.addEventListener('load', function() {
        const firstCard = document.querySelector('.session-card.selected');
        if (firstCard) {
            firstCard.click();
        }
    });
}

// Logout button (works on both pages)
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });
}

// Navigation items
const navItems = document.querySelectorAll('.nav-item');
if (navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Navigate to corresponding page
            if (page === 'counseling') {
                window.location.href = 'counseling.html';
            } else if (page === 'counselors') {
                window.location.href = 'counselors.html';
            } else if (page === 'announcements') {
                window.location.href = 'announcements.html';
            }
        });
    });
}

// ========== COUNSELORS PAGE FUNCTIONALITY ==========
const counselorsGrid = document.getElementById('counselors-grid');
const btnAddCounselor = document.querySelector('.btn-add-counselor');
const counselorModal = document.getElementById('counselor-modal');
const deleteModal = document.getElementById('delete-modal');
const counselorSearch = document.getElementById('counselor-search');
const modalClose = document.querySelectorAll('.modal-close');
const btnCancel = document.querySelectorAll('.btn-cancel');
const counselorSubmitBtn = document.getElementById('counselor-submit-btn');
const btnDelete = document.querySelector('.btn-delete');

// Initialize counselors data from localStorage or use default
let counselorsData = [];

function initializeCounselorsData() {
    const stored = localStorage.getItem('counselorsData');
    if (stored) {
        counselorsData = JSON.parse(stored);
    } else {
        counselorsData = [
            {
                id: 1,
                name: 'Dr. Maria Santos',
                title: 'Licensed Counselor',
                activeCases: 8,
                totalCases: 45,
                email: 'maria.santos@qcu.edu.ph',
                phone: '0912 345 6789',
                availability: 'Mon-Fri, 9:00 AM - 5 PM'
            },
            {
                id: 2,
                name: 'Dr. James Bond',
                title: 'Licensed Counselor',
                activeCases: 9,
                totalCases: 35,
                email: 'james.bond@qcu.edu.ph',
                phone: '0912 345 6790',
                availability: 'Mon-Fri, 9:00 AM - 5 PM'
            },
            {
                id: 3,
                name: 'Dr. Roberto Cruz',
                title: 'Licensed Counselor',
                activeCases: 3,
                totalCases: 39,
                email: 'roberto.cruz@qcu.edu.ph',
                phone: '0912 345 6791',
                availability: 'Mon-Fri, 9:00 AM - 5 PM'
            },
            {
                id: 4,
                name: 'Dr. Lisa De Leon',
                title: 'Licensed Counselor',
                activeCases: 10,
                totalCases: 27,
                email: 'lisa.deleon@qcu.edu.ph',
                phone: '0912 345 6792',
                availability: 'Mon-Fri, 9:00 AM - 5 PM'
            }
        ];
        saveCounselorsData();
    }
}

function saveCounselorsData() {
    localStorage.setItem('counselorsData', JSON.stringify(counselorsData));
}

let currentEditingCounselorId = null;

// Only run counselor code if we're on the counselors page
if (counselorsGrid) {
    // Initialize data from localStorage
    initializeCounselorsData();
    renderCounselors(counselorsData);

    // Add Counselor Button
    if (btnAddCounselor) {
        btnAddCounselor.addEventListener('click', function() {
            openCounselorModal(false);
        });
    }

    // Render counselors
    function renderCounselors(data) {
        counselorsGrid.innerHTML = '';
        
        if (data.length === 0) {
            counselorsGrid.innerHTML = '<div class="empty-counselors"><p>No counselors found</p></div>';
            return;
        }

        data.forEach(counselor => {
            const card = document.createElement('div');
            card.className = 'counselor-card';
            card.innerHTML = `
                <div class="counselor-card-header">
                    <p class="counselor-name">${counselor.name}</p>
                    <p class="counselor-title">${counselor.title}</p>
                </div>

                <div class="counselor-card-section">
                    <p class="card-label">Active Cases</p>
                    <div class="card-stat">
                        <span>Active Cases</span>
                        <span>${counselor.activeCases}</span>
                    </div>
                    <div class="card-stat">
                        <span>Total Cases</span>
                        <span>${counselor.totalCases}</span>
                    </div>
                </div>

                <div class="counselor-card-section">
                    <p class="card-label">Contact Information</p>
                    <p class="card-contact">📧 ${counselor.email}</p>
                    <p class="card-contact">📞 ${counselor.phone}</p>
                </div>

                <div class="counselor-card-section">
                    <p class="card-label">Availability</p>
                    <p class="card-availability">${counselor.availability}</p>
                </div>

                <div class="counselor-card-actions">
                    <button class="btn-edit-counselor" data-id="${counselor.id}">Edit</button>
                    <button class="btn-remove-counselor" data-id="${counselor.id}">Remove</button>
                </div>
            `;
            counselorsGrid.appendChild(card);
        });

        // Add event listeners to edit and remove buttons
        document.querySelectorAll('.btn-edit-counselor').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editCounselor(parseInt(id));
            });
        });

        document.querySelectorAll('.btn-remove-counselor').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteCounselorConfirm(parseInt(id));
            });
        });
    }

    // Open Counselor Modal
    function openCounselorModal(isEdit, counselorId = null) {
        currentEditingCounselorId = counselorId;
        const modalTitle = document.getElementById('counselor-modal-title');
        const modalSubtitle = document.getElementById('counselor-modal-subtitle');

        if (isEdit) {
            modalTitle.textContent = 'Edit Counselor';
            modalSubtitle.textContent = 'Update counselor information.';
            counselorSubmitBtn.textContent = 'Update Counselor';

            const counselor = counselorsData.find(c => c.id === counselorId);
            if (counselor) {
                document.getElementById('counselor-name').value = counselor.name;
                document.getElementById('counselor-title').value = counselor.title;
                document.getElementById('counselor-email').value = counselor.email;
                document.getElementById('counselor-phone').value = counselor.phone;
                
                const availParts = counselor.availability.split(', ');
                document.getElementById('counselor-availability-days').value = availParts[0];
                document.getElementById('counselor-availability-time').value = availParts[1] || '';
            }
        } else {
            modalTitle.textContent = 'Add Counselor';
            modalSubtitle.textContent = 'Add a new counselor to the counseling unit staff.';
            counselorSubmitBtn.textContent = 'Add Counselor';
            
            // Clear form
            document.getElementById('counselor-name').value = '';
            document.getElementById('counselor-title').value = '';
            document.getElementById('counselor-email').value = '';
            document.getElementById('counselor-phone').value = '';
            document.getElementById('counselor-availability-days').value = '';
            document.getElementById('counselor-availability-time').value = '';
        }

        counselorModal.style.display = 'flex';
    }

    // Edit Counselor
    function editCounselor(counselorId) {
        openCounselorModal(true, counselorId);
    }

    // Delete Counselor Confirm
    function deleteCounselorConfirm(counselorId) {
        currentEditingCounselorId = counselorId;
        deleteModal.style.display = 'flex';
    }

    // Submit Counselor (Add or Edit) - Attached outside to ensure it always works
    function attachSubmitListener() {
        const submitBtn = document.getElementById('counselor-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                const name = document.getElementById('counselor-name').value.trim();
                const title = document.getElementById('counselor-title').value.trim();
                const email = document.getElementById('counselor-email').value.trim();
                const phone = document.getElementById('counselor-phone').value.trim();
                const days = document.getElementById('counselor-availability-days').value;
                const time = document.getElementById('counselor-availability-time').value;

                // Validation
                if (!name || !title || !email || !phone || !days || !time) {
                    alert('Please fill in all fields');
                    return;
                }

                const availability = `${days}, ${time}`;

                if (currentEditingCounselorId) {
                    // Update existing counselor
                    const counselor = counselorsData.find(c => c.id === currentEditingCounselorId);
                    if (counselor) {
                        counselor.name = name;
                        counselor.title = title;
                        counselor.email = email;
                        counselor.phone = phone;
                        counselor.availability = availability;
                    }
                    showSuccessNotification('Counselor edited successfully');
                } else {
                    // Add new counselor
                    const newCounselor = {
                        id: counselorsData.length > 0 ? Math.max(...counselorsData.map(c => c.id)) + 1 : 1,
                        name: name,
                        title: title,
                        activeCases: 0,
                        totalCases: 0,
                        email: email,
                        phone: phone,
                        availability: availability
                    };
                    counselorsData.push(newCounselor);
                    showSuccessNotification('Counselor added successfully');
                }

                // Save to localStorage
                saveCounselorsData();

                renderCounselors(counselorsData);
                counselorModal.style.display = 'none';
                currentEditingCounselorId = null;
            });
        }
    }
    
    // Attach the submit listener
    attachSubmitListener();

    // Delete Counselor
    if (btnDelete) {
        btnDelete.addEventListener('click', function() {
            counselorsData = counselorsData.filter(c => c.id !== currentEditingCounselorId);
            saveCounselorsData();
            renderCounselors(counselorsData);
            deleteModal.style.display = 'none';
            showSuccessNotification('Counselor deleted successfully');
            currentEditingCounselorId = null;
        });
    }

    // Search Counselors
    if (counselorSearch) {
        counselorSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filtered = counselorsData.filter(counselor => 
                counselor.name.toLowerCase().includes(searchTerm) ||
                counselor.email.toLowerCase().includes(searchTerm)
            );
            renderCounselors(filtered);
        });
    }

    // Close modals
    modalClose.forEach(btn => {
        btn.addEventListener('click', function() {
            counselorModal.style.display = 'none';
            deleteModal.style.display = 'none';
            currentEditingCounselorId = null;
        });
    });

    btnCancel.forEach(btn => {
        btn.addEventListener('click', function() {
            counselorModal.style.display = 'none';
            deleteModal.style.display = 'none';
            currentEditingCounselorId = null;
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === counselorModal || event.target === deleteModal) {
            counselorModal.style.display = 'none';
            deleteModal.style.display = 'none';
            currentEditingCounselorId = null;
        }
    });
}

// ========== ANNOUNCEMENTS PAGE FUNCTIONALITY ==========
const announcementsList = document.getElementById('announcements-list');
const btnNewAnnouncement = document.querySelector('.btn-new-announcement');
const announcementModal = document.getElementById('announcement-modal');
const deleteAnnouncementModal = document.getElementById('delete-announcement-modal');
const announcementSearch = document.getElementById('announcement-search');
const announcementSubmitBtn = document.getElementById('announcement-submit-btn');
const btnDeleteAnnouncement = document.querySelector('.btn-delete');

let announcementsData = [];
let currentEditingAnnouncementId = null;

// Initialize announcements data from localStorage or use default
function initializeAnnouncementsData() {
    const stored = localStorage.getItem('announcementsData');
    if (stored) {
        announcementsData = JSON.parse(stored);
    } else {
        announcementsData = [
            {
                id: 1,
                title: 'New Mental Health Workshops Available',
                content: 'We are excited to announce new mental health workshops starting next month. Topics include stress management, anxiety coping strategies, and building resilience. Sign up at the counseling office.',
                status: 'Published',
                date: '10/08/2025'
            },
            {
                id: 2,
                title: 'Career Fair Preparation Sessions',
                content: 'Join our career counselors for resume building and interview preparation sessions. Scheduled every Friday at 2:00 PM.',
                status: 'Published',
                date: '09/28/2025'
            },
            {
                id: 3,
                title: 'Office Hours Extended',
                content: 'Starting this week, our counseling office will be open until 7:00 PM on Wednesdays to accommodate students with evening classes.',
                status: 'Published',
                date: '08/15/2025'
            }
        ];
        saveAnnouncementsData();
    }
}

function saveAnnouncementsData() {
    localStorage.setItem('announcementsData', JSON.stringify(announcementsData));
}

// Only run announcements code if we're on the announcements page
if (announcementsList) {
    // Initialize data from localStorage
    initializeAnnouncementsData();
    renderAnnouncements(announcementsData);

    // New Announcement Button
    if (btnNewAnnouncement) {
        btnNewAnnouncement.addEventListener('click', function() {
            openAnnouncementModal(false);
        });
    }

    // Render announcements
    function renderAnnouncements(data) {
        announcementsList.innerHTML = '';

        if (data.length === 0) {
            announcementsList.innerHTML = '<div class="announcement-item empty"><p>No announcements found</p></div>';
            return;
        }

        data.forEach(announcement => {
            const item = document.createElement('div');
            item.className = 'announcement-item';
            item.innerHTML = `
                <div class="announcement-header">
                    <h3 class="announcement-title">${announcement.title}</h3>
                    <span class="announcement-status">${announcement.status}</span>
                </div>
                <p class="announcement-content">${announcement.content}</p>
                <p class="announcement-date">Posted: ${announcement.date}</p>
                <div class="announcement-actions">
                    <button class="btn-edit-announcement" data-id="${announcement.id}">Edit</button>
                    <button class="btn-delete-announcement" data-id="${announcement.id}">Delete</button>
                </div>
            `;
            announcementsList.appendChild(item);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.btn-edit-announcement').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editAnnouncement(parseInt(id));
            });
        });

        document.querySelectorAll('.btn-delete-announcement').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteAnnouncementConfirm(parseInt(id));
            });
        });
    }

    // Open Announcement Modal
    function openAnnouncementModal(isEdit, announcementId = null) {
        currentEditingAnnouncementId = announcementId;
        const modalTitle = document.getElementById('announcement-modal-title');
        const modalSubtitle = document.getElementById('announcement-modal-subtitle');

        if (isEdit) {
            modalTitle.textContent = 'Edit Announcement';
            modalSubtitle.textContent = 'Update announcement details';
            announcementSubmitBtn.textContent = 'Update Announcement';

            const announcement = announcementsData.find(a => a.id === announcementId);
            if (announcement) {
                document.getElementById('announcement-title').value = announcement.title;
                document.getElementById('announcement-content').value = announcement.content;
            }
        } else {
            modalTitle.textContent = 'Add Announcement';
            modalSubtitle.textContent = 'Post a new announcement for students to see';
            announcementSubmitBtn.textContent = 'Publish Announcement';

            // Clear form
            document.getElementById('announcement-title').value = '';
            document.getElementById('announcement-content').value = '';
        }

        announcementModal.style.display = 'flex';
    }

    // Edit Announcement
    function editAnnouncement(announcementId) {
        openAnnouncementModal(true, announcementId);
    }

    // Delete Announcement Confirm
    function deleteAnnouncementConfirm(announcementId) {
        currentEditingAnnouncementId = announcementId;
        deleteAnnouncementModal.style.display = 'flex';
    }

    // Submit Announcement (Add or Edit)
    function attachAnnouncementSubmitListener() {
        const submitBtn = document.getElementById('announcement-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                const title = document.getElementById('announcement-title').value.trim();
                const content = document.getElementById('announcement-content').value.trim();

                // Validation
                if (!title || !content) {
                    alert('Please fill in all fields');
                    return;
                }

                // Get today's date
                const today = new Date();
                const dateStr = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

                if (currentEditingAnnouncementId) {
                    // Update existing announcement
                    const announcement = announcementsData.find(a => a.id === currentEditingAnnouncementId);
                    if (announcement) {
                        announcement.title = title;
                        announcement.content = content;
                    }
                    showSuccessNotification('Announcement edited successfully');
                } else {
                    // Add new announcement
                    const newAnnouncement = {
                        id: announcementsData.length > 0 ? Math.max(...announcementsData.map(a => a.id)) + 1 : 1,
                        title: title,
                        content: content,
                        status: 'Published',
                        date: dateStr
                    };
                    announcementsData.push(newAnnouncement);
                    showSuccessNotification('Announcement added successfully');
                }

                // Save to localStorage
                saveAnnouncementsData();

                renderAnnouncements(announcementsData);
                announcementModal.style.display = 'none';
                currentEditingAnnouncementId = null;
            });
        }
    }

    // Attach announcement submit listener
    attachAnnouncementSubmitListener();

    // Delete Announcement
    if (btnDeleteAnnouncement) {
        btnDeleteAnnouncement.addEventListener('click', function() {
            announcementsData = announcementsData.filter(a => a.id !== currentEditingAnnouncementId);
            saveAnnouncementsData();
            renderAnnouncements(announcementsData);
            deleteAnnouncementModal.style.display = 'none';
            showSuccessNotification('Announcement deleted successfully');
            currentEditingAnnouncementId = null;
        });
    }

    // Search Announcements
    if (announcementSearch) {
        announcementSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filtered = announcementsData.filter(announcement =>
                announcement.title.toLowerCase().includes(searchTerm) ||
                announcement.content.toLowerCase().includes(searchTerm)
            );
            renderAnnouncements(filtered);
        });
    }

    // Close modals
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const cancelButtons = document.querySelectorAll('.btn-cancel');

    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            announcementModal.style.display = 'none';
            deleteAnnouncementModal.style.display = 'none';
            currentEditingAnnouncementId = null;
        });
    });

    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            announcementModal.style.display = 'none';
            deleteAnnouncementModal.style.display = 'none';
            currentEditingAnnouncementId = null;
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === announcementModal || event.target === deleteAnnouncementModal) {
            announcementModal.style.display = 'none';
            deleteAnnouncementModal.style.display = 'none';
            currentEditingAnnouncementId = null;
        }
    });
}