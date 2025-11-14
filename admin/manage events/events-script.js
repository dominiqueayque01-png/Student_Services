// ========== EVENTS PAGE FUNCTIONALITY ==========
const activeEventsGrid = document.getElementById('active-events');
const archivedEventsGrid = document.getElementById('archived-events');
const btnCreateEvent = document.querySelector('.btn-create-event');
const eventModal = document.getElementById('event-modal');
const deleteEventModal = document.getElementById('delete-event-modal');
const eventSearch = document.getElementById('event-search');
const eventFilter = document.getElementById('event-filter');
const eventPublishBtn = document.getElementById('event-publish-btn');
const tabButtons = document.querySelectorAll('.tab-button');
const btnDeleteEvent = document.querySelector('#delete-event-modal .btn-delete');

let eventsData = [];
let currentEditingEventId = null;
let currentDeletingEventId = null;

// Initialize events data from localStorage
function initializeEventsData() {
    const stored = localStorage.getItem('eventsData');
    if (stored) {
        eventsData = JSON.parse(stored);
    } else {
        eventsData = [
            {
                id: 1,
                title: 'Tech Talk: IT Summit',
                category: 'Academic',
                date: '2025-09-16',
                time: '14:00',
                location: 'QCU Auditorium',
                capacity: 200,
                registered: 156,
                organizer: 'QCU IT Department',
                about: 'Join us for an exciting tech summit featuring industry leaders and innovative discussions. This event will cover the latest trends in information technology, including artificial intelligence, cloud computing, cybersecurity, and digital transformation. Participants will gain valuable insights from expert speakers and have the chance to connect with fellow IT professionals and students.',
                requirements: 'Bring your laptop for hands-on workshops',
                status: 'Active',
                keywords: ['Technology', 'Networking', 'Professional Development'],
                expectations: ['Expert speakers from the industry', 'Hands-on workshops and activities', 'Networking opportunities', 'Certificate of participation'],
                agenda: [
                    { time: '02:00 PM - 2:30 PM', title: 'Registration and Networking' },
                    { time: '2:30 PM - 4:45 PM', title: 'Keynote Speech: The Future of AI' },
                    { time: '4:45 PM - 5:00 PM', title: 'Q&A and Closing Remarks' }
                ],
                banner: 'https://via.placeholder.com/800x300?text=Tech+Talk+IT+Summit'
            },
            {
                id: 2,
                title: 'Schedule Adjustment',
                category: 'Institutional',
                date: '2025-09-16',
                time: '14:00',
                location: 'QCU Gymnasium',
                capacity: 200,
                registered: 156,
                organizer: 'QCU Admin Office',
                about: 'Important schedule adjustment for this academic year.',
                requirements: '',
                status: 'Archived',
                keywords: ['Announcement', 'Schedule'],
                expectations: ['Updated schedule information', 'Q&A session'],
                agenda: [
                    { time: '02:00 PM - 2:30 PM', title: 'Schedule Overview' },
                    { time: '2:30 PM - 3:00 PM', title: 'Q&A' }
                ],
                banner: 'https://via.placeholder.com/800x300?text=Schedule+Adjustment'
            }
        ];
        saveEventsData();
    }
}

function saveEventsData() {
    localStorage.setItem('eventsData', JSON.stringify(eventsData));
}

// Render events
function renderEvents() {
    if (!activeEventsGrid || !archivedEventsGrid) return;

    const activeEvents = eventsData.filter(e => e.status === 'Active');
    const archivedEvents = eventsData.filter(e => e.status === 'Archived');

    // Update counts
    document.getElementById('active-count').textContent = activeEvents.length;
    document.getElementById('archived-count').textContent = archivedEvents.length;

    // Render active events
    activeEventsGrid.innerHTML = '';
    if (activeEvents.length === 0) {
        activeEventsGrid.innerHTML = '<p style="color: #999;">No active events</p>';
    } else {
        activeEvents.forEach(event => {
            activeEventsGrid.appendChild(createEventCard(event));
        });
    }

    // Render archived events
    archivedEventsGrid.innerHTML = '';
    if (archivedEvents.length === 0) {
        archivedEventsGrid.innerHTML = '<p style="color: #999;">No archived events</p>';
    } else {
        archivedEvents.forEach(event => {
            archivedEventsGrid.appendChild(createEventCard(event));
        });
    }

    attachEventCardListeners();
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const capacityPercent = (event.registered / event.capacity) * 100;
    
    card.innerHTML = `
        <div class="event-title-section">
            <h3 class="event-title">${event.title}</h3>
            <span class="event-category ${event.category}">${event.category}</span>
        </div>
        <p class="event-organizer">${event.organizer}</p>
        <div class="event-meta">
            <div class="event-meta-item">
                <span>📅 ${formatDate(event.date)}</span>
            </div>
            <div class="event-meta-item">
                <span>⏰ ${formatTime(event.time)} - 5:00 PM</span>
            </div>
            <div class="event-meta-item">
                <span>📍 ${event.location}</span>
            </div>
            <div class="event-meta-item">
                <span>👥 ${event.registered}/${event.capacity} registered</span>
            </div>
        </div>
        <div class="event-capacity">
            <div class="capacity-bar">
                <div class="capacity-fill" style="width: ${capacityPercent}%; background-color: ${capacityPercent > 70 ? '#ffc107' : '#4CAF50'};"></div>
            </div>
            <p style="font-size: 10px; color: #999; margin-top: 4px;">${event.capacity - event.registered} slots remaining &nbsp;&nbsp; ${Math.round(capacityPercent)}% Full</p>
        </div>
        <div class="event-actions">
            <button class="btn-edit" data-id="${event.id}">Edit</button>
            <button class="btn-archive" data-id="${event.id}">${event.status === 'Active' ? 'Archive' : 'Unarchive'}</button>
            <button class="btn-delete" data-id="${event.id}">Delete</button>
        </div>
    `;

    // Click to view details
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn-edit') && 
            !e.target.classList.contains('btn-archive') && 
            !e.target.classList.contains('btn-delete')) {
            viewEventDetails(event.id);
        }
    });

    return card;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${String(displayHour).padStart(2, '0')}:${minutes} ${ampm}`;
}

function attachEventCardListeners() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            editEvent(id);
        });
    });

    document.querySelectorAll('.btn-archive').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            toggleArchive(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            deleteEventConfirm(id);
        });
    });
}

function toggleArchive(id) {
    const event = eventsData.find(e => e.id === id);
    if (event) {
        event.status = event.status === 'Active' ? 'Archived' : 'Active';
        saveEventsData();
        renderEvents();
        showSuccessNotification(event.status === 'Active' ? 'Event unarchived' : 'Event archived');
    }
}

function deleteEventConfirm(id) {
    currentDeletingEventId = id;
    deleteEventModal.style.display = 'flex';
}

function viewEventDetails(id) {
    // Store the event ID and redirect
    sessionStorage.setItem('currentEventId', id);
    window.location.href = 'event-details.html';
}

// Only initialize if on events page
if (activeEventsGrid && archivedEventsGrid) {
    initializeEventsData();
    renderEvents();

    // Check if we're coming back from edit
    const editEventId = sessionStorage.getItem('editEventId');
    if (editEventId) {
        sessionStorage.removeItem('editEventId');
        setTimeout(() => {
            openEventModal(true, parseInt(editEventId));
        }, 100);
    }

    if (btnCreateEvent) {
        btnCreateEvent.addEventListener('click', function() {
            openEventModal(false);
        });
    }

    function openEventModal(isEdit, eventId = null) {
        currentEditingEventId = eventId;
        const modalTitle = document.getElementById('event-modal-title');
        const modalSubtitle = document.getElementById('event-modal-subtitle');

        if (isEdit && eventId) {
            modalTitle.textContent = 'Edit Event';
            modalSubtitle.textContent = 'Update the event details below';
            eventPublishBtn.textContent = 'Save Changes';

            const event = eventsData.find(e => e.id === eventId);
            if (event) {
                document.getElementById('event-title').value = event.title;
                document.getElementById('event-category').value = event.category;
                document.getElementById('event-date').value = event.date;
                document.getElementById('event-time').value = event.time;
                document.getElementById('event-location').value = event.location;
                document.getElementById('event-capacity').value = event.capacity;
                document.getElementById('event-organizer').value = event.organizer;
                document.getElementById('event-about').value = event.about;
                document.getElementById('event-requirements').value = event.requirements;
                document.getElementById('event-status').value = event.registered > 0 ? 'Required' : 'Optional';

                // Clear and repopulate agenda
                const agendaList = document.getElementById('agenda-list');
                agendaList.innerHTML = '';
                event.agenda.forEach((item, index) => {
                    const agendaItem = document.createElement('div');
                    agendaItem.className = 'agenda-item';
                    const [time, date] = item.time.split(' - ');
                    agendaItem.innerHTML = `
                        <input type="time" class="agenda-time" value="${time.split(' ')[0]}" placeholder="Time">
                        <input type="text" class="agenda-title" value="${item.title}" placeholder="Title">
                        <button class="btn-remove-agenda" type="button">×</button>
                    `;
                    agendaList.appendChild(agendaItem);
                });
            }
        } else {
            modalTitle.textContent = 'Create New Event';
            modalSubtitle.textContent = 'Fill in the details to create a new campus event.';
            eventPublishBtn.textContent = 'Publish Event';

            // Clear form
            document.getElementById('event-title').value = '';
            document.getElementById('event-category').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-time').value = '';
            document.getElementById('event-location').value = '';
            document.getElementById('event-capacity').value = '';
            document.getElementById('event-organizer').value = '';
            document.getElementById('event-about').value = '';
            document.getElementById('event-requirements').value = '';
            document.getElementById('event-status').value = 'Required';

            // Reset agenda
            const agendaList = document.getElementById('agenda-list');
            agendaList.innerHTML = `
                <div class="agenda-item">
                    <input type="time" class="agenda-time" placeholder="Time">
                    <input type="text" class="agenda-title" placeholder="e.g., Registration">
                    <button class="btn-remove-agenda" type="button">×</button>
                </div>
            `;
        }

        eventModal.style.display = 'flex';
    }

    function editEvent(eventId) {
        openEventModal(true, eventId);
    }

    // Add agenda item
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-agenda')) {
            e.preventDefault();
            const agendaList = document.getElementById('agenda-list');
            const agendaItem = document.createElement('div');
            agendaItem.className = 'agenda-item';
            agendaItem.innerHTML = `
                <input type="time" class="agenda-time" placeholder="Time">
                <input type="text" class="agenda-title" placeholder="e.g., Registration">
                <button class="btn-remove-agenda" type="button">×</button>
            `;
            agendaList.appendChild(agendaItem);
        }

        if (e.target.classList.contains('btn-remove-agenda')) {
            e.preventDefault();
            e.target.parentElement.remove();
        }
    });

    // Publish Event
    if (eventPublishBtn) {
        eventPublishBtn.addEventListener('click', function() {
            const title = document.getElementById('event-title').value.trim();
            const category = document.getElementById('event-category').value;
            const date = document.getElementById('event-date').value;
            const time = document.getElementById('event-time').value;
            const location = document.getElementById('event-location').value.trim();
            const capacity = parseInt(document.getElementById('event-capacity').value);
            const organizer = document.getElementById('event-organizer').value.trim();
            const about = document.getElementById('event-about').value.trim();

            if (!title || !category || !date || !time || !location || !capacity || !organizer || !about) {
                alert('Please fill in all required fields');
                return;
            }

            // Collect agenda
            const agenda = [];
            document.querySelectorAll('.agenda-item').forEach(item => {
                const agendaTime = item.querySelector('.agenda-time').value;
                const agendaTitle = item.querySelector('.agenda-title').value;
                if (agendaTime && agendaTitle) {
                    agenda.push({ time: agendaTime, title: agendaTitle });
                }
            });

            if (agenda.length === 0) {
                alert('Please add at least one agenda item');
                return;
            }

            if (currentEditingEventId) {
                // Update existing event
                const event = eventsData.find(e => e.id === currentEditingEventId);
                if (event) {
                    event.title = title;
                    event.category = category;
                    event.date = date;
                    event.time = time;
                    event.location = location;
                    event.capacity = capacity;
                    event.organizer = organizer;
                    event.about = about;
                    event.requirements = document.getElementById('event-requirements').value;
                    event.agenda = agenda;
                }
                showSuccessNotification('Event updated successfully');
            } else {
                // Create new event
                const newEvent = {
                    id: eventsData.length > 0 ? Math.max(...eventsData.map(e => e.id)) + 1 : 1,
                    title,
                    category,
                    date,
                    time,
                    location,
                    capacity,
                    registered: 0,
                    organizer,
                    about,
                    requirements: document.getElementById('event-requirements').value,
                    status: 'Active',
                    keywords: ['Event'],
                    expectations: ['Great experience'],
                    agenda,
                    banner: 'https://via.placeholder.com/800x300?text=Event'
                };
                eventsData.push(newEvent);
                showSuccessNotification('Event published successfully');
            }

            saveEventsData();
            renderEvents();
            eventModal.style.display = 'none';
            currentEditingEventId = null;
        });
    }

    // Delete Event
    if (btnDeleteEvent) {
        btnDeleteEvent.addEventListener('click', function() {
            eventsData = eventsData.filter(e => e.id !== currentDeletingEventId);
            saveEventsData();
            renderEvents();
            deleteEventModal.style.display = 'none';
            showSuccessNotification('Event deleted successfully');
            currentDeletingEventId = null;
        });
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            eventModal.style.display = 'none';
            deleteEventModal.style.display = 'none';
            currentEditingEventId = null;
            currentDeletingEventId = null;
        });
    });

    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            eventModal.style.display = 'none';
            deleteEventModal.style.display = 'none';
            currentEditingEventId = null;
            currentDeletingEventId = null;
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === eventModal || event.target === deleteEventModal) {
            eventModal.style.display = 'none';
            deleteEventModal.style.display = 'none';
            currentEditingEventId = null;
            currentDeletingEventId = null;
        }
    });
}

// ========== EVENT DETAILS PAGE FUNCTIONALITY ==========
const eventDetailsView = document.querySelector('.event-details-view');
if (eventDetailsView) {
    initializeEventsData();
    const eventId = parseInt(sessionStorage.getItem('currentEventId'));
    if (eventId) {
        const event = eventsData.find(e => e.id === eventId);
        if (event) {
            displayEventDetails(event);
        }
    }

    function displayEventDetails(event) {
        document.getElementById('detail-title').textContent = event.title;
        document.getElementById('detail-category').textContent = event.category;
        document.getElementById('detail-banner').src = event.banner;
        document.getElementById('detail-date').textContent = formatDate(event.date);
        document.getElementById('detail-time').textContent = formatTime(event.time) + ' - 5:00 PM';
        document.getElementById('detail-location').textContent = event.location;
        document.getElementById('detail-attendance').textContent = event.registered + '/' + event.capacity;
        document.getElementById('detail-about').textContent = event.about;
        document.getElementById('detail-capacity-info').textContent = event.registered + ' is participating';
        document.getElementById('detail-capacity-text').textContent = (event.capacity - event.registered) + ' slots remaining';
        document.getElementById('detail-requirements').textContent = event.requirements;

        // Update capacity bar
        const capacityPercent = (event.registered / event.capacity) * 100;
        document.querySelector('.capacity-fill-detail').style.width = capacityPercent + '%';

        // Populate expectations
        const expectationsList = document.getElementById('detail-expectations');
        expectationsList.innerHTML = '';
        event.expectations.forEach(exp => {
            const li = document.createElement('li');
            li.textContent = exp;
            expectationsList.appendChild(li);
        });

        // Populate agenda
        const agendaSection = document.getElementById('detail-agenda');
        agendaSection.innerHTML = '';
        event.agenda.forEach((item, index) => {
            const agendaDiv = document.createElement('div');
            agendaDiv.className = 'agenda-item-detail';
            agendaDiv.innerHTML = `
                <div class="agenda-number">${index + 1}</div>
                <div class="agenda-content">
                    <p class="agenda-time-detail">${item.time}</p>
                    <p class="agenda-title-detail">${item.title}</p>
                </div>
            `;
            agendaSection.appendChild(agendaDiv);
        });

        // Save Changes button - redirects back to events with edit flag
        document.querySelector('.btn-save-changes').addEventListener('click', function() {
            sessionStorage.setItem('editEventId', eventId);
            window.location.href = 'events.html';
        });

        // Edit button
        document.querySelector('.btn-edit-event').addEventListener('click', function() {
            sessionStorage.setItem('editEventId', eventId);
            window.location.href = 'events.html';
        });

        // Delete button
        document.querySelector('.btn-delete-event').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this event?')) {
                eventsData = eventsData.filter(e => e.id !== eventId);
                saveEventsData();
                window.location.href = 'events.html';
            }
        });

        // Cancel button
        document.querySelector('.btn-cancel-details').addEventListener('click', function() {
            window.location.href = 'events.html';
        });
    }
}

// Success notification
function showSuccessNotification(message) {
    const notification = document.createElement('div');
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
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(function() {
        notification.remove();
    }, 3000);
}

// Navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        if (page === 'events') {
            window.location.href = 'events.html';
        }
    });
});

// Logout
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });
}
