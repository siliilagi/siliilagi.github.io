// main.js
console.log("JavaScript is working!");

// Inject header
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;

        // Only run hero scroll observer on pages that have .home
        const nav = document.querySelector('.site-nav');
        const hero = document.querySelector('.home');
        if (nav && hero) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) {
                        nav.classList.add('show');
                    } else {
                        nav.classList.remove('show');
                    }
                },
                { threshold: 0 }
            );
            observer.observe(hero);
        } else if (nav) {
            // Pages without hero — show nav immediately
            nav.classList.add('show');
        }
    });

window.addEventListener('scroll', function () {
    const hero = document.querySelector('.hero');
    if (window.scrollY > 80) {
        hero.classList.add('shrunk');
    } else {
        hero.classList.remove('shrunk');
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