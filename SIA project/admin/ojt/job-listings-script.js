// Sample job listings data
let jobListings = [
    {
        id: 1,
        title: "Social Media Assistant",
        company: "ABC Company",
        overview: "Join our marketing team to learn social media strategy, content creation, and digital marketing analytics while working on real client campaigns.",
        rate: 50,
        location: "Remote/Hybrid",
        duration: "8 weeks",
        hours: 10,
        applicants: 10,
        category: "Digital Marketing",
        worktype: "Remote",
        program: "Summer OJT 2025",
        website: "https://abc-company.com",
        email: "hr@abc-company.com",
        status: "Active"
    },
    {
        id: 2,
        title: "Marketing Assistant",
        company: "XYZ Company",
        overview: "Join our marketing team to learn social media strategy, content creation, and digital marketing analytics while working on real client campaigns.",
        rate: 30,
        location: "On Site",
        duration: "7 weeks",
        hours: 10,
        applicants: 18,
        category: "Digital Marketing",
        worktype: "On Site",
        program: "Summer OJT 2025",
        website: "https://xyz-company.com",
        email: "careers@xyz-company.com",
        status: "Active"
    }
];

let currentEditingId = null;
let currentDeletingId = null;

const jobModalOverlay = document.getElementById('job-modal-overlay');
const jobModalTitle = document.getElementById('job-modal-title');
const jobModalSubtitle = document.getElementById('job-modal-subtitle');
const deleteModalOverlay = document.getElementById('delete-modal-overlay');
const jobForm = document.getElementById('job-form');
const validationMessage = document.getElementById('validation-message');

const jobTitleInput = document.getElementById('job-title');
const jobCompanyInput = document.getElementById('job-company');
const jobOverviewInput = document.getElementById('job-overview');
const jobRateInput = document.getElementById('job-rate');
const jobLocationInput = document.getElementById('job-location');
const jobDurationInput = document.getElementById('job-duration');
const jobHoursInput = document.getElementById('job-hours');
const jobCategoryInput = document.getElementById('job-category');
const jobWorktypeInput = document.getElementById('job-worktype');
const jobProgramInput = document.getElementById('job-program');
const jobWebsiteInput = document.getElementById('job-website');
const jobEmailInput = document.getElementById('job-email');

// Render job listings
function renderJobListings() {
    const container = document.getElementById('job-listings-container');
    
    if (jobListings.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No job listings yet. Click "Create Club" to add one.</p></div>';
        return;
    }

    container.innerHTML = jobListings.map(job => `
        <div class="job-card">
            <div class="job-card-header">
                <div class="job-card-title-section">
                    <p class="job-card-title">${job.title}</p>
                    <p class="job-card-company">${job.company} • ${job.category}</p>
                </div>
                <span class="job-card-status active">${job.status}</span>
            </div>
            <p class="job-card-description">${job.overview}</p>
            <div class="job-card-meta">
                <div class="job-meta-item rate">💰 ${job.rate}/hour</div>
                <div class="job-meta-item location">📍 ${job.location}</div>
                <div class="job-meta-item applicants">👥 ${job.applicants} applicants</div>
                <div class="job-meta-item duration">📅 ${job.duration}</div>
                <div class="job-meta-item hours">⏰ ${job.hours} hours/week</div>
            </div>
            <div class="job-card-actions">
                <button class="btn-icon btn-edit" onclick="editJob(${job.id})" title="Edit">✏️</button>
                <button class="btn-pause ${job.status === 'Paused' ? 'paused' : ''}" onclick="toggleJobStatus(${job.id})">${job.status === 'Active' ? 'Pause' : 'Active'}</button>
                <button class="btn-icon btn-delete" onclick="openDeleteModal(${job.id})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Open create job modal
document.getElementById('btn-create-job').addEventListener('click', function() {
    currentEditingId = null;
    jobModalTitle.textContent = 'Create Job Listing';
    jobModalSubtitle.textContent = 'Create job details and requirements.';
    jobForm.reset();
    validationMessage.style.display = 'none';
    document.getElementById('job-modal-submit').textContent = 'Create Job Listing';
    jobModalOverlay.classList.add('active');
});

// Edit job
function editJob(id) {
    const job = jobListings.find(j => j.id === id);
    if (job) {
        currentEditingId = id;
        jobModalTitle.textContent = 'Edit Job Listing';
        jobModalSubtitle.textContent = 'Update job details and requirements.';
        
        jobTitleInput.value = job.title;
        jobCompanyInput.value = job.company;
        jobOverviewInput.value = job.overview;
        jobRateInput.value = job.rate;
        jobLocationInput.value = job.location;
        jobDurationInput.value = job.duration;
        jobHoursInput.value = job.hours;
        jobCategoryInput.value = job.category;
        jobWorktypeInput.value = job.worktype;
        jobProgramInput.value = job.program;
        jobWebsiteInput.value = job.website;
        jobEmailInput.value = job.email;
        
        validationMessage.style.display = 'none';
        document.getElementById('job-modal-submit').textContent = 'Update Job Listing';
        jobModalOverlay.classList.add('active');
    }
}

// Toggle job status (Active/Paused)
function toggleJobStatus(id) {
    const job = jobListings.find(j => j.id === id);
    if (job) {
        job.status = job.status === 'Active' ? 'Paused' : 'Active';
        renderJobListings();
    }
}

// Save job listing
document.getElementById('job-modal-submit').addEventListener('click', function() {
    if (!validateForm()) {
        validationMessage.style.display = 'block';
        return;
    }

    validationMessage.style.display = 'none';

    const newJob = {
        id: currentEditingId || Math.max(...jobListings.map(j => j.id), 0) + 1,
        title: jobTitleInput.value.trim(),
        company: jobCompanyInput.value.trim(),
        overview: jobOverviewInput.value.trim(),
        rate: parseInt(jobRateInput.value),
        location: jobLocationInput.value.trim(),
        duration: jobDurationInput.value.trim(),
        hours: parseInt(jobHoursInput.value),
        applicants: currentEditingId ? jobListings.find(j => j.id === currentEditingId).applicants : 0,
        category: jobCategoryInput.value,
        worktype: jobWorktypeInput.value,
        program: jobProgramInput.value.trim(),
        website: jobWebsiteInput.value.trim(),
        email: jobEmailInput.value.trim(),
        status: currentEditingId ? jobListings.find(j => j.id === currentEditingId).status : 'Active'
    };

    if (currentEditingId) {
        const index = jobListings.findIndex(j => j.id === currentEditingId);
        jobListings[index] = newJob;
    } else {
        jobListings.unshift(newJob);
    }

    renderJobListings();
    jobModalOverlay.classList.remove('active');
    jobForm.reset();
    currentEditingId = null;
});

// Validate form
function validateForm() {
    return jobTitleInput.value.trim() !== '' &&
           jobCompanyInput.value.trim() !== '' &&
           jobOverviewInput.value.trim() !== '' &&
           jobRateInput.value !== '' &&
           jobLocationInput.value.trim() !== '' &&
           jobDurationInput.value.trim() !== '' &&
           jobHoursInput.value !== '' &&
           jobCategoryInput.value !== '' &&
           jobWorktypeInput.value !== '' &&
           jobProgramInput.value.trim() !== '' &&
           jobWebsiteInput.value.trim() !== '' &&
           jobEmailInput.value.trim() !== '';
}

// Open delete modal
function openDeleteModal(id) {
    currentDeletingId = id;
    deleteModalOverlay.classList.add('active');
}

// Delete job
document.getElementById('delete-modal-confirm').addEventListener('click', function() {
    jobListings = jobListings.filter(j => j.id !== currentDeletingId);
    renderJobListings();
    deleteModalOverlay.classList.remove('active');
    currentDeletingId = null;
});

// Close modals
document.getElementById('job-modal-close').addEventListener('click', function() {
    jobModalOverlay.classList.remove('active');
    jobForm.reset();
    validationMessage.style.display = 'none';
});

document.getElementById('job-modal-cancel').addEventListener('click', function() {
    jobModalOverlay.classList.remove('active');
    jobForm.reset();
    validationMessage.style.display = 'none';
});

document.getElementById('delete-modal-close').addEventListener('click', function() {
    deleteModalOverlay.classList.remove('active');
});

document.getElementById('delete-modal-cancel').addEventListener('click', function() {
    deleteModalOverlay.classList.remove('active');
});

// Close on overlay click
jobModalOverlay.addEventListener('click', function(e) {
    if (e.target === jobModalOverlay) {
        jobModalOverlay.classList.remove('active');
        jobForm.reset();
        validationMessage.style.display = 'none';
    }
});

deleteModalOverlay.addEventListener('click', function(e) {
    if (e.target === deleteModalOverlay) {
        deleteModalOverlay.classList.remove('active');
    }
});

// Initialize
renderJobListings();
