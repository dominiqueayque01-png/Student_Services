// Handle sidebar navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(i => {
            i.classList.remove('active');
        });

        // Add active class to clicked item
        this.classList.add('active');

        const page = this.getAttribute('data-page');

        // Navigate to different pages
        if (page === 'overview') {
            // Stay on overview page
            window.location.href = 'index.html';
        } else if (page === 'job-listings') {
            window.location.href = 'job-listings.html';
        } else if (page === 'analytics') {
            window.location.href = 'analytics.html';
        }
    });
});

// Handle logout
document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        // Redirect to login page or home
        window.location.href = '../../index.html';
    }
});

console.log('OJT Dashboard initialized');
