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
        const hero   = document.querySelector('.hero');
        const spacer = document.querySelector('.hero-spacer');
        if (!hero || !spacer) return;
    
        if (window.scrollY > 80) {
            hero.classList.add('shrunk');
            spacer.classList.add('shrunk');
        } else {
            hero.classList.remove('shrunk');
            spacer.classList.remove('shrunk');
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

// ============================================================
// TYPING ANIMATION
// ============================================================

const phrases = [
    "Front-End Developer.",
    "CS Graduate from BYU-Hawaiʻi.",
    "Based in American Fork, Utah.",
    "Born and Raised in Hāna, Maui.",
    "Health & Fitness Advocate",
    "Building for community impact.",
];

let phraseIndex  = 0;  // which phrase we're on
let charIndex    = 0;  // which character we're on
let isDeleting   = false;  // are we typing or deleting?

const typedEl = document.getElementById('typed-text');

function type() {
    // If element doesn't exist (other pages), stop
    if (!typedEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Remove one character
        typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
    } else {
        // Add one character
        typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
    }

    // Typing speed: slower when typing, faster when deleting
    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing — pause at end before deleting
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;  // brief pause before typing next phrase
    }

    setTimeout(type, speed);
}

// Start the animation
type();

// ============================================================
// READ MORE TOGGLE
// ============================================================

const readMoreBtn = document.getElementById('readMoreBtn');
const aboutMore   = document.querySelector('.about-more');

if (readMoreBtn && aboutMore) {
    readMoreBtn.addEventListener('click', function () {

        // Toggle the expanded class on the content
        aboutMore.classList.toggle('expanded');

        // Toggle the open class on the button (flips arrow)
        readMoreBtn.classList.toggle('open');

        // Change button text
        const isOpen = aboutMore.classList.contains('expanded');
        readMoreBtn.querySelector('.btn-arrow').textContent = '↓';
        readMoreBtn.childNodes[0].textContent = isOpen ? 'Read less ' : 'Read more ';
    });
}

// ============================================================
// PROJECT DATA
// ============================================================

const projects = [
    {
        id: 1,
        title: "Hāna Health Platform",
        summary: "A community health tool for residents of Hāna, Maui.",
        tags: ["HTML", "CSS", "JavaScript"],
        detail: `A platform designed to help residents of Hāna, Maui set 
        health goals, plan movement and nutrition, and make the most of 
        local resources. Built to be accessible, culturally grounded, and 
        adaptable to real-life constraints of a rural community.`,
        status: "In Progress"
    },
    {
        id: 2,
        title: "Portfolio Website",
        summary: "This site — built from scratch with no frameworks.",
        tags: ["HTML", "CSS", "JavaScript"],
        detail: `Designed and built entirely from scratch using vanilla HTML, 
        CSS, and JavaScript. Features a shrinking hero header, typing 
        animation, read-more toggle, filterable projects, and modal overlays 
        — all without any libraries or frameworks.`,
        status: "Live"
    },
    {
        id: 3,
        title: "Health & Fitness Content",
        summary: "Fitness coaching videos and health advocacy content on Instagram.",
        tags: ["Content Creation", "Health & Fitness"],
        detail: `Fitness and wellness content created for social media, 
        focused on accessible health guidance and movement. 
        Follow along on Instagram for the latest videos.`,
        status: "Ongoing"
    },
    // Add more projects here as you build them
];

// ============================================================
// PROJECT CARDS + MODAL
// ============================================================

const projectsGrid = document.getElementById('projectsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalTitle   = document.getElementById('modalTitle');
const modalTags    = document.getElementById('modalTags');
const modalStatus  = document.getElementById('modalStatus');
const modalDetail  = document.getElementById('modalDetail');

// BUILD CARDS
// BUILD CARDS
function buildCards(filter = 'all') {
    if (!projectsGrid) return;

    const filtered = filter === 'all'
        ? projects
        : projects.filter(p => p.tags.includes(filter));

    projectsGrid.innerHTML = '';

    // Show message if no projects match
    if (filtered.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <p>No projects yet for this category.</p>
                <p>Check back soon — I'm always building.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <div class="card-tags">
                ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="card-footer">
                <span class="card-status">${project.status}</span>
                <button class="view-btn">View Details</button>
            </div>
        `;
        card.addEventListener('click', () => openModal(project));
        projectsGrid.appendChild(card);
    });
}

// OPEN MODAL
function openModal(project) {
    // Populate modal with this project's data
    modalTitle.textContent  = project.title;
    modalStatus.textContent = project.status;
    modalDetail.textContent = project.detail;
    modalTags.innerHTML = project.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('');

    // Show the modal
    modalOverlay.classList.add('open');

    // Prevent background from scrolling
    document.body.style.overflow = 'hidden';
}

// CLOSE MODAL
function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Close on X button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close when clicking the dark overlay behind the modal box
if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeModal();
    });
}

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// Build the cards on page load
buildCards();

// ============================================================
// FILTER BUTTONS
// ============================================================

const filterBtns = document.querySelectorAll('.filter-btn');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {

            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to the clicked button
            this.classList.add('active');

            // Get the filter value from data-filter attribute
            const filter = this.getAttribute('data-filter');

            // Rebuild the cards with the new filter
            buildCards(filter);
        });
    });
}

// ============================================================
// PROGRESS BAR ANIMATION
// ============================================================

const progressBars = document.querySelectorAll('.building-progress');

if (progressBars.length > 0) {
    const barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Read the target width from the inline style
                const target = entry.target.style.width;

                // Start from 0
                entry.target.style.width = '0%';

                // Animate to target after a brief delay
                setTimeout(() => {
                    entry.target.style.width = target;
                }, 100);

                // Stop observing once animated
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => barObserver.observe(bar));
}

// ============================================================
// CONTACT FORM CONFIRMATION
// ============================================================

const contactForm    = document.getElementById('contactForm');
const formSuccess    = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', async function (e) {

        e.preventDefault();  // Stop the page from reloading

        // Basic validation — check no fields are empty
        const inputs = contactForm.querySelectorAll('input, textarea');
        let allFilled = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                input.style.borderColor = '#ef4444';  // red border on empty fields
            } else {
                input.style.borderColor = '';  // reset if filled
            }
        });

        if (!allFilled) return;  // stop if validation fails

        // Send to Formspree
        const response = await fetch('https://formspree.io/f/mdalvked', {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) return;  // silently stop if send fails

        // Hide the form
        contactForm.style.opacity = '0';
        contactForm.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            contactForm.style.display = 'none';

            // Show success message
            formSuccess.classList.add('visible');
        }, 300);
    });
}