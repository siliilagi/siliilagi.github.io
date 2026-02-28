// main.js
console.log("JavaScript is working!");

// Inject header
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;

        const nav = document.querySelector('.site-nav');
        const heroEl = document.querySelector('.hero');

        if (nav && !heroEl) {
            // Pages without a hero — show nav immediately
            nav.classList.add('show');
        }
    });

    window.addEventListener('scroll', function () {
        const hero = document.querySelector('.hero');
        const pageSheet = document.querySelector('.page-sheet');
        if (!hero || !pageSheet) return;
    
        if (window.scrollY > 80) {
            hero.classList.add('shrunk');
            pageSheet.style.marginTop = '70px';
        } else {
            hero.classList.remove('shrunk');
            pageSheet.style.marginTop = '100vh';
        }
    });

fetch('footer.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

function scrollCarousel(direction) {
    const carousel = document.getElementById("skillsCarousel");
    const scrollAmount = 300;
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth"
    });
}


// Auto-play videos when they come into view (muted)
// Play sound only on hover
document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.instagram-video');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Video needs to be 50% visible to play
    };

    const videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                // Play video muted when it enters viewport
                video.muted = true;
                video.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                });
            } else {
                // Pause video when it leaves viewport
                video.pause();
                video.muted = true; // Ensure it's muted when out of view
            }
        });
    }, observerOptions);

    // Observe all videos
    videos.forEach(video => {
        videoObserver.observe(video);

        // Add hover event listeners for sound
        video.addEventListener('mouseenter', function () {
            this.muted = false; // Unmute on hover
        });

        video.addEventListener('mouseleave', function () {
            this.muted = true; // Mute when hover ends
        });
    });
});