document.addEventListener("DOMContentLoaded", () => {
    // 1. LOAD HEADER
    fetch("./header.html") // Use ./ for GitHub relative paths
        .then(res => res.ok ? res.text() : Promise.reject('Header File Missing'))
        .then(data => {
            const headerElem = document.getElementById("mainHeader") || document.getElementById("site-header");
            if (headerElem) {
                headerElem.innerHTML = data;
                initMobileMenu();
                initScrollEffect(); // Start scroll effect AFTER header loads
            }
        }).catch(err => console.error(err));

    // 2. LOAD FOOTER
    fetch("./footer.html") // Use ./ for GitHub relative paths
        .then(res => {
            if (!res.ok) throw new Error("footer.html not found");
            return res.text();
        })
        .then(data => {
            const footerElem = document.getElementById("main-footer") || document.getElementById("site-footer");
            if (footerElem) {
                footerElem.innerHTML = data;
                console.log("SUCCESS: Footer loaded.");
            }
        }).catch(err => console.error(err));

    // 3. START ANIMATED COUNTERS
    // We wrap this in a slight delay to ensure the DOM is ready
    setTimeout(initCounters, 100);
});

// SCROLL EFFECT (Sticky Header)
function initScrollEffect() {
    window.onscroll = () => {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.pageYOffset > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    };
}

// COUNTER ANIMATION LOGIC
function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const speed = 200;
                
                const updateCount = () => {
                    const current = +counter.innerText.replace(/[+,k]/g, '');
                    const inc = target / speed;

                    if (current < target) {
                        const val = Math.ceil(current + inc);
                        counter.innerText = val >= 1000 ? (val/1000).toFixed(0) + 'k+' : val + '+';
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target >= 1000 ? (target/1000).toFixed(0) + 'k+' : target + '+';
                    }
                };
                updateCount();
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.2 }); // Trigger earlier for better UX

    counters.forEach(c => observer.observe(c));
}

// MOBILE MENU
function initMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", () => {
            const isFlex = navLinks.style.display === "flex";
            navLinks.style.display = isFlex ? "none" : "flex";
        });
    }
}
