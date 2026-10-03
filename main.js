// ============================================================
// HOW TO WRITE A JAVASCRIPT FUNCTION — THE FORMULA
// ============================================================
//
//  ANATOMY OF A FUNCTION:
//
//  function functionName(parameter1, parameter2) {
//      // code that runs when you call this function
//      return result;  // optional — sends a value back out
//  }
//
//  KEY WORDS & WHAT THEY DO:
//
//  function   → declares that you're creating a function (a reusable block of code)
//  const/let  → stores a value in a variable
//               - const = won't be reassigned (most of the time, use this)
//               - let   = will change later (like a counter)
//  return     → sends a value back out of the function
//  if / else  → makes a decision — "if this is true, do X, otherwise do Y"
//  for / forEach → loops through a list and does something for each item
//  addEventListener → listens for a user action (click, scroll, keydown, etc.)
//  document.querySelector  → finds ONE element on the page by CSS selector
//  document.querySelectorAll → finds ALL matching elements (returns a list)
//  classList.add/remove/toggle → adds, removes, or flips a CSS class on an element
//  setTimeout(fn, ms)  → runs a function after a delay (ms = milliseconds)
//  fetch(url)          → makes a request to load a file or external data
//
//  EXAMPLE — a simple function:
//
//  function greet(name) {
//      const message = "Aloha, " + name + "!";
//      return message;
//  }
//
//  greet("Lagi");  // → "Aloha, Lagi!"
//
//  EXAMPLE — a function that does something on the page:
//
//  function showMessage() {
//      const box = document.querySelector('.message-box');
//      box.classList.add('visible');
//  }
//  document.querySelector('.btn').addEventListener('click', showMessage);
//
// ============================================================


// ============================================================
// STARTUP CHECK
// ============================================================
// Runs immediately when the page loads — confirms JS is connected.
console.log("JavaScript is working!");


// ============================================================
// LOAD HEADER
// ============================================================
// fetch() loads an external file (header.html) and injects its
// HTML into the <div id="header"> placeholder on every page.
// The .then() chain runs after the file finishes loading.

fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;

        const nav = document.querySelector('.site-nav');
        const heroEl = document.querySelector('.hero');

        // Pages that don't have a hero (e.g. Skills, Contact)
        // need the nav bar visible right away — no scroll required.
        if (nav && !heroEl) {
            nav.classList.add('show');
        }

        // ── Mobile hamburger for site-nav ──
        // Must run here because header.html is loaded asynchronously.
        const navHamburger = document.getElementById('navHamburger');
        const navLinks     = document.getElementById('navLinks');

        if (navHamburger && navLinks) {
            navHamburger.addEventListener('click', function () {
                navLinks.classList.toggle('mobile-open');
                this.classList.toggle('open');
            });

            // Close menu when any nav link is tapped
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-open');
                    navHamburger.classList.remove('open');
                });
            });
        }
    });


// ============================================================
// HERO → NAV BAR ON SCROLL
// ============================================================
// The hero stays fixed behind the page. As the user scrolls, the
// white page sheet slides up over it. Once the sheet reaches the
// top (70px from it), the hero becomes the nav bar.
//
// Nothing changes size while the user is scrolling — that is what
// keeps it smooth on phones. requestAnimationFrame makes sure we
// only do the check once per screen refresh.

(function initHeroBar() {
    const hero   = document.querySelector('.hero');
    const spacer = document.querySelector('.hero-spacer');

    // If neither element exists, this is not the homepage — stop.
    if (!hero || !spacer) return;

    const BAR_HEIGHT = 70;   // must match .hero.shrunk height in styles.css
    let ticking = false;

    function update() {
        ticking = false;
        const switchPoint = spacer.offsetHeight - BAR_HEIGHT;
        hero.classList.toggle('shrunk', window.scrollY >= switchPoint);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update(); // set the right state on load (e.g. after a refresh mid-page)
})();


// ============================================================
// LOAD FOOTER
// ============================================================
// Same pattern as the header — loads footer.html and injects it
// into the <div id="footer"> placeholder on every page.

fetch('footer.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });


// ============================================================
// CAROUSEL SCROLL (Skills page)
// ============================================================
// Called by the arrow buttons on the skills carousel.
// direction is either 1 (right) or -1 (left).
// scrollBy() moves the container by a set number of pixels.

function scrollCarousel(direction) {
    const carousel = document.getElementById("skillsCarousel");
    const scrollAmount = 300;
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth"
    });
}


// ============================================================
// VIDEO AUTOPLAY (Projects page)
// ============================================================
// Uses an IntersectionObserver — a browser tool that watches
// whether an element is visible on screen.
// When a video enters the viewport, it plays (muted).
// When it leaves, it pauses.
// Hover temporarily unmutes so the user can hear it.

document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.instagram-video');

    // Options: only trigger when 50% of the video is visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                // Video is on screen — play it muted
                video.muted = true;
                video.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                });
            } else {
                // Video scrolled off screen — pause it
                video.pause();
                video.muted = true;
            }
        });
    }, observerOptions);

    // Attach the observer to every video on the page
    videos.forEach(video => {
        videoObserver.observe(video);

        // Unmute while hovering so the user can hear it
        video.addEventListener('mouseenter', function () {
            this.muted = false;
        });

        // Mute again when they stop hovering
        video.addEventListener('mouseleave', function () {
            this.muted = true;
        });
    });
});


// ============================================================
// TYPING ANIMATION (Homepage hero)
// ============================================================
// Cycles through a list of phrases, typing them one character
// at a time, then deleting them, then moving to the next phrase.
// Uses setTimeout() to control the speed of each step.

const phrases = [
    "Data & Operations.",
    "CS Graduate from BYU-Hawaiʻi.",
    "Health & Fitness Advocate",
    "Building for community impact."
];

let phraseIndex = 0;   // tracks which phrase we're on
let charIndex   = 0;   // tracks which character we're at
let isDeleting  = false; // true = we're deleting, false = we're typing

const typedEl = document.getElementById('typed-text');

function type() {
    // If the element doesn't exist (non-homepage), do nothing
    if (!typedEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Remove the last character
        typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
    } else {
        // Add the next character
        typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
    }

    // Typing is slower than deleting — feels more natural
    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Just finished typing the full phrase — pause, then start deleting
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Just finished deleting — move to the next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // loops back to 0 at the end
        speed = 400;
    }

    // Call this function again after the delay
    setTimeout(type, speed);
}

// Kick off the animation
type();


// ============================================================
// HERO NAME LETTER STAGGER (anime.js — index.html only)
// ============================================================
// Splits "Lagi Williams" into individual letter spans, then
// uses anime.js to stagger them in from below, one by one.
// anime.js is loaded via CDN in index.html — we guard with
// typeof check so this is safely ignored on other pages.

(function initNameStagger() {
    const heroName = document.querySelector('.home h1');
    if (!heroName || typeof anime === 'undefined') return;

    const text = heroName.textContent;

    // Wrap each character in a span, and each word in its own wrapper
    // so the name can only break between words (never mid-word on phones)
    heroName.setAttribute('aria-label', text);
    heroName.innerHTML = text.trim().split(/\s+/).map(word =>
        `<span class="name-word" aria-hidden="true">${
            word.split('').map(char => `<span class="name-letter">${char}</span>`).join('')
        }</span>`
    ).join(' ');

    anime({
        targets: '.name-letter',
        opacity:    [0, 1],
        translateY: [24, 0],
        easing:     'easeOutExpo',
        duration:   900,
        delay:      anime.stagger(55, { start: 150 })
    });
})();


// ============================================================
// READ MORE TOGGLE (Homepage about section)
// ============================================================
// Clicking the button expands or collapses the hidden paragraph.
// classList.toggle() adds the class if it's missing, removes it if it's there.

const readMoreBtn = document.getElementById('readMoreBtn');
const aboutMore   = document.querySelector('.about-more');

if (readMoreBtn && aboutMore) {
    readMoreBtn.addEventListener('click', function () {

        // Expand or collapse the hidden content
        aboutMore.classList.toggle('expanded');

        // Flip the button arrow
        readMoreBtn.classList.toggle('open');

        // Change button label based on current state
        const isOpen = aboutMore.classList.contains('expanded');
        readMoreBtn.querySelector('.btn-arrow').textContent = '↓';
        readMoreBtn.childNodes[0].textContent = isOpen ? 'Read less ' : 'Read more ';
    });
}


// ============================================================
// PROJECT DATA
// ============================================================
// This is the single source of truth for all project cards.
// To add a new project, copy one object block and fill it in.
// tags[] must match the data-filter values in projects.html.

const projects = [
    {
        id: 1,
        title: "Ala Kukui Program Attendee Demographic Dashboard",
        summary: "Attendee records going back to 2016 — pulled into one place, cleaned, and turned into a dashboard for grant reports.",
        tags: ["Google Sheets", "Data Analysis"],
        detail: `Built at Ala Kukui, a nonprofit retreat center in Hāna, Maui.
        Attendee records lived in separate sheets going back to 2016 — I
        consolidated them into one database, merged and removed duplicates,
        cleaned the data, and built formulas and visuals on top of it. The
        dashboard shows program growth, community demographics, and engagement
        for each program arm, and updates on its own as new entries are added.
        Used for grant reports and presentations to program attendees.
        Attendee data is private, so it is not shown here.`,
        status: "Complete"
    },
    {
        id: 5,
        title: "Tech-Moms Student Demographic Dashboard + SQL Analysis",
        summary: "A Google Sheets dashboard and a SQL analysis on the same anonymized Tech-Moms application data — who applies, who enrolls, and what the missing answers hide.",
        tags: ["Google Sheets", "SQL", "Data Analysis"],
        detail: `Two projects on the same anonymized Tech-Moms application data,
        built for the Data Analytics & AI cohort.

        Part 1, the dashboard in Google Sheets: I cleaned the raw export down to
        1,681 applicants, documented all 14 columns in a data dictionary, and
        built pivot tables to answer leadership's questions. The dashboard pulls
        it together for the 556 enrolled students — race and ethnicity, education
        level, employment status, household income, and family and household —
        with headline numbers down the side.

        Part 2, SQL in Deepnote. Three things I learned from the data: A lot of
        people apply but never actually make it into a cohort — there are way
        more "dead leads" than people who get placed, so there's a big drop-off
        happening somewhere in the process. Veterans got into a cohort a little
        less often than everyone else (29% vs 33%), but there were only 24
        veteran applicants total, so that's not enough people to call it a real
        trend. And many fields like employment status and veteran status have
        missing answers — 70 people skipped the employment question — so any
        percentages built off those columns aren't the full picture.

        How I used AI: I started by asking Claude to break down the order SQL
        clauses go in and the thought process behind building a query, then
        mostly used it for syntax help. I wrote my own cheat sheet by hand
        first, then had Claude turn it into a digital version.`,
        status: "Complete"
    },
    {
        id: 6,
        title: "Airbnb Dashboard",
        summary: "A Tableau dashboard on Seattle Airbnb listings — price by bedroom count and zip code, listing counts, and revenue across 2016.",
        tags: ["Tableau", "Data Analysis"],
        detail: `A Tableau dashboard built on Seattle Airbnb listing data as the full
        project in the Tech-Moms BI module, published on Tableau Public.

        Five views on one page: average price per bedroom (from about $96 a night
        for one bedroom to $585 for six), how many listings there are at each
        bedroom count (1,811 one-bedrooms, only 5 six-bedrooms), average price by
        zip code on a map and as a ranked bar chart, and weekly revenue across
        2016.`,
        image: "airbnb-dashboard.png",
        imageAlt: "Tableau dashboard of Seattle Airbnb listings: average price per bedroom, listing counts, price by zip code, and revenue for the year",
        link: "https://public.tableau.com/views/AirBnBFullProject_17895945228940/Dashboard1",
        linkLabel: "Open on Tableau Public",
        status: "Complete"
    },
    {
        id: 4,
        title: "Bike Sales Dashboard",
        summary: "1,000 customer records cleaned, pivoted, and turned into a dashboard showing who buys bikes.",
        tags: ["Google Sheets", "Data Analysis"],
        detail: `A Google Sheets project built for the Tech-Moms Data Analytics
        pre-requisite. I cleaned 1,000 customer records — spelled out coded
        values, tidied the formatting, and added age brackets — then built pivot
        tables and a dashboard on top.

        What the data showed: 48.1% of customers bought a bike (481 of 1,000).
        Buyers averaged $57,963 in income vs $54,875 for non-buyers. Middle-age
        customers bought the most (383 of 701), and people with a 0-1 mile
        commute bought more than any other group (200 of 366) — only 33 of 111
        with a commute over 10 miles did.`,
        link: "https://docs.google.com/spreadsheets/d/1QDPW3s2MvRyRhTOMOQvkH7ZSRyQgH_fdnIoPozsLoaQ/",
        linkLabel: "Open the Google Sheet",
        status: "Complete"
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
    // To add a new project, paste this template and fill it in:
    // {
    //     id: 7,
    //     title: "Your Project Title",
    //     summary: "One sentence description shown on the card.",
    //     tags: ["HTML", "CSS"],         // must match filter-btn data-filter values
    //     detail: `Longer description shown in the modal popup.`,
    //     image: "my-screenshot.png",    // optional — shows a picture in the popup
    //     imageAlt: "What the picture shows",
    //     link: "https://...",           // optional — adds a link in the popup
    //     linkLabel: "Open the project", // optional — text for that link
    //     status: "In Progress"          // or "Live", "Ongoing", "Complete"
    // },
];


// ============================================================
// PROJECT CARDS (Projects page)
// ============================================================
// buildCards() reads the projects array above and creates
// an HTML card for each one, then inserts them into the grid.
// It accepts an optional filter — if provided, only shows
// projects whose tags[] include that filter value.

const projectsGrid = document.getElementById('projectsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalTitle   = document.getElementById('modalTitle');
const modalTags    = document.getElementById('modalTags');
const modalStatus  = document.getElementById('modalStatus');
const modalDetail  = document.getElementById('modalDetail');
const modalImage    = document.getElementById('modalImage');
const modalLink     = document.getElementById('modalLink');
const modalLinkText = document.getElementById('modalLinkText');

function buildCards(filter = 'all') {
    // If the grid doesn't exist (not on Projects page), stop
    if (!projectsGrid) return;

    // Filter the array — or keep all if filter is 'all'
    const filtered = filter === 'all'
        ? projects
        : projects.filter(p => p.tags.includes(filter));

    // Clear whatever is currently in the grid
    projectsGrid.innerHTML = '';

    // If nothing matches, show a friendly empty message
    if (filtered.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <p>No projects yet for this category.</p>
                <p>Check back soon — I'm always building.</p>
            </div>
        `;
        return;
    }

    // Loop through filtered projects and build a card for each
    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Build the card's inner HTML using template literals (backtick strings)
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

        // Clicking anywhere on the card opens the modal for that project
        card.addEventListener('click', () => openModal(project));
        projectsGrid.appendChild(card);
    });
}


// ============================================================
// MODAL (Projects page)
// ============================================================
// openModal() fills in the popup with a specific project's data.
// closeModal() hides it again.
// Three ways to close: X button, click outside the box, Escape key.

function openModal(project) {
    // Fill the modal fields with this project's data
    modalTitle.textContent  = project.title;
    modalStatus.textContent = project.status;
    // A blank line in a project's detail text starts a new paragraph
    modalDetail.textContent = '';
    project.detail.split(/\n\s*\n/).forEach((part, i) => {
        if (i > 0) {
            modalDetail.appendChild(document.createElement('br'));
            modalDetail.appendChild(document.createElement('br'));
        }
        modalDetail.appendChild(document.createTextNode(part.replace(/\s+/g, ' ').trim()));
    });
    modalTags.innerHTML = project.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('');

    // Show the project screenshot only if this project has one
    if (modalImage) {
        if (project.image) {
            modalImage.src = project.image;
            modalImage.alt = project.imageAlt || project.title;
            modalImage.style.display = '';
        } else {
            modalImage.removeAttribute('src');
            modalImage.style.display = 'none';
        }
    }

    // Show the project link only if this project has one
    if (modalLink && modalLinkText) {
        if (project.link) {
            modalLink.href = project.link;
            modalLinkText.textContent = (project.linkLabel || 'Open the project') + ' →';
            modalLink.style.display = '';
        } else {
            modalLink.style.display = 'none';
        }
    }

    // Make the modal visible (CSS handles the transition)
    modalOverlay.classList.add('open');

    // Prevent the background page from scrolling while modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = ''; // restore scrolling
}

// Close via the X button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close by clicking the dark overlay area (outside the modal box)
if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
        // e.target is what was actually clicked — only close if it's the overlay itself
        if (e.target === modalOverlay) closeModal();
    });
}

// Close with the Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// Run buildCards once on page load to populate the grid
buildCards();


// ============================================================
// FILTER BUTTONS (Projects page)
// ============================================================
// When a filter button is clicked:
// 1. Remove the 'active' highlight from all buttons
// 2. Add 'active' to the one that was clicked
// 3. Call buildCards() with the selected filter tag

const filterBtns = document.querySelectorAll('.filter-btn');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {

            // Reset all buttons to inactive
            filterBtns.forEach(b => b.classList.remove('active'));

            // Highlight the clicked button
            this.classList.add('active');

            // Read the filter value set on this button in the HTML
            const filter = this.getAttribute('data-filter');

            // Rebuild the grid with the new filter applied
            buildCards(filter);
        });
    });
}


// ============================================================
// PROGRESS BAR ANIMATION (Homepage)
// ============================================================
// Uses IntersectionObserver to wait until the progress bars
// scroll into view before animating.
// Each bar's target width is set inline in the HTML (style="width: 35%").
// We temporarily set it to 0%, then restore the target so CSS
// animates the fill from left to right.

const progressBars = document.querySelectorAll('.building-progress');

if (progressBars.length > 0) {
    const barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Capture the intended final width
                const target = entry.target.style.width;

                // Reset to 0 so the animation starts from empty
                entry.target.style.width = '0%';

                // After a brief delay, set to final width — CSS transition does the rest
                setTimeout(() => {
                    entry.target.style.width = target;
                }, 100);

                // Stop watching this bar after it's animated once
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => barObserver.observe(bar));
}


// ============================================================
// CONTACT FORM (Contact page)
// ============================================================
// Intercepts the form submission, validates that all fields
// are filled, sends the data to Formspree (external service),
// then hides the form and shows a success message.

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', async function (e) {

        // Prevent the browser's default behavior (page reload on submit)
        e.preventDefault();

        // Check that every input and textarea has a value
        const inputs = contactForm.querySelectorAll('input, textarea');
        let allFilled = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                input.style.borderColor = '#ef4444'; // red = empty field
            } else {
                input.style.borderColor = ''; // clear the red if filled
            }
        });

        // Stop here if any field was empty
        if (!allFilled) return;

        // Send form data to Formspree — async/await waits for the response
        const response = await fetch('https://formspree.io/f/mdalvked', {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });

        // If the send failed, stop silently (could add error handling later)
        if (!response.ok) return;

        // Fade out the form
        contactForm.style.opacity = '0';
        contactForm.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            contactForm.style.display = 'none';

            // Show the "Message sent!" confirmation
            formSuccess.classList.add('visible');
        }, 300);
    });
}


// ============================================================
// MOBILE HAMBURGER — HERO NAV (Homepage)
// ============================================================
// The hero-nav is directly in index.html (not loaded via fetch),
// so we can initialize it here normally.
// The hamburger only becomes visible once the hero is shrunk
// (controlled via CSS: .hero.shrunk .hero-hamburger { opacity: 1 })

const heroHamburger = document.getElementById('heroHamburger');
const heroNavLinks  = document.getElementById('heroNavLinks');

if (heroHamburger && heroNavLinks) {
    heroHamburger.addEventListener('click', function () {
        heroNavLinks.classList.toggle('mobile-open');
        this.classList.toggle('open');
    });

    // Close menu when a link is tapped
    heroNavLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            heroNavLinks.classList.remove('mobile-open');
            heroHamburger.classList.remove('open');
        });
    });
}


// ============================================================
// SCROLL REVEAL
// ============================================================
// Watches key elements and fades them in as they scroll into view.
// Uses IntersectionObserver — same pattern as the video and progress bar observers.
// A small stagger delay (transitionDelay) is applied so sibling
// elements don't all animate at exactly the same time.

// ============================================================
// ROADMAP HOUR COUNTER (roadmap.html only)
// ============================================================
// Finds each .phase-hours element, reads the number in its text,
// then animates it counting up from 0 when it scrolls into view.
// Uses anime.js if available, falls back to a plain JS timer.

(function initHourCounters() {
    const hourEls = document.querySelectorAll('.phase-hours');
    if (hourEls.length === 0) return;

    hourEls.forEach(el => {
        const match = el.textContent.match(/(\d+)/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = el.textContent.replace(/[\d]/g, '').trim(); // e.g. "hrs"
        el.dataset.target = target;
        el.dataset.suffix = suffix;
        el.textContent = '0 ' + suffix; // start at 0
    });

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix;

            if (typeof anime !== 'undefined') {
                // Smooth count-up with anime.js
                anime({
                    targets: { val: 0 },
                    val: target,
                    round: 1,
                    duration: 1400,
                    easing: 'easeOutExpo',
                    update: function (anim) {
                        el.textContent = Math.floor(anim.animations[0].currentValue) + ' ' + suffix;
                    }
                });
            } else {
                // Plain JS fallback
                let current = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = Math.floor(current) + ' ' + suffix;
                    if (current >= target) clearInterval(timer);
                }, 16);
            }

            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    hourEls.forEach(el => {
        if (el.dataset.target) counterObserver.observe(el);
    });
})();


document.addEventListener('DOMContentLoaded', function () {
    const revealEls = document.querySelectorAll(
        '.exp-item, .roadmap-phase, .building-card, ' +
        '.skills-featured, .skills-group, .job-target, ' +
        '.phase-week-block, .about-content, .project-category'
    );

    if (revealEls.length === 0) return;

    // Mark each element as a reveal target and apply a subtle stagger
    revealEls.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.07}s`; // max 0.21s stagger
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // animate once only
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
});
